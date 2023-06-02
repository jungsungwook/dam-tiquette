import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SmokingArea, SmokingAreaComment, SmokingAreaRate } from './smoking-area.entity';
import { SmokingAreaCommentCreateDto, SmokingAreaCommentDto, SmokingAreaCreateDto, SmokingAreaDetailDto, SmokingAreaDto, SmokingAreaRateDto } from './dto/smoking-area.dto';
import { User } from '../users/user.entity';
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
                    isDeleted: false,
                    isApproved: true
                },
                take: limit,
                skip: (page - 1) * limit
            })
            return smokingAreas;
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaBySearch(
        queryRunnerManager: EntityManager,
        search?: string,
        tags?: string,
        address?: string,
        limit: number = 10,
        page: number = 1,
    ): Promise<SmokingAreaDto[]> {
        try {
            const smokingAreas = await queryRunnerManager.find(SmokingArea, {
                where: {
                    isDeleted: false,
                    isApproved: true
                },
                take: limit,
                skip: (page - 1) * limit
            }).then((result) => {
                return result.filter((item) => {
                    if (search) {
                        if (item.name && item.name.includes(search)) {
                            return true;
                        } else if (item.address && item.address.includes(search)) {
                            return true;
                        } else if (item.description && item.description.includes(search)) {
                            return true;
                        } else if (item.tags && item.tags.includes(search)) {
                            return true;
                        }
                    }
                    if (tags) {
                        if (item.tags && item.tags.includes(tags)) {
                            return true;
                        }
                    }
                    if (address) {
                        if (item.address && item.address.includes(address)) {
                            return true;
                        }
                    }
                    return false;
                })
            });
            return smokingAreas;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    async getSmokingAreaDetail(queryRunnerManager: EntityManager, id: number): Promise<SmokingAreaDetailDto> {
        try {
            const smokingArea = await queryRunnerManager.findOne(SmokingArea, {
                where: {
                    id: id,
                    isDeleted: false,
                    isApproved: true
                }
            });
            const smokingAreaComments = await this.getSmokingAreaComment(queryRunnerManager, id, 10, 1);
            const smokingAreaRates = await this.getSmokingAreaRates(queryRunnerManager, id);
            const smokingAreaDetail: SmokingAreaDetailDto = {
                smokingArea: smokingArea,
                rating: smokingAreaRates.reduce((acc, cur) => acc + cur.rate, 0) / smokingAreaRates.length,
                ratingCount: smokingAreaRates.length,
                comments: smokingAreaComments
            }
            return smokingAreaDetail;
        } catch (e) {
            throw e;
        }
    }

    async createSmokingArea(
        queryRunnerManager: EntityManager,
        smokingAreaDto: SmokingAreaCreateDto,
        user: User
    ): Promise<SmokingAreaDto> {
        try {
            const smokingArea: SmokingAreaDto = await queryRunnerManager.save(SmokingArea, {
                ...smokingAreaDto,
                createdBy: user.customId,
                updatedBy: user.customId
            })
            return smokingArea;
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaComment(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
        limit: number,
        page: number,
    ): Promise<SmokingAreaCommentDto[]> {
        try {
            const smokingAreaComments = await queryRunnerManager.find(SmokingAreaComment, {
                where: {
                    smokingAreaId: smokingAreaId,
                    isDeleted: false
                },
                take: limit,
                skip: (page - 1) * limit
            });
            return smokingAreaComments;
        } catch (e) {
            throw e;
        }
    }

    async createSmokingAreaComment(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
        comment: SmokingAreaCommentCreateDto,
        user: User
    ): Promise<SmokingAreaCommentDto> {
        try {
            const smokingAreaComment: SmokingAreaComment = await queryRunnerManager.save(SmokingAreaComment, {
                smokingAreaId: smokingAreaId,
                comment: comment,
                createdBy: user.customId,
                updatedBy: user.customId
            });
            return smokingAreaComment;
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaRates(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
    ): Promise<SmokingAreaRateDto[]> {
        try {
            const smokingAreaRate: SmokingAreaRateDto[] = await queryRunnerManager.find(SmokingAreaRate, {
                where: {
                    smokingAreaId: smokingAreaId,
                    isDeleted: false
                }
            });
            return smokingAreaRate;
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaRating(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
    ): Promise<{ rating: number, ratingCount: number }> {
        try {
            const smokingAreaRate: SmokingAreaRateDto[] = await queryRunnerManager.find(SmokingAreaRate, {
                where: {
                    smokingAreaId: smokingAreaId,
                    isDeleted: false
                }
            });
            return {
                rating: smokingAreaRate.reduce((acc, cur) => acc + cur.rate, 0) / smokingAreaRate.length,
                ratingCount: smokingAreaRate.length
            }
        } catch (e) {
            throw e;
        }
    }

    async createSmokingAreaRate(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
        rate: number,
        user: User
    ): Promise<SmokingAreaRateDto> {
        try {
            const alreadRate = await queryRunnerManager.findOne(SmokingAreaRate, {
                where: {
                    smokingAreaId: smokingAreaId,
                    createdBy: user.customId,
                    isDeleted: false
                }
            });
            if (alreadRate) {
                throw new Error('이미 평가한 흡연구역입니다.');
            }
            const smokingAreaRate: SmokingAreaRateDto = await queryRunnerManager.save(SmokingAreaRate, {
                smokingAreaId: smokingAreaId,
                rate: rate,
                createdBy: user.customId,
                updatedBy: user.customId
            });
            return smokingAreaRate;
        } catch (e) {
            throw e;
        }
    }
}
