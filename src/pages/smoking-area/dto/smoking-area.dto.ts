import { PickType } from "@nestjs/swagger";
import { SmokingArea } from "../smoking-area.entity";

export class SmokingAreaDto extends PickType(SmokingArea, [
    'id',
    'name',
    'latitude',
    'longitude',
    'address',
    'description',
    'image',
    'tags',
    'createdBy',
    'createdAt',
    'updatedAt',
    'isDeleted',
] as const) { }