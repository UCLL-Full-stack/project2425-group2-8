import userService from '../../service/user.service';
import userDb from '../../repository/user.db';
import { User } from '../../model/user';
import { Profile } from '../../model/profile';
import bcrypt from 'bcrypt';
import generateJWTtoken from '../../util/jwt';
import { UnauthorizedError } from 'express-jwt';
import { UserSignupInput, UserLoginInput, Role } from '../../types';

jest.mock('../../repository/user.db');
jest.mock('bcrypt');
jest.mock('../../util/jwt');

const mockUser = new User({
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    profile: new Profile({ firstName: 'Test', lastName: 'User', email: 'test@example.com' }),
    role: 'user' as Role,
});

beforeEach(() => {
    jest.clearAllMocks();
});

test('given: admin role, when: getAllUsers is called, then: it returns all users', async () => {
    (userDb.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

    const users = await userService.getAllUsers('admin' as Role);

    expect(users).toEqual([mockUser]);
    expect(userDb.getAllUsers).toHaveBeenCalled();
});

test('given: non-admin role, when: getAllUsers is called, then: it throws UnauthorizedError', async () => {
    await expect(userService.getAllUsers('user' as Role)).rejects.toThrow(UnauthorizedError);
});

test('given: valid user id, when: getUserById is called, then: it returns the user', async () => {
    (userDb.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const user = await userService.getUserById(1);

    expect(user).toEqual(mockUser);
    expect(userDb.getUserById).toHaveBeenCalledWith({ id: 1 });
});

test('given: invalid user id, when: getUserById is called, then: it throws an error', async () => {
    (userDb.getUserById as jest.Mock).mockResolvedValue(null);

    await expect(userService.getUserById(1)).rejects.toThrow('User with id 1 does not exist.');
});

test('given: valid username, when: getUserByUsername is called, then: it returns the user', async () => {
    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

    const user = await userService.getUserByUsername('testuser');

    expect(user).toEqual(mockUser);
    expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: 'testuser' });
});

test('given: invalid username, when: getUserByUsername is called, then: it throws an error', async () => {
    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

    await expect(userService.getUserByUsername('testuser')).rejects.toThrow('User with username testuser does not exist.');
});

test('given: valid user details, when: createUser is called, then: it creates a new user', async () => {
    const userSignupInput: UserSignupInput = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);
    (userDb.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    (userDb.addUser as jest.Mock).mockResolvedValue(mockUser);

    const createdUser = await userService.createUser(userSignupInput);

    expect(createdUser).toEqual(mockUser);
    expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: 'testuser' });
    expect(userDb.getUserByEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
    expect(userDb.addUser).toHaveBeenCalled();
});

test('given: existing username, when: createUser is called, then: it throws an error', async () => {
    const userSignupInput: UserSignupInput = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

    await expect(userService.createUser(userSignupInput)).rejects.toThrow('User with username: testuser is already registered.');
});

test('given: existing email, when: createUser is called, then: it throws an error', async () => {
    const userSignupInput: UserSignupInput = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);
    (userDb.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await expect(userService.createUser(userSignupInput)).rejects.toThrow('User with email: test@example.com is already registered.');
});

test('given: valid login details, when: authenticate is called, then: it returns an authentication response', async () => {
    const userLoginInput: UserLoginInput = {
        username: 'testuser',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (generateJWTtoken as jest.Mock).mockReturnValue('token');

    const response = await userService.authenticate(userLoginInput);

    expect(response).toEqual({
        token: 'token',
        username: 'testuser',
        fullname: 'Test User',
        role: 'user',
    });
    expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: 'testuser' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    expect(generateJWTtoken).toHaveBeenCalledWith({ username: 'testuser', role: 'user' });
});

test('given: invalid username, when: authenticate is called, then: it throws an error', async () => {
    const userLoginInput: UserLoginInput = {
        username: 'testuser',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(null);

    await expect(userService.authenticate(userLoginInput)).rejects.toThrow('Invalid username or password.');
});

test('given: invalid password, when: authenticate is called, then: it throws an error', async () => {
    const userLoginInput: UserLoginInput = {
        username: 'testuser',
        password: 'password',
    };

    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userService.authenticate(userLoginInput)).rejects.toThrow('Invalid username or password.');
});

test('given: valid username and role, when: getOwnProfile is called, then: it returns the user profile', async () => {
    (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

    const user = await userService.getOwnProfile('testuser', 'user' as Role);

    expect(user).toEqual(mockUser);
    expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: 'testuser' });
});

test('given: invalid role, when: getOwnProfile is called, then: it throws UnauthorizedError', async () => {
    await expect(userService.getOwnProfile('testuser', 'guest' as Role)).rejects.toThrow(UnauthorizedError);
});