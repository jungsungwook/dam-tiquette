import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { EntityManager } from "typeorm";
import { SmokingAreaService } from "../smoking-area/smoking-area.service";
import { SmokingArea } from "../smoking-area/smoking-area.entity";
import { SmokingAreaUpdateDto } from "../smoking-area/dto/smoking-area.dto";

@Injectable()
export class AdminService {
    constructor(
        private readonly smokingAreaService: SmokingAreaService,
    ) { }

    async setUserRole(
        user: User,
        role: number,
        queryRunnerManager: EntityManager
    ): Promise<User> {
        try {
            user.role = role;
            return await queryRunnerManager.save(user);
        } catch (e) {
            throw e;
        }
    }

    async getSmokingAreaApprovals(
        queryRunnerManager: EntityManager,
        limit: number,
        page: number
    ): Promise<any[]> {
        try {
            const smokingAreas = await queryRunnerManager.find(SmokingArea, {
                where: {
                    isDeleted: false,
                    isApproved: false
                },
                take: limit,
                skip: (page - 1) * limit
            })
            return smokingAreas;
        } catch (e) {
            throw e;
        }
    }

    async approveSmokingArea(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
    ) {
        try {
            const smokingArea = await queryRunnerManager.findOne(SmokingArea, {
                where: {
                    id: smokingAreaId,
                    isDeleted: false,
                    isApproved: false
                }
            });
            if (smokingArea) {
                smokingArea.isApproved = true;
                return await queryRunnerManager.save(smokingArea);
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    async rejectSmokingArea(
        queryRunnerManager: EntityManager,
        smokingAreaId: number,
    ) {
        try {
            const smokingArea = await queryRunnerManager.findOne(SmokingArea, {
                where: {
                    id: smokingAreaId,
                    isDeleted: false,
                    isApproved: false
                }
            });
            if (smokingArea) {
                smokingArea.isDeleted = true;
                smokingArea.deleteReason = "흡연 구역 승인 거부";
                return await queryRunnerManager.save(smokingArea);
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    async updateSmokingArea(
        queryRunnerManager: EntityManager,
        body: SmokingAreaUpdateDto,
    ) {
        try {
            const smokingArea = await queryRunnerManager.findOne(SmokingArea, {
                where: {
                    id: body.id,
                }
            });
            if (smokingArea) {
                Object.keys(body).forEach((key) => {
                    smokingArea[key] = body[key];
                });
                return await queryRunnerManager.save(smokingArea);
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

}