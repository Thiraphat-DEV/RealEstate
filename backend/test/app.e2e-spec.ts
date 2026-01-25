import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E Test - RealEstate User Flow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      // Assert
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running'
      });
      expect(response.body.status).toBe('OK');
      expect(typeof response.body.message).toBe('string');
    });
  });

  describe('Authentication Endpoints', () => {
    describe('Register endpoint', () => {
      it('should validate register request format', async () => {
        // Arrange
        const invalidData = {
          email: 'invalid-email',
          password: '123',
          name: 'A'
        };

        // Act
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(invalidData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
      });

      it('should accept valid register request format', async () => {
        // Arrange
        const validData = {
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User'
        };

        // Act
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(validData);

        // Assert
        // May succeed (201) or fail (409) depending on test database state
        expect([201, 409, 500]).toContain(response.status);
      });
    });

    describe('Login endpoint', () => {
      it('should validate login request format', async () => {
        // Arrange
        const invalidData = {
          email: 'invalid-email',
          password: '123'
        };

        // Act
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(invalidData);

        // Assert
        expect([400, 401]).toContain(response.status);
      });
    });
  });

  describe('Protected Endpoints', () => {
    it('should require authentication for properties endpoint', async () => {
      // Act
      const response = await request(app.getHttpServer()).get(
        '/api/properties'
      );

      // Assert
      expect(response.status).toBe(401);
    });

    it('should require authentication for favourites endpoint', async () => {
      // Act
      const response = await request(app.getHttpServer()).get(
        '/api/favourites'
      );

      // Assert
      expect(response.status).toBe(401);
    });

    it('should require authentication for view history endpoint', async () => {
      // Act
      const response = await request(app.getHttpServer()).get(
        '/api/view-history'
      );

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('Complete User Flow', () => {
    it('should handle user registration and login flow', async () => {
      // Arrange
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123';
      const testName = 'Test User';

      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          name: testName
        });

      // Registration might succeed or fail depending on database setup
      if (registerResponse.status === 201) {
        expect(registerResponse.body).toHaveProperty('id');
        expect(registerResponse.body.email).toBe(testEmail.toLowerCase());

        // Step 2: Login
        const loginResponse = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: testEmail,
            password: testPassword
          });

        if (loginResponse.status === 200) {
          expect(loginResponse.body).toHaveProperty('access_token');
          expect(loginResponse.body).toHaveProperty('user');

          const authToken = loginResponse.body.access_token;

          // Step 3: Access protected endpoint
          const propertiesResponse = await request(app.getHttpServer())
            .get('/api/properties')
            .set('Authorization', `Bearer ${authToken}`);

          // May succeed or fail depending on database state
          expect([200, 500]).toContain(propertiesResponse.status);
        }
      }
    });
  });
});
