import { ApiProperty, PickType } from "@nestjs/swagger";
import { SmokingArea, SmokingAreaComment, SmokingAreaRate } from "../smoking-area.entity";

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
    'deleteReason',
    'isApproved'
] as const) { }

export class SmokingAreaUpdateDto extends PickType(SmokingArea, [
    'id',
    'name',
    'latitude',
    'longitude',
    'address',
    'description',
    'image',
    'tags',
    'deleteReason',
    'isApproved'
] as const) { }

export class SmokingAreaCommentDto extends PickType(SmokingAreaComment, [
    'id',
    'smokingAreaId',
    'content',
    'createdBy',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'isDeleted',
    'deleteReason'
] as const) { }

export class SmokingAreaRateDto extends PickType(SmokingAreaRate, [
    'id',
    'smokingAreaId',
    'rate',
    'createdBy',
    'createdAt',
    'updatedAt',
] as const) { }

export class SmokingAreaCommentCreateDto extends PickType(SmokingAreaComment, [
    'content',
] as const) { }

export class SmokingAreaCreateDto extends PickType(SmokingArea, [
    'name',
    'latitude',
    'longitude',
    'address',
    'description',
    'image',
    'tags',
] as const) { }

export class SmokingAreaDetailDto {
    @ApiProperty({ description: "흡연구역 정보", type: SmokingAreaDto })
    smokingArea: SmokingAreaDto;

    @ApiProperty({ description: "흡연구역 평점", type: Number })
    rating: number;

    @ApiProperty({ description: "흡연구역 평가 수", type: Number })
    ratingCount: number;

    @ApiProperty({ description: "흡연구역 댓글", type: SmokingAreaCommentDto, isArray: true })
    comments: SmokingAreaCommentDto[];
}