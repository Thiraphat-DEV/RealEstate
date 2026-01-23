import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
  HttpCode,
  HttpStatus,
  Param,
  NotFoundException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiExcludeEndpoint
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from '../../common/guards';
import { LoginDto, RegisterDto, AuthResponseDto, UserResponseDto } from './dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req): Promise<AuthResponseDto> {
    const ipAddress: string =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent: string = req.headers['user-agent'];
    return this.authService.login(req.user, ipAddress, userAgent);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists'
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req): UserResponseDto {
    const user = req.user;
    return {
      id: user.id || user._id || '',
      email: user.email,
      name: user.name
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current user' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Logout successful'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req): Promise<{ message: string }> {
    const user = req.user;
    const userId = user.id || user._id || '';
    const email = user.email;
    const ipAddress =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await this.authService.logout(
      userId,
      email,
      ipAddress as string,
      userAgent
    );

    return { message: 'Logout successful' };
  }

  @Get('user/:keycloakID')
  @ApiOperation({ summary: 'Get user by Keycloak ID' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByKeycloakID(
    @Param('keycloakID') keycloakID: string
  ): Promise<UserResponseDto> {
    const user = await this.authService.findUserByKeycloakID(keycloakID);

    if (!user) {
      throw new NotFoundException(
        'User not found with the provided Keycloak ID'
      );
    }

    return user;
  }

  // Keycloak OAuth
  @Get('keycloak')
  @UseGuards(AuthGuard('keycloak'))
  @ApiExcludeEndpoint()
  async keycloakAuth() {
    // Initiates Keycloak OAuth flow
  }

  @Get('keycloak/callback')
  @UseGuards(AuthGuard('keycloak'))
  @ApiExcludeEndpoint()
  async keycloakAuthCallback(@Request() req, @Res() res: Response) {
    const user = req.user;
    const ipAddress =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const token = await this.authService.login(
      user,
      ipAddress as string,
      userAgent
    );

    // Redirect to frontend with token
    res.redirect(
      `http://localhost:3000/auth/callback?token=${token.access_token}`
    );
  }
}
