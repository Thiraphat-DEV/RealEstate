import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService]
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should be defined', () => {
      // Assert
      expect(service).toBeDefined();
    });

    it('should return health status with OK status', () => {
      // Act
      const result = service.getHealth();

      // Assert
      expect(result).toEqual({
        status: 'OK',
        message: 'Server is running'
      });
      expect(result.status).toBe('OK');
      expect(typeof result.message).toBe('string');
    });

    it('should always return consistent health status', () => {
      // Act
      const result1 = service.getHealth();
      const result2 = service.getHealth();

      // Assert
      expect(result1).toEqual(result2);
      expect(result1.status).toBe(result2.status);
    });
  });
});
