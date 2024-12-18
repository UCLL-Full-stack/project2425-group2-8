import { UnauthorizedError } from 'express-jwt';
import { Profile } from '../model/profile';
import userDb from '../repository/user.db';
import { ProfileUpdateInput, Role } from '../types';

const getProfileByUserId = async (userId: number): Promise<Profile> => {
    const user = await userDb.getUserById({ id: userId });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    const profile = user.getProfile();
    if (!profile) throw new Error(`Profile for user with id ${userId} does not exist.`);

    return profile;
};

const updateProfile = async (
    userId: number,
    profileUpdate: ProfileUpdateInput,
    role: Role
): Promise<Profile> => {
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'Only users can update their own profile.',
        });
    }

    const user = await userDb.getUserById({ id: userId });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    const profile = user.getProfile();
    if (!profile) throw new Error(`Profile for user with id ${userId} does not exist.`);

    profile.setFirstName(profileUpdate.firstName);
    profile.setLastName(profileUpdate.lastName);
    profile.setEmail(profileUpdate.email);

    return profile;
};

export default { getProfileByUserId, updateProfile };
