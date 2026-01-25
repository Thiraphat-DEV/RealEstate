# Testing Best Practices

เอกสารนี้สรุป best practices ที่ใช้ในการเขียน tests สำหรับ backend

## หลักการสำคัญ

### 1. Test Structure (AAA Pattern)
ใช้ Arrange-Act-Assert pattern ในทุก test:

```typescript
it('should do something', () => {
  // Arrange - เตรียมข้อมูลและ mock
  const mockData = createMockData();
  service.method = jest.fn().mockResolvedValue(mockData);

  // Act - เรียก function ที่ต้องการ test
  const result = await service.someMethod();

  // Assert - ตรวจสอบผลลัพธ์
  expect(result).toBeDefined();
  expect(service.method).toHaveBeenCalled();
});
```

### 2. Test Data Factories
ใช้ factory functions สำหรับสร้าง mock data:

```typescript
// ✅ Good
const createMockUser = (overrides = {}) => ({
  _id: new Types.ObjectId(),
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

// ❌ Bad
const mockUser = {
  _id: new Types.ObjectId(),
  email: 'test@example.com',
  // Hard to reuse
};
```

### 3. Test Constants
แยก constants ออกมาเพื่อให้ง่ายต่อการ maintain:

```typescript
// ✅ Good
const TEST_USER_ID = '507f1f77bcf86cd799439011';
const TEST_EMAIL = 'test@example.com';

// ❌ Bad
const userId = '507f1f77bcf86cd799439011'; // Hardcoded in tests
```

### 4. Descriptive Test Names
ใช้ชื่อ test ที่อธิบายได้ชัดเจน:

```typescript
// ✅ Good
it('should return user when credentials are valid', () => {});
it('should return null when user not found', () => {});
it('should throw ConflictException when user already exists', () => {});

// ❌ Bad
it('test validateUser', () => {});
it('works', () => {});
```

### 5. Test Organization
จัดกลุ่ม tests ด้วย `describe` blocks:

```typescript
describe('AuthService', () => {
  describe('validateUser', () => {
    it('should return user when valid', () => {});
    it('should return null when invalid', () => {});
  });

  describe('register', () => {
    it('should register successfully', () => {});
    it('should throw on duplicate', () => {});
  });
});
```

### 6. Proper Mocking
ใช้ proper mocking patterns:

```typescript
// ✅ Good - Mock entire model
const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
};

// ✅ Good - Mock constructor
const MockUserModel = jest.fn().mockImplementation(() => ({
  save: jest.fn().mockResolvedValue(true),
}));

// ❌ Bad - Incomplete mocks
const mockUserModel = {
  findOne: jest.fn(), // Missing other methods
};
```

### 7. Cleanup
ทำความสะอาด mocks หลังแต่ละ test:

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### 8. Type Safety
ใช้ TypeScript types อย่างถูกต้อง:

```typescript
// ✅ Good
let service: AuthService;
let userModel: jest.Mocked<any>;

// ❌ Bad
let service: any;
let userModel: any;
```

### 9. Error Testing
ทดสอบ error cases:

```typescript
it('should handle database errors gracefully', async () => {
  // Arrange
  mockModel.method.mockRejectedValue(new Error('DB Error'));

  // Act
  const result = await service.method();

  // Assert
  expect(result.statusCode).toBe(500);
  expect(result.error).toBeDefined();
});
```

### 10. Edge Cases
ทดสอบ edge cases:

```typescript
it('should handle empty results', async () => {});
it('should handle null values', async () => {});
it('should handle invalid input', async () => {});
```

## Test Coverage

### Unit Tests
- ทดสอบทุก function ใน service
- Mock dependencies ทั้งหมด
- ทดสอบทั้ง success และ error cases
- ทดสอบ edge cases

### Integration Tests (E2E)
- ทดสอบ flow ทั้งหมด
- ใช้ test database หรือ proper mocking
- ทดสอบ API endpoints
- ทดสอบ authentication flow

## File Structure

```
src/
  modules/
    auth/
      auth.service.ts
      auth.service.spec.ts  # Unit tests
test/
  app.e2e-spec.ts           # E2E tests
  jest-e2e.json             # E2E config
```

## Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Common Patterns

### Testing Services with Dependencies

```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MyService,
      {
        provide: getModelToken(MyEntity.name),
        useValue: mockModel,
      },
    ],
  }).compile();

  service = module.get<MyService>(MyService);
});
```

### Testing Async Functions

```typescript
it('should return data', async () => {
  const result = await service.method();
  expect(result).toBeDefined();
});
```

### Testing Errors

```typescript
it('should throw error', async () => {
  await expect(service.method()).rejects.toThrow(Error);
});
```

## Best Practices Checklist

- [ ] ใช้ AAA pattern (Arrange-Act-Assert)
- [ ] ใช้ factory functions สำหรับ test data
- [ ] แยก constants ออกมา
- [ ] ใช้ descriptive test names
- [ ] จัดกลุ่ม tests ด้วย describe blocks
- [ ] Mock dependencies อย่างถูกต้อง
- [ ] ทำความสะอาด mocks ใน afterEach
- [ ] ใช้ TypeScript types
- [ ] ทดสอบ error cases
- [ ] ทดสอบ edge cases
- [ ] ทดสอบทั้ง success และ failure paths
- [ ] ใช้ proper assertions
- [ ] ไม่มี hardcoded values ใน tests
- [ ] Tests เป็นอิสระจากกัน (no dependencies)
