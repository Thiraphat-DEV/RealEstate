import { ResponseHelper, ServiceResponse } from './response-helper';

describe('ResponseHelper', () => {
  describe('ResponseHelper function', () => {
    describe('Array data handling', () => {
      it('should return correct response for array data', () => {
        // Arrange
        const data = [1, 2, 3];
        const statusCode = 200;

        // Act
        const result = ResponseHelper(data, statusCode, null);

        // Assert
        expect(result).toEqual({
          data,
          length: 3,
          error: null,
          statusCode: 200
        });
        expect(Array.isArray(result.data)).toBe(true);
      });

      it('should return length 0 for empty array', () => {
        // Arrange
        const data: any[] = [];

        // Act
        const result = ResponseHelper(data, 200, null);

        // Assert
        expect(result).toEqual({
          data: [],
          length: 0,
          error: null,
          statusCode: 200
        });
      });
    });

    describe('Object data handling', () => {
      it('should return correct response for object data', () => {
        // Arrange
        const data = { id: '1', name: 'Test' };

        // Act
        const result = ResponseHelper(data, 200, null);

        // Assert
        expect(result).toEqual({
          data,
          length: 1,
          error: null,
          statusCode: 200
        });
        expect(typeof result.data).toBe('object');
        expect(Array.isArray(result.data)).toBe(false);
      });

      it('should return length 0 for null data', () => {
        // Arrange
        const data = null;
        const error = 'Not found';
        const statusCode = 404;

        // Act
        const result = ResponseHelper(data, statusCode, error);

        // Assert
        expect(result).toEqual({
          data: null,
          length: 0,
          error: 'Not found',
          statusCode: 404
        });
      });
    });

    describe('Metadata handling', () => {
      it('should include metadata when provided', () => {
        // Arrange
        const data = [1, 2, 3];
        const metadata = { total: 10, page: 1, pageLimit: 20 };

        // Act
        const result = ResponseHelper(data, 200, null, metadata);

        // Assert
        expect(result).toEqual({
          data,
          length: 3,
          error: null,
          statusCode: 200,
          metadata
        });
        expect(result.metadata?.total).toBe(10);
        expect(result.metadata?.page).toBe(1);
        expect(result.metadata?.pageLimit).toBe(20);
      });

      it('should not include metadata when not provided', () => {
        // Arrange
        const data = { id: '1' };

        // Act
        const result = ResponseHelper(data, 200, null);

        // Assert
        expect(result).not.toHaveProperty('total');
        expect(result).not.toHaveProperty('page');
      });
    });

    describe('Error handling', () => {
      it('should include error message in response', () => {
        // Arrange
        const error = new Error('Database connection failed');

        // Act
        const result = ResponseHelper(null, 500, error);

        // Assert
        expect(result.error).toBe(error);
        expect(result.statusCode).toBe(500);
      });

      it('should handle string errors', () => {
        // Arrange
        const error = 'Validation failed';

        // Act
        const result = ResponseHelper(null, 400, error);

        // Assert
        expect(result.error).toBe(error);
        expect(result.statusCode).toBe(400);
      });
    });

    describe('Type safety', () => {
      it('should maintain type safety for ServiceResponse', () => {
        // Arrange
        const data: string[] = ['test1', 'test2'];

        // Act
        const result: ServiceResponse<string[]> = ResponseHelper(
          data,
          200,
          null
        );

        // Assert
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data?.[0]).toBe('test1');
      });
    });
  });
});
