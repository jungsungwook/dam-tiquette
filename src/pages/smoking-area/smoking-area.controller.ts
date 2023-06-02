import { Controller, Get, Req, UseInterceptors, HttpException, Param, Query, Post, Body, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SmokingAreaService } from "./smoking-area.service";
import { TransactionInterceptor } from "src/decorators/TransactionInterceptor.decorator";
import { TransactionManager } from "src/decorators/TransactionManager.decorator";
import { EntityManager } from "typeorm";
import { SmokingAreaCommentCreateDto, SmokingAreaCommentDto, SmokingAreaCreateDto, SmokingAreaDetailDto, SmokingAreaDto, SmokingAreaRateDto } from "./dto/smoking-area.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "../users/user.entity";


@Controller('smoking-area')
@UseInterceptors(TransactionInterceptor)
@ApiTags('흡연 구역')
export class SmokingAreaController {
    constructor(
        private readonly smokingAreaService: SmokingAreaService
    ) { }

    @Get('/')
    @ApiOperation({ summary: '흡연 구역 조회' })
    async getSmokingArea(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Query('search') search?: string,
        @Query('tags') tags?: string,
        @Query('address') address?: string,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
    ): Promise<{ statusCode: string, contents: SmokingAreaDto[] }> {
        try {
            console.log("request url: ", req.url)
            console.log("receive: search", search)
            // 쿼리 파라미터가 없을 경우
            if (!search && !tags && !address) {
                const result = await this.smokingAreaService.getAllSmokingArea(
                    queryRunnerManager,
                    limit,
                    page
                );
                return { statusCode: '200', contents: result };
            } else {
                const result = await this.smokingAreaService.getSmokingAreaBySearch(
                    queryRunnerManager,
                    search,
                    tags,
                    address,
                    limit,
                    page
                );
                return { statusCode: '200', contents: result };
            }
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }

    }

    @Get('/:id')
    @ApiOperation({ summary: '흡연 구역 상세 조회' })
    async getSmokingAreaDetail(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Param('id') id: number
    ): Promise<{ statusCode: string, contents: SmokingAreaDetailDto }> {
        try {
            const result = await this.smokingAreaService.getSmokingAreaDetail(
                queryRunnerManager,
                id
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 등록(신청)' })
    async createSmokingArea(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Body() body: SmokingAreaCreateDto,
        @GetUser() user: User,
    ): Promise<{ statusCode: string, contents: SmokingAreaDto }> {
        try {
            const result = await this.smokingAreaService.createSmokingArea(
                queryRunnerManager,
                body,
                user
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Get('/:id/comment')
    @ApiOperation({ summary: '흡연 구역 댓글 조회' })
    async getSmokingAreaComment(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Param('id') id: number,
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
    ): Promise<{ statusCode: string, contents: SmokingAreaCommentDto[] }> {
        try {
            const result = await this.smokingAreaService.getSmokingAreaComment(
                queryRunnerManager,
                id,
                limit,
                page
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/:id/comment')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 댓글 등록' })
    async createSmokingAreaComment(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Param('id') id: number,
        @Body() body: SmokingAreaCommentCreateDto,
        @GetUser() user: User,
    ): Promise<{ statusCode: string, contents: SmokingAreaCommentDto }> {
        try {
            const result = await this.smokingAreaService.createSmokingAreaComment(
                queryRunnerManager,
                id,
                body,
                user
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Get('/:id/rate')
    @ApiOperation({ summary: '흡연 구역 평점 조회' })
    async getSmokingAreaRate(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Param('id') id: number,
    ): Promise<{
        statusCode: string, contents: {
            rating: number,
            ratingCount: number,
        }
    }> {
        try {
            const rating = await this.smokingAreaService.getSmokingAreaRating(
                queryRunnerManager,
                id,
            );
            return { statusCode: '200', contents: rating };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }

    @Post('/:id/rate')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '흡연 구역 평점 등록' })
    async createSmokingAreaRate(
        @Req() req: Request,
        @TransactionManager() queryRunnerManager: EntityManager,
        @Param('id') id: number,
        @Body() body: { rate: number },
        @GetUser() user: User,
    ): Promise<{ statusCode: string, contents: SmokingAreaRateDto }> {
        try {
            const result = await this.smokingAreaService.createSmokingAreaRate(
                queryRunnerManager,
                id,
                body.rate,
                user
            );
            return { statusCode: '200', contents: result };
        } catch (e) {
            throw new HttpException(e.message, e.status | 500);
        }
    }
}
