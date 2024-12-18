// ---- Used in User Story 2 ----

import express, { NextFunction, Request, Response } from 'express';
import scheduleService from '../service/schedule.service';
import { Role } from '../types';
import userService from '../service/user.service';

const scheduleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Schedules management
 */

/**
 * @swagger
 * /schedules/{userId}/{date}:
 *   get:
 *     summary: Get scheduled recipe by userId and date
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for the scheduled recipe
 *     responses:
 *       200:
 *         description: A list of recipe details
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: No scheduled recipes found
 */
scheduleRouter.get('/:userId/:date', async (req: Request, res: Response, next: NextFunction) => {
    const { userId, date } = req.params;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        // Check if the user is accessing their own data or if they're an admin
        if (
            role !== 'admin' &&
            parseInt(userId) !== (await userService.getUserIdFromUsername(username))
        ) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const recipeDetails = await scheduleService.getScheduledRecipeDetails(
            parseInt(userId),
            new Date(date)
        );
        res.status(200).json(recipeDetails.map((details) => details.toJSON()));
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/{userId}/{recipeId}/{date}:
 *   put:
 *     summary: Update the date of a scheduled recipe
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The current date of the scheduled recipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: The updated schedule object
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Schedule not found
 */
scheduleRouter.put(
    '/:userId/:recipeId/:date',
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId, recipeId, date } = req.params;
        const { newDate } = req.body;
        try {
            const request = req as Request & { auth: { username: string; role: Role } };
            const { username, role } = request.auth;

            // Check if the user is updating their own data or if they're an admin
            if (
                role !== 'admin' &&
                parseInt(userId) !== (await userService.getUserIdFromUsername(username))
            ) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }

            const updatedSchedule = await scheduleService.updateRecipeDate(
                parseInt(userId),
                parseInt(recipeId),
                new Date(date),
                new Date(newDate)
            );
            res.status(200).json(updatedSchedule.toJSON());
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /schedules/{userId}/{recipeId}/{date}:
 *   delete:
 *     summary: Delete a scheduled recipe by userId, recipeId, and date
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the scheduled recipe
 *     responses:
 *       204:
 *         description: No content
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Schedule not found
 */
scheduleRouter.delete(
    '/:userId/:recipeId/:date',
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId, recipeId, date } = req.params;
        try {
            const request = req as Request & { auth: { username: string; role: Role } };
            const { username, role } = request.auth;

            // Check if the user is deleting their own data or if they're an admin
            if (
                role !== 'admin' &&
                parseInt(userId) !== (await userService.getUserIdFromUsername(username))
            ) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }

            await scheduleService.deleteScheduledRecipe(
                parseInt(userId),
                parseInt(recipeId),
                new Date(date)
            );
            res.status(204).send(); // server processed the request but there's no response body
        } catch (error) {
            next(error);
        }
    }
);

export { scheduleRouter };
