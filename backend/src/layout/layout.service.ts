import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LayoutService {
    constructor(private prisma: PrismaService) { }

    async getLayoutOverview(eventId: string, graduateId?: string) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            select: {
                id: true,
                name: true,
                capacity: true,
            },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const tables = await this.prisma.table.findMany({
            where: { event_id: eventId },
            include: {
                selections: {
                    include: {
                        graduate: {
                            include: {
                                tickets: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                label: 'asc',
            },
        });

        // Get graduate's current selection if authenticated
        let mySelection = null;
        if (graduateId) {
            const selection = await this.prisma.tableSelection.findUnique({
                where: { graduate_id: graduateId },
                include: {
                    table: true,
                },
            });
            if (selection) {
                mySelection = {
                    table_id: selection.table_id,
                    table_label: selection.table.label,
                };
            }
        }

        // Calculate availability for each table
        const tablesWithAvailability = tables.map((table) => {
            const occupiedSeats = table.selections.reduce((sum, selection) => {
                return sum + (selection.graduate.tickets[0]?.tickets_count || 0);
            }, 0);

            const availableSeats = table.capacity - occupiedSeats;
            const status = availableSeats > 0 ? 'available' : 'full';

            return {
                id: table.id,
                label: table.label,
                capacity: table.capacity,
                available_seats: availableSeats,
                status: table.status === 'blocked' ? 'blocked' : status,
                position_x: table.position_x,
                position_y: table.position_y,
                is_selected_by_me: graduateId ? table.selections.some(s => s.graduate_id === graduateId) : false,
            };
        });

        return {
            event,
            tables: tablesWithAvailability,
            my_selection: mySelection,
        };
    }

    async selectTable(graduateId: string, tableId: string) {
        return await this.prisma.$transaction(async (tx) => {
            // 1. Get graduate with tickets
            const graduate = await tx.graduate.findUnique({
                where: { id: graduateId },
                include: {
                    tickets: true,
                    table_selection: true,
                },
            });

            if (!graduate) {
                throw new NotFoundException('Graduate not found');
            }

            if (!graduate.tickets || graduate.tickets.length === 0) {
                throw new BadRequestException('You must select tickets first');
            }

            const requiredSeats = graduate.tickets[0].tickets_count;

            // 2. Get table with current selections
            const table = await tx.table.findUnique({
                where: { id: tableId },
                include: {
                    selections: {
                        include: {
                            graduate: {
                                include: {
                                    tickets: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!table) {
                throw new NotFoundException('Table not found');
            }

            if (table.status === 'blocked') {
                throw new BadRequestException('This table is blocked');
            }

            // 3. Calculate available seats
            const occupiedSeats = table.selections.reduce((sum, selection) => {
                // Don't count current graduate's seats if they're already at this table
                if (selection.graduate_id === graduateId) {
                    return sum;
                }
                return sum + (selection.graduate.tickets[0]?.tickets_count || 0);
            }, 0);

            const availableSeats = table.capacity - occupiedSeats;

            if (availableSeats < requiredSeats) {
                throw new BadRequestException(
                    `This table only has ${availableSeats} seats available and you need ${requiredSeats}`,
                );
            }

            // 4. Delete existing selection if any
            if (graduate.table_selection) {
                await tx.tableSelection.delete({
                    where: { id: graduate.table_selection.id },
                });
            }

            // 5. Create new selection
            const selection = await tx.tableSelection.create({
                data: {
                    graduate_id: graduateId,
                    table_id: tableId,
                },
                include: {
                    table: true,
                },
            });

            // 6. Update graduate progress
            await tx.graduate.update({
                where: { id: graduateId },
                data: {
                    layout_step: 'completed',
                },
            });

            return {
                success: true,
                table: {
                    id: selection.table.id,
                    label: selection.table.label,
                    capacity: selection.table.capacity,
                },
                message: 'Table selected successfully',
            };
        });
    }
}
