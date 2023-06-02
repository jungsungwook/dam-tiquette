import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SmokingArea, SmokingAreaComment, SmokingAreaRate } from "./smoking-area.entity";
import { SmokingAreaController } from "./smoking-area.controller";
import { SmokingAreaService } from "./smoking-area.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SmokingArea,
            SmokingAreaComment,
            SmokingAreaRate,
        ]),
    ],
    controllers: [SmokingAreaController],
    providers: [SmokingAreaService],
    exports: [SmokingAreaService, TypeOrmModule],
})
export class SmokingAreaModule { }