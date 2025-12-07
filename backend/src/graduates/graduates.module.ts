import { Module } from '@nestjs/common';
import { GraduatesController } from './graduates.controller';
import { GraduatesService } from './graduates.service';

@Module({
    controllers: [GraduatesController],
    providers: [GraduatesService],
})
export class GraduatesModule { }
