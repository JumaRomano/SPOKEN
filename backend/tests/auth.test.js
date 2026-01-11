const authController = require('../src/controllers/authController');
const authService = require('../src/services/authService');

// Mock the service layer
jest.mock('../src/services/authService');

describe('AuthController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call next with error if service throws', async () => {
            req.body = { email: 'test@example.com', password: 'wrong' };
            const error = new Error('Invalid credentials');
            authService.login.mockRejectedValue(error);

            await authController.login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'wrong');
            expect(next).toHaveBeenCalledWith(error);
        });

        it('should return 200 and result if service succeeds', async () => {
            req.body = { email: 'test@example.com', password: 'correct' };
            const mockResult = { token: 'abc', user: { id: 1 } };
            authService.login.mockResolvedValue(mockResult);

            await authController.login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'correct');
            expect(res.json).toHaveBeenCalledWith(mockResult);
            expect(res.status).not.toHaveBeenCalledWith(400); // Controller uses default status (200) often
        });
    });

    describe('register', () => {
        it('should call next with error if service throws', async () => {
            req.body = { email: 'test@example.com' };
            const error = new Error('Email exists');
            authService.register.mockRejectedValue(error);

            await authController.register(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('should return 201 and user if service succeeds', async () => {
            req.body = { email: 'new@example.com', password: 'pw', role: 'member' };
            const mockUser = { id: 1, email: 'new@example.com', role: 'member' };
            authService.register.mockResolvedValue(mockUser);

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'User registered successfully',
                user: mockUser
            }));
        });
    });
});
