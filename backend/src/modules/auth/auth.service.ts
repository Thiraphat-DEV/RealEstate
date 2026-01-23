import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserEntity, UserDocument } from '../schema/user.entity';
import {
  UserTransactionEntity,
  UserTransactionDocument
} from '../schema/Logging/user_transaction.entity';
import {
  AuthResponseDto,
  UserResponseDto,
  UserResponse
} from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserTransactionEntity.name)
    private userTransactionModel: Model<UserTransactionDocument>,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    try {
      // Use select('+password') to include password field (since it has select: false)
      const user = await this.userModel
        .findOne({ email: email.toLowerCase() })
        .select('+password')
        .exec();

      if (!user) {
        console.log(`User not found with email: ${email}`);
        return null;
      }

      if (!user.password) {
        console.log(`User found but has no password: ${email}`);
        return null;
      }

      try {
        const isValid = await argon2.verify(user.password, password);
        if (isValid) {
          console.log(`Password verified successfully for user: ${email}`);
          return {
            id: user._id?.toString(),
            _id: user._id?.toString(),
            email: user.email,
            name: user.name
          };
        } else {
          console.log(`Password verification failed for user: ${email}`);
        }
      } catch (error) {
        // Argon2 verification failed
        console.error('Password verification error:', error);
        return null;
      }
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }

    return null;
  }

  async login(
    user: UserResponse,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponseDto> {
    const userId = user.id || user._id;
    const payload = { email: user.email, sub: userId };
    const response: AuthResponseDto = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        email: user.email,
        name: user.name
      }
    };

    // Log user transaction for login
    try {
      await this.logUserTransaction(
        userId,
        user.email,
        'login',
        ipAddress,
        userAgent
      );
    } catch (error) {
      // Don't fail login if logging fails
      console.error('Failed to log user transaction:', error);
    }

    return response;
  }

  async logUserTransaction(
    userId: string,
    email: string,
    action: 'login' | 'logout',
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const transaction = new this.userTransactionModel({
        userId,
        email,
        action,
        ipAddress,
        userAgent,
        createBy: userId,
        updateBy: userId
      });

      await transaction.save();
      console.log(`User transaction logged: ${action} for user ${email}`);
    } catch (error) {
      console.error('Error logging user transaction:', error);
      // Don't throw error, just log it
    }
  }

  async logout(
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      // Validate user exists
      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Log user transaction for logout (for all users, not just Keycloak users)
      await this.logUserTransaction(
        userId,
        email,
        'logout',
        ipAddress,
        userAgent
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Don't fail logout if logging fails
      console.error('Failed to log user transaction:', error);
    }
  }

  async validateOAuthUser(profile: any): Promise<UserResponse> {
    // OAuth user validation logic
    const keycloakID = profile.sub || profile.keycloakID;

    // Try to find user by keycloakID first, then by email
    let user = keycloakID
      ? await this.userModel.findOne({ keycloakID }).exec()
      : null;

    if (!user) {
      user = await this.userModel.findOne({ email: profile.email }).exec();
    }

    if (!user) {
      // Create new user from OAuth profile
      const newUser = new this.userModel({
        email: profile.email,
        name: profile.name || profile.displayName,
        password: '', // OAuth users might not have passwords
        keycloakID: keycloakID
      });
      user = await newUser.save();
    } else {
      // Update existing user with keycloakID if not set
      if (keycloakID && !user.keycloakID) {
        user.keycloakID = keycloakID;
        await user.save();
      }
    }

    return {
      id: user._id?.toString(),
      _id: user._id?.toString(),
      email: user.email,
      name: user.name
    };
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<UserResponseDto> {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with Argon2
    console.log(`Hashing password for user: ${normalizedEmail}`);
    const hashedPassword = await this.hashPassword(password);
    console.log(`Password hashed successfully for user: ${normalizedEmail}`);

    // Create new user using Mongoose model (automatically hydrated)
    const newUser = new this.userModel({
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim()
    });

    try {
      console.log(`Saving user to database: ${email}`);
      const savedUser = await newUser.save();
      console.log(
        `User saved successfully with ID: ${savedUser._id}, email: ${savedUser.email}`
      );

      // Verify the user was saved correctly by querying it back
      const verifyUser = await this.userModel
        .findOne({ email: normalizedEmail })
        .select('+password')
        .exec();

      if (!verifyUser) {
        console.error(
          `User verification failed - user not found after save: ${email}`
        );
        throw new InternalServerErrorException(
          'Failed to register user. Please try again.'
        );
      }

      console.log(
        `User verified in database: ${verifyUser.email}, has password: ${!!verifyUser.password}`
      );

      // Verify password hash is correct by testing it
      try {
        const passwordTest = await argon2.verify(verifyUser.password, password);
        if (passwordTest) {
          console.log(`Password hash verified successfully for user: ${email}`);
        } else {
          console.error(`Password hash verification failed for user: ${email}`);
        }
      } catch (verifyError) {
        console.error(`Error verifying password hash: ${verifyError}`);
      }

      // Return user without password as DTO
      return {
        id: savedUser._id?.toString(),
        email: savedUser.email,
        name: savedUser.name
      };
    } catch (error) {
      console.error('Error saving user:', error);
      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(
        'Failed to register user. Please try again.'
      );
    }
  }

  async findUserById(id: string): Promise<UserResponse | undefined> {
    const user = await this.userModel.findById(id).exec();

    if (user) {
      return {
        id: user._id?.toString(),
        _id: user._id?.toString(),
        email: user.email,
        name: user.name
      };
    }
    return undefined;
  }

  async findUserByEmail(email: string): Promise<UserResponse | undefined> {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();

    if (user) {
      return {
        id: user._id?.toString(),
        _id: user._id?.toString(),
        email: user.email,
        name: user.name
      };
    }
    return undefined;
  }

  async findUserByKeycloakID(
    keycloakID: string
  ): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ keycloakID }).exec();

    if (!user) {
      return null;
    }

    return {
      id: user._id?.toString() || '',
      email: user.email,
      name: user.name
    };
  }
}
