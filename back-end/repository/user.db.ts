import { PrismaClient, RecipeCategory } from '@prisma/client';
import { User } from '../model/user';
import { Schedule } from '../model/schedule';
import { Role } from '../types';

const database = new PrismaClient();

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: {
                profile: true,
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
                schedule: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        });
        return usersPrisma.map((userPrisma) =>
            User.from({ ...userPrisma, role: userPrisma.role as Role })
        );
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: {
                profile: true,
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
                schedule: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        });

        return userPrisma ? User.from({ ...userPrisma, role: userPrisma.role as Role }) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
            include: {
                profile: true,
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
                schedule: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        });

        return userPrisma ? User.from({ ...userPrisma, role: userPrisma.role as Role }) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { profile: { email } },
            include: {
                profile: true,
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
                schedule: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        });

        return userPrisma ? User.from({ ...userPrisma, role: userPrisma.role as Role }) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const addUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
                role: user.getRole(),
                profile: {
                    create: {
                        firstName: user.getProfile()?.getFirstName() ?? '',
                        lastName: user.getProfile()?.getLastName() ?? '',
                        email: user.getProfile()?.getEmail() ?? '',
                    },
                },
                schedule: {
                    create: {
                        createdAt: new Date(),
                    },
                },
            },
            include: {
                profile: true,
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
                schedule: {
                    include: {
                        recipes: {
                            include: {
                                ingredients: true,
                            },
                        },
                    },
                },
            },
        });

        const createdUser = User.from({ ...userPrisma, role: userPrisma.role as Role });

        // create schedule instance and set it for user
        if (userPrisma.schedule) {
            const newSchedule = Schedule.from(userPrisma.schedule);
            createdUser.setSchedule(newSchedule);
        }

        return createdUser;
    } catch (error) {
        console.error('Error adding user:', error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserById,
    getUserByUsername,
    addUser,
    getUserByEmail,
};
