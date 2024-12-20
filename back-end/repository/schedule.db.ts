import { Recipe } from '../model/recipe';
import { Schedule } from '../model/schedule';
import database from './database';

const getAllSchedules = async (): Promise<Schedule[]> => {
    try {
        const schedulesPrisma = await database.schedule.findMany({
            include: {
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });
        return schedulesPrisma.map((schedulePrisma) => Schedule.from(schedulePrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const getScheduledRecipesByUserIdAndDate = async (
    userId: number,
    date: Date
): Promise<Schedule | null> => {
    try {
        const schedulePrisma = await database.schedule.findFirst({
            where: {
                userId,
            },
            include: {
                recipes: {
                    where: {
                        scheduledDate: date,
                    },
                    include: {
                        ingredients: true,
                    },
                },
            },
        });
        return schedulePrisma ? Schedule.from(schedulePrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const createSchedule = async (userId: number, date: Date): Promise<Schedule> => {
    try {
        const existingSchedule = await database.schedule.findUnique({
            where: { userId },
        });

        if (existingSchedule) {
            return new Schedule({
                id: existingSchedule.id,
                date: existingSchedule.createdAt,
                recipes: (
                    await database.recipe.findMany({
                        where: { scheduleId: existingSchedule.id },
                        include: { ingredients: true },
                    })
                ).map((recipe) => Recipe.from(recipe)),
            });
        }

        const newSchedulePrisma = await database.schedule.create({
            data: {
                userId,
                createdAt: date,
                recipes: {
                    create: [],
                },
            },
            include: {
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });
        return Schedule.from(newSchedulePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const saveSchedule = async (schedule: Schedule): Promise<Schedule> => {
    try {
        const updatedSchedulePrisma = await database.schedule.update({
            where: {
                id: schedule.getId(),
            },
            data: {
                recipes: {
                    connect: schedule.getRecipes()?.map((recipe) => ({
                        id: recipe.getId(),
                    })),
                },
            },
            include: {
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });
        return Schedule.from(updatedSchedulePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const removeScheduledRecipe = async (scheduleId: number, recipeId: number): Promise<Schedule> => {
    try {
        const updatedSchedulePrisma = await database.schedule.update({
            where: {
                id: scheduleId,
            },
            data: {
                recipes: {
                    disconnect: { id: recipeId },
                },
            },
            include: {
                recipes: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });

        return Schedule.from(updatedSchedulePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

export default {
    getAllSchedules,
    getScheduledRecipesByUserIdAndDate,
    createSchedule,
    saveSchedule,
    removeScheduledRecipe,
};
