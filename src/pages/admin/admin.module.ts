import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { SmokingAreaModule } from '../smoking-area/smoking-area.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        UsersModule,
        SmokingAreaModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [TypeOrmModule],
})
export class AdminModule { }