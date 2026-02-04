import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatTurnDto {
  @ApiProperty({ example: 'user', enum: ['user', 'model'] })
  @IsString()
  role: 'user' | 'model';

  @ApiProperty({ example: 'What properties do you have in Bangkok?' })
  @IsString()
  text: string;
}

export class ChatMessageDto {
  @ApiProperty({
    description: 'User message',
    example: 'I am looking for a 2-bedroom condo in Sukhumvit',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Previous chat turns for context',
    type: [ChatTurnDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatTurnDto)
  history?: ChatTurnDto[];
}
