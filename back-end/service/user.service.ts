import userDb from '../repository/user.db';
import { User } from '../model/user';
import { UserSignupInput, AuthenticationResponse, UserLoginInput, Role } from '../types';
import { Profile } from '../model/profile';
import bcrypt from 'bcrypt';
import generateJWTtoken from '../util/jwt';
import { UnauthorizedError } from 'express-jwt';

const getAllUsers = async (role: Role): Promise<User[]> => {
    if (role === 'admin') {
        return await userDb.getAllUsers();
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You do not have access to this resource.',
        });
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userDb.getUserById({ id });
    if (!user) throw new Error(`User with id ${id} does not exist.`);
    return user;
};

const getUserByUsername = async (username: string): Promise<User> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) throw new Error(`User with username ${username} does not exist.`);
    return user;
};

const getUserIdFromUsername = async (username: string): Promise<number> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) throw new Error(`User with username ${username} does not exist.`);
    const userId = user.getId();
    if (userId === undefined) throw new Error(`User ID for username ${username} is undefined.`);
    return userId;
};

const createUser = async ({
    firstName,
    lastName,
    username,
    email,
    password,
}: UserSignupInput): Promise<User> => {
    // check if username already registered
    const existingUser = await userDb.getUserByUsername({ username });
    if (existingUser) {
        throw new Error(`User with username: ${username} is already registered.`);
    }

    // check if email already registered
    const existingEmail = await userDb.getUserByEmail({ email });
    if (existingEmail) {
        throw new Error(`User with email: ${email} is already registered.`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = new Profile({ firstName, lastName, email });
    const user = new User({ username, password: hashedPassword, profile, role: 'user' as Role });

    const createdUser = await userDb.addUser(user);
    if (!createdUser.getSchedule()) {
        throw new Error('Failed to create schedule for the user.');
    }

    return createdUser;
};

const authenticate = async ({
    username,
    password,
}: UserLoginInput): Promise<AuthenticationResponse> => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new Error('Invalid username or password.');
    }

    const isValidPass = await bcrypt.compare(password, user.getPassword());
    if (!isValidPass) {
        throw new Error('Invalid username or password.');
    }

    return {
        token: generateJWTtoken({ username, role: user.getRole() }),
        username: username,
        fullname: `${user.getProfile()?.getFirstName() ?? ''} ${
            user.getProfile()?.getLastName() ?? ''
        }`,
        role: user.getRole(),
    };
};

const getOwnProfile = async (username: string, role: Role): Promise<User> => {
    if (role === 'user' || role === 'admin') {
        return await getUserByUsername(username);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    createUser,
    authenticate,
    getUserIdFromUsername,
    getOwnProfile,
};
