import { Body, Controller, Get, HttpException, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminInterceptor } from "src/decorators/AdminInterceptor.decorator";
import { TransactionInterceptor } from "src/decorators/TransactionInterceptor.decorator";
import { AdminService } from "./admin.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "../users/user.entity";
import { UserRoleDto } from "./dto/user-role.dto";
import { TransactionManager } from "src/decorators/TransactionManager.decorator";
import { EntityManager } from "typeorm";
import { UsersService } from "../users/users.service";
import { SmokingAreaDto, SmokingAreaUpdateDto } from "../smoking-area/dto/smoking-area.dto";

@Controller('admin')
@UseInterceptors(AdminInterceptor)
@UseInterceptors(TransactionInterceptor)
@ApiTags('어드민 페이지')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UsersService,
    ) { }

    @Post('/role')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '권한 부여' })
    async userRole(
        @GetUser() user: User,
        @Body() body: UserRoleDto,
        @TransactionManager() queryRunnerManager: EntityManager,
    ): Promise<{ statusCode: string, contents: User }> {
        try {
            const userObj = await this.userService.getUserByCustomId(body.customId);
            if (!userObj) {
                throw new HttpException('존재하지 않는 유저입니다.', 404);
            }
            if (userObj.role === body.role) {
                throw new HttpException('이미 해당 권한을 가지고 있습니다.', 409);
            }
            const result = await this.adminService.setUserRole(userObj, body.role, queryRunnerManager);
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Get('/smoking-area/approval')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 승인 대기 조회' })
    async getSmokingAreaApproval(
        @GetUser() user: User,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
    ): Promise<{ statusCode: string, contents: SmokingAreaDto[] }> {
        try {
            const result = await this.adminService.getSmokingAreaApprovals(
                queryRunnerManager,
                limit,
                page
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/smoking-area/approval')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 승인' })
    async approveSmokingArea(
        @GetUser() user: User,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Body() body: { ids: number[] }
    ): Promise<{ statusCode: string, contents: SmokingAreaDto[] }> {
        try {
            const result : SmokingAreaDto[] = [];
            for (const id of body.ids) {
                const smokingArea = await this.adminService.approveSmokingArea(queryRunnerManager, id);
                if(smokingArea){
                    result.push(smokingArea);
                }
            }
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/smoking-area/reject')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 거절' })
    async rejectSmokingArea(
        @GetUser() user: User,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Body() body: { ids: number[] }
    ): Promise<{ statusCode: string, contents: SmokingAreaDto[] }> {
        try {
            const result : SmokingAreaDto[] = [];
            for (const id of body.ids) {
                const smokingArea = await this.adminService.rejectSmokingArea(queryRunnerManager, id);
                if (smokingArea) {
                    result.push(smokingArea);
                }
            }
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/smoking-area/update')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 수정' })
    async updateSmokingArea(
        @GetUser() user: User,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Body() body: SmokingAreaUpdateDto,
    ): Promise<{ statusCode: string, contents: SmokingAreaDto }> {
        try {
            const result = await this.adminService.updateSmokingArea(queryRunnerManager, body);
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }
}