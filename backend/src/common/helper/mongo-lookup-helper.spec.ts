import { MongoLookupHelper } from './mongo-lookup-helper';
import { PipelineStage } from 'mongoose';

describe('MongoLookupHelper', () => {
  describe('getMasterLookupStage', () => {
    const testCases = [
      {
        description: 'should return correct lookup stage for properties type',
        tableName: 'ms_properties_type',
        localField: 'propertyType',
        expected: {
          from: 'ms_properties_type',
          localField: 'propertyType',
          foreignField: '_id',
          as: 'propertyType'
        }
      },
      {
        description: 'should return correct lookup stage for address',
        tableName: 'ms_address',
        localField: 'address',
        expected: {
          from: 'ms_address',
          localField: 'address',
          foreignField: '_id',
          as: 'address'
        }
      },
      {
        description: 'should return correct lookup stage for status',
        tableName: 'ms_properties_status',
        localField: 'status',
        expected: {
          from: 'ms_properties_status',
          localField: 'status',
          foreignField: '_id',
          as: 'status'
        }
      }
    ];

    testCases.forEach(({ description, tableName, localField, expected }) => {
      it(description, () => {
        // Act
        const result = MongoLookupHelper.getMasterLookupStage(
          tableName,
          localField
        );

        // Assert
        expect(result).toEqual(expected);
        expect(result).toHaveProperty('from');
        expect(result).toHaveProperty('localField');
        expect(result).toHaveProperty('foreignField');
        expect(result).toHaveProperty('as');
      });
    });

    it('should return lookup stage with correct structure type', () => {
      // Arrange
      const tableName = 'ms_city';
      const localField = 'city';

      // Act
      const result = MongoLookupHelper.getMasterLookupStage(
        tableName,
        localField
      );

      // Assert
      expect(result).toMatchObject({
        from: tableName,
        localField: localField,
        foreignField: '_id',
        as: localField
      });
      expect(typeof result.from).toBe('string');
      expect(typeof result.localField).toBe('string');
      expect(typeof result.foreignField).toBe('string');
      expect(typeof result.as).toBe('string');
    });
  });
});
