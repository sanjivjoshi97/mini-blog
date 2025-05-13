import { beforeEach, jest } from '@jest/globals';

const mockSign = jest.fn();
jest.unstable_mockModule('jsonwebtoken', () => {
    return {
        default: {
            sign: mockSign,
        }
    };  
});

let mockUserFindOne, mockUserCreate;
let authService;
let jwt;

jest.unstable_mockModule("../../models", () => {
    mockUserFindOne = jest.fn();
    mockUserCreate = jest.fn();

    return {
        default: {
            User: {
                findOne: mockUserFindOne,
                create: mockUserCreate
            },
            Sequelize: {
                Op: {
                    or: Symbol.for('or')
                }
            }
        }
    };
});

describe("Authentication Service", () => {
    beforeEach(async () => {
        jwt = await import('jsonwebtoken');
        authService = await import('../../src/services/auth.sevices');
        jest.clearAllMocks();
    });

    it("should successfully authenticate a user", async () => {
        const mockEmail = "test@example.com";
        const mockPassword = "password123";
        const mockName = "Test User";
        
        const mockUser = {
            id: 1,
            email: mockEmail,
            name: mockName,
            isValidPassword: jest.fn().mockReturnValue(true)
        };

        const mockToken = 'mock.jwt.token';
        mockUserFindOne.mockResolvedValue(mockUser);
        mockSign.mockReturnValue(mockToken);

        const token = await authService.authenticateUser(mockEmail, mockPassword);

        expect(mockUserFindOne).toHaveBeenCalledWith({ where: { email: mockEmail } });
        expect(mockUser.isValidPassword).toHaveBeenCalledWith(mockPassword);
        expect(mockSign).toHaveBeenCalledWith(
            { email: mockEmail, name: mockName, id: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        expect(token).toBe(mockToken);
    });

    test("should return undefined when user is not found", async () => {
        mockUserFindOne.mockResolvedValue(null);
        const result = await authService.authenticateUser("nonexistent@example.com", "password");
        
        expect(result).toBeUndefined();
        expect(mockSign).not.toHaveBeenCalled();
    });

    test("should return undefined when password is invalid", async () => {
        const mockUser = {
            id: 1,
            email: "test@example.com",
            name: "Test User",
            isValidPassword: jest.fn().mockReturnValue(false)
        };
        
        mockUserFindOne.mockResolvedValue(mockUser);
    
        const result = await authService.authenticateUser("test@example.com", "wrong-password");


        expect(mockUser.isValidPassword).toHaveBeenCalledWith("wrong-password");
        expect(result).toBeUndefined();
        expect(mockSign).not.toHaveBeenCalled();
    });
});

describe("To register a non existing user", () => {
    beforeEach(async ()=> {
        jest.clearAllMocks();
        mockUserFindOne.mockResolvedValue(null);
    })
    it("should be able to register a user with all params given", async () => {
        let mockName = "testUser";
        let mockEmail = "test1@example.com"
        let mockPassword = "password"
        mockUserCreate.mockImplementation((userdata) => {
            return Promise.resolve({
                id: 1,
                ...userdata,
                get: jest.fn().mockReturnValue({
                    id:1, ...userdata, password: 'hashed-password'
                })
            });
        })
        const user = await authService.findUserByEmail(mockEmail, mockName);
        expect(user).toBe(null);
        const newUser = await authService.createUser({email: mockEmail, name: mockName, password: mockPassword});
        expect(mockUserFindOne).toHaveBeenCalledWith({where: {[Symbol.for('or')]: [{email: mockEmail}, {name: mockName}]}});
        expect(mockUserCreate).toHaveBeenCalledWith({name: mockName, email: mockEmail, password: mockPassword})
        expect(newUser).toHaveProperty("id", 1);
    })
})

describe("get existing user profile", () => {
    beforeEach(async() => {
        jest.clearAllMocks();
    });
    it("gets an existing user profile", async () => {
        const id = 1;
        const username = "testuser";
        const email = "test@example.com";
        const password = "password";
        const user = {
            name: username,
            id: 1,
            email: email,
            password: password
        }
        const usertest = {
            name: username,
            id: 1,
            email: email
        }
        mockUserFindOne.mockReturnValue(user);
        const output = await authService.getUserProfile(id);
        expect(mockUserFindOne).toHaveBeenCalledWith({where: {id: id}});
        expect(output).toEqual(usertest);
    });
})