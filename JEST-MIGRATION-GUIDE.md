# Jest v26 to v28 Migration Guide

This guide provides step-by-step instructions for migrating from Jest v26 to v28 in the LTHT React project.

## Prerequisites

- Node.js 14 or later is required for Jest v28
- Git for creating a dedicated migration branch

## Migration Steps

### 1. Create a Migration Branch

```bash
git checkout -b feat/jest-v28-migration
```

### 2. Update Dependencies

Remove the old dependencies and install the new ones:

```bash
# Uninstall old dependencies
npm uninstall jest ts-jest @types/jest

# Install Jest v28 dependencies
npm install --save-dev jest@^28.0.0 jest-environment-jsdom@^28.0.0 ts-jest@^28.0.0 @types/jest@^28.0.0
```

### 3. Run the Migration Helper

We've provided a migration helper script that checks for common issues and provides specific guidance:

```bash
npm run test:migration-helper
```

### 4. Update Snapshots

Jest v28 uses a new snapshot format, so you'll need to update your snapshots:

```bash
npm run test:update-snapshots
```

### 5. Fixing Common Issues

#### a. Timer Mocks

Update any `useFakeTimers` calls to use the new format:

```javascript
// Old (Jest v26)
jest.useFakeTimers();

// New (Jest v28 with backward compatibility)
jest.useFakeTimers({
  legacyFakeTimers: true
});

// Or use the new API
jest.useFakeTimers();
```

#### b. Mock Functions

Jest v28 changed how mock functions are reset and restored:

```javascript
// In Jest v26, this reset all mocks including spies
jest.resetAllMocks();

// In Jest v28:
// - resetAllMocks() only resets mocks created with jest.fn()
// - To reset spies, you need:
jest.restoreAllMocks();
```

#### c. Test Environment

Jest v28 no longer includes `jsdom` by default. Our configuration has been updated to include it, but if you have custom test environments, they may need to be updated.

### 6. Troubleshooting Common Errors

#### Error: cannot find module 'jest-environment-jsdom'

**Solution**: Install the package separately:
```bash
npm install --save-dev jest-environment-jsdom@^28.0.0
```

#### Error: The configuration option 'testRunner' is not supported

**Solution**: Remove the `testRunner` field from your Jest configuration if present, as it's no longer needed in Jest v28.

#### Error: Module Parse Failure: SyntaxError

**Solution**: This usually happens due to a mismatch in TypeScript configuration. Check that your `ts-jest` configuration matches your `tsconfig.json` settings.

#### Unexpected token import/export

**Solution**: Jest v28 is better at handling ESM, but may still need configuration:

1. Ensure `transform` is correctly set up with `ts-jest` in your Jest config
2. Check that you haven't accidentally disabled `transform` for certain files

### 7. Leveraging New Features

Jest v28 brings several new features that you may want to leverage:

1. **Improved Test Isolation**: Better error reporting for asynchronous errors

2. **Sharding Capability**: To use test sharding for faster test execution:
   ```bash
   # Run tests in shards (e.g., split into 4 shards, run shard 1)
   jest --shard=1/4
   ```

3. **Enhanced ESM Support**: Better support for ES Modules

4. **Improved Snapshot Format**: More readable and maintainable snapshots

### 8. Verifying the Migration

After implementing all changes, verify that everything works correctly:

1. Run all tests:
   ```bash
   npm test
   ```

2. Check test coverage:
   ```bash
   npm test -- --coverage
   ```

3. Verify that the test results match expectations

### 9. Committing the Changes

Once all tests are passing:

```bash
git add .
git commit -m "chore: migrate from Jest v26 to v28"
git push origin feat/jest-v28-migration
```

Then create a pull request for team review.

## Resources

- [Jest v28 Release Notes](https://jestjs.io/blog/2022/04/25/jest-28)
- [Jest Breaking Changes](https://jestjs.io/docs/28.0/upgrading-to-jest28)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)