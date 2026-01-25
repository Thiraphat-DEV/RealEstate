import { Test, TestingModule } from '@nestjs/testing';
import { BedroomService } from './bedroom.service';

describe('BedroomService', () => {
  let service: BedroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedroomService]
    }).compile();

    service = module.get<BedroomService>(BedroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBedroomOptions', () => {
    it('should return bedroom options', async () => {
      const result = await service.getBedroomOptions();

      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual([1, 2, 3, 4]);
    });

    it('should always return the same options', async () => {
      const result1 = await service.getBedroomOptions();
      const result2 = await service.getBedroomOptions();

      expect(result1.data).toEqual(result2.data);
    });
  });
});
