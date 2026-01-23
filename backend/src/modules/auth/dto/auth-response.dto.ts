import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class UserResponseBase {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'User ID (MongoDB ObjectId)'
  })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;
}

export class UserResponse {
  _id?: string;
  id?: string;
  email: string;
  name: string;
}

export class UserResponseDto extends IntersectionType(UserResponseBase) {}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  access_token: string;

  @ApiProperty({ type: UserResponseDto, description: 'User information' })
  user: UserResponseDto;
}
