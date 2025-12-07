import { Controller, Get, Post, Patch, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { GraduatesService } from './graduates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreateTicketDto, AddGuestsDto } from './dto/ticket.dto';
import { UpdateGuestDto } from './dto/guest.dto';

@Controller('graduates')
@UseGuards(JwtAuthGuard)
export class GraduatesController {
    constructor(private graduatesService: GraduatesService) { }

    @Get('me')
    async getProfile(@GetUser() user: any) {
        return this.graduatesService.getProfile(user.id);
    }

    @Get('me/dashboard')
    async getDashboard(@GetUser() user: any) {
        return this.graduatesService.getDashboard(user.id);
    }

    @Post('me/tickets')
    async createTickets(@GetUser() user: any, @Body() dto: CreateTicketDto) {
        return this.graduatesService.createTickets(user.id, dto);
    }

    @Get('me/guests')
    async getGuests(@GetUser() user: any) {
        return this.graduatesService.getGuests(user.id);
    }

    @Post('me/guests')
    async addGuests(@GetUser() user: any, @Body() dto: AddGuestsDto) {
        return this.graduatesService.addGuests(user.id, dto);
    }

    @Patch('me/guests/:guestId')
    async updateGuest(
        @GetUser() user: any,
        @Param('guestId') guestId: string,
        @Body() dto: UpdateGuestDto,
    ) {
        return this.graduatesService.updateGuest(user.id, guestId, dto);
    }

    @Get('me/meals')
    async getMeals(@GetUser() user: any) {
        return this.graduatesService.getMeals(user.id);
    }

    @Patch('me/meals/:guestId')
    async updateMeal(
        @GetUser() user: any,
        @Param('guestId') guestId: string,
        @Body() dto: any,
    ) {
        return this.graduatesService.updateMeal(user.id, guestId, dto.meal_type);
    }

    @Get('me/thermo')
    async getThermoStatus(@GetUser() user: any) {
        return this.graduatesService.getThermoStatus(user.id);
    }

    @Post('me/thermo')
    async customizeThermo(@GetUser() user: any, @Body() dto: any) {
        return this.graduatesService.customizeThermo(user.id, dto.prefix, dto.name);
    }

    // Temporary endpoint to reset corrupted tickets
    @Delete('me/tickets')
    async deleteTickets(@GetUser() user: any) {
        console.log('DELETE /graduates/me/tickets called by user:', user?.id);
        return this.graduatesService.resetTickets(user.id);
    }
}
