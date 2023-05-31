import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SmokingArea } from './smoking-area.entity';
import { SmokingAreaDto } from './dto/smoking-area.dto';
@Injectable()
export class SmokingAreaService {
    constructor(
    ) { }
    async getAllSmokingArea(
        queryRunnerManager: EntityManager,
        limit: number,
        page: number,
    ): Promise<SmokingAreaDto[]> {
        try {
            const smokingAreas = await queryRunnerManager.find(SmokingArea, {
                where: {
                    isDeleted: false
                },
                take: limit,
                skip: (page - 1) * limit
            })
            return smokingAreas;
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaDetail(queryRunnerManager: EntityManager, id: number): Promise<SmokingAreaDto> {
        try {
            const smokingArea = await queryRunnerManager.findOne(SmokingArea, {
                where: {
                    id: id,
                    isDeleted: false
                }
            })
            return smokingArea;
        } catch (e) {
            throw e;
        }
    }
}
