import { ApiProperty } from "@nestjs/swagger";

export class UserRoleDto {
    @ApiProperty({
        description: '유저 아이디',
        example: 'abc123',
    })
    customId: string;
    
    @ApiProperty({
        description: '권한',
        example: 1,
    })
    role: number;
}