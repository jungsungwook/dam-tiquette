import { Controller, Get, Req, UseInterceptors, HttpException, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SmokingAreaService } from "./smoking-area.service";
import { TransactionInterceptor } from "src/decorators/TransactionInterceptor.decorator";
import { TransactionManager } from "src/decorators/TransactionManager.decorator";
import { EntityManager } from "typeorm";
import { SmokingAreaDto } from "./dto/smoking-area.dto";


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
            // 쿼리 파라미터가 없을 경우
            if (!search && !tags && !address) {
                const result = await this.smokingAreaService.getAllSmokingArea(
                    queryRunnerManager,
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
    ): Promise<{ statusCode: string, contents: SmokingAreaDto }> {
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
}
