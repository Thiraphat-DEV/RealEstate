import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    const keycloakBaseUrl = configService.get<string>('KEYCLOAK_BASE_URL');
    const realm = configService.get<string>('KEYCLOAK_REALM');
    const clientID = configService.get<string>('KEYCLOAK_CLIENT_ID');
    const clientSecret = configService.get<string>('KEYCLOAK_CLIENT_SECRET');

    super({
      authorizationURL: `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      tokenURL: `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: configService.get<string>('KEYCLOAK_CALLBACK_URL'),
      scope: ['openid', 'profile', 'email']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    try {
      // Fetch user info from Keycloak
      const keycloakBaseUrl =
        this.configService.get<string>('KEYCLOAK_BASE_URL');
      const realm = this.configService.get<string>('KEYCLOAK_REALM');

      const userInfoResponse = await fetch(
        `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info from Keycloak');
      }

      const userInfo = await userInfoResponse.json();

      const user = {
        email: userInfo.email,
        name: userInfo.name || userInfo.preferred_username,
        picture: userInfo.picture,
        sub: userInfo.sub,
        accessToken,
        refreshToken,
        provider: 'keycloak'
      };

      const validatedUser = await this.authService.validateOAuthUser(user);
      done(null, validatedUser);
    } catch (error) {
      done(error, null);
    }
  }
}
