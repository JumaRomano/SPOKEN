// Mock the database configuration
jest.mock('../src/config/database', () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn(),
        on: jest.fn(),
        end: jest.fn(),
    },
    transaction: jest.fn((callback) => callback({ query: jest.fn() })),
}));

// Mock logger to suppress output during tests
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});
