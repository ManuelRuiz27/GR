import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { SelectTableDto } from './dto/select-table.dto';

@Controller()
export class LayoutController {
    constructor(private layoutService: LayoutService) { }

    @Get('events/:eventId/layout/overview')
    @UseGuards(JwtAuthGuard)
    async getLayoutOverview(@Param('eventId') eventId: string, @GetUser() user: any) {
        return this.layoutService.getLayoutOverview(eventId, user.id);
    }

    @Post('graduates/me/layout/selection')
    @UseGuards(JwtAuthGuard)
    async selectTable(@GetUser() user: any, @Body() dto: SelectTableDto) {
        return this.layoutService.selectTable(user.id, dto.table_id);
    }
}
