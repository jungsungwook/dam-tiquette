import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class SmokingArea extends BaseEntity {
    @ApiProperty({ description: '흡연구역 고유번호', example: '1' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '흡연구역 이름', example: '흡연구역1' })
    @Column({
        default: '흡연구역'
    })
    name: string;

    @ApiProperty({ description: '흡연구역 위도', example: 37.123456 })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 10
    })
    latitude: number;

    @ApiProperty({ description: '흡연구역 경도', example: 127.123456 })
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 10
    })
    longitude: number;

    @ApiProperty({ description: '흡연구역 주소', example: '경기도 성남시 분당구 판교역로 235' })
    @Column({
        nullable: true
    })
    address: string;

    @ApiProperty({ description: '흡연구역 설명', example: '흡연구역 설명입니다.' })
    @Column({
        nullable: true
    })
    description: string;

    @ApiProperty({ description: '흡연구역 이미지', example: '흡연구역 이미지입니다.' })
    @Column({
        nullable: true
    })
    image: string;

    @ApiProperty({ description: '흡연구역 태그', example: '[태그1, 태그2, 태그3]', isArray: true})
    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @ApiProperty({ description: '등록자', example: 'user' })
    @Column({
        default: 'system'
    })
    createdBy: string;

    @ApiProperty({ description: '등록일자', example: '2021-01-01 00:00:00' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ApiProperty({ description: '수정일자', example: '2021-01-01 00:00:00' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ApiProperty({ description: '삭제일자', example: '2021-01-01 00:00:00' })
    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ApiProperty({ description: '삭제여부', example: 'false' })
    @Column({ default: false })
    isDeleted: boolean;

    @ApiProperty({ description: '삭제 이유', example: '사용자의 요청으로 인해 삭제되었습니다.' })
    @Column({ nullable: true })
    deleteReason: string;

    @ApiProperty({ description: '관리자 승인 여부', example: 'false' })
    @Column({ default: false })
    isApproved: boolean;
}

@Entity()
export class SmokingAreaRate extends BaseEntity {
    @ApiProperty({ description: '흡연구역 평가 고유번호', example: '1' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '흡연구역 고유번호', example: '1' })
    @Column()
    smokingAreaId: number;

    @ApiProperty({ description: '흡연구역 평가자', example: 'user' })
    @Column()
    createdBy: string;

    @ApiProperty({ description: '흡연구역 평가', example: '5' })
    @Column()
    rate: number;

    @ApiProperty({ description: '등록일자', example: '2021-01-01 00:00:00' })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ApiProperty({ description: '수정일자', example: '2021-01-01 00:00:00' })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ApiProperty({ description: '삭제일자', example: '2021-01-01 00:00:00' })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ApiProperty({ description: '삭제여부', example: 'false' })
    @Column({ default: false })
    isDeleted: boolean;
}

@Entity()
export class SmokingAreaComment extends BaseEntity {
    @ApiProperty({ description: '흡연구역 댓글 고유번호', example: '1' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: '흡연구역 고유번호', example: '1' })
    @Column()
    smokingAreaId: number;

    @ApiProperty({ description: '흡연구역 댓글 작성자', example: 'user' })
    @Column()
    createdBy: string;

    @ApiProperty({ description: '흡연구역 댓글 내용', example: '흡연구역 댓글 내용입니다.' })
    @Column()
    content: string;

    @ApiProperty({ description: '등록일자', example: '2021-01-01 00:00:00' })
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ApiProperty({ description: '수정일자', example: '2021-01-01 00:00:00' })
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ApiProperty({ description: '삭제일자', example: '2021-01-01 00:00:00' })
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ApiProperty({ description: '삭제여부', example: 'false' })
    @Column({ default: false })
    isDeleted: boolean;

    @ApiProperty({ description: '삭제 이유', example: '사용자의 요청으로 인해 삭제되었습니다.' })
    @Column({ nullable: true })
    deleteReason: string;
}