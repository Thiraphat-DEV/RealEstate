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
    const keycloakBaseUrl = configService.get<string>('KEYCLOAK_BASE_URL') || 'http://localhost:8080';
    const realm = configService.get<string>('KEYCLOAK_REALM') || 'master';
    const clientID = configService.get<string>('KEYCLOAK_CLIENT_ID') || 'realestate-client';
    const clientSecret = configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
    const callbackURL = configService.get<string>('KEYCLOAK_CALLBACK_URL') || 'http://localhost:5000/api/auth/keycloak/callback';

    // Ensure clientID is not empty (OAuth2Strategy requirement)
    const validClientID = clientID && clientID.trim() !== '' ? clientID : 'realestate-client';

    super({
      authorizationURL: `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
      tokenURL: `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      clientID: validClientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
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
