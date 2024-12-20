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
 * /schedules:
 *   get:
 *     summary: Get scheduled recipes for the logged-in user
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
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
scheduleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        const recipeDetails = await scheduleService.getScheduledRecipeDetails(
            userId,
            new Date(date as string)
        );
        res.status(200).json(recipeDetails.map((details) => details.toJSON()));
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/copy/{date}:
 *   get:
 *     summary: Copy meals for a specific date
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the meals to copy
 *     responses:
 *       200:
 *         description: The copied meals
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: No meals found for the specified date
 */
scheduleRouter.get('/copy/:date', async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.params;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        const copiedMeals = await scheduleService.copyMeals(userId, new Date(date));
        res.status(200).json(copiedMeals);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Schedule a new recipe
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: The scheduled recipe object
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
scheduleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId, date } = req.body;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        const scheduledRecipe = await scheduleService.scheduleRecipe(
            userId,
            recipeId,
            new Date(date)
        );
        res.status(201).json(scheduledRecipe.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/{recipeId}:
 *   put:
 *     summary: Update the date of a scheduled recipe for the logged-in user
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *       - in: query
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
scheduleRouter.put('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    const { date } = req.query;
    const { newDate } = req.body;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        const updatedRecipe = await scheduleService.updateRecipeDate(
            userId,
            parseInt(recipeId),
            new Date(date as string),
            new Date(newDate),
            role
        );
        res.status(200).json(updatedRecipe.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/{recipeId}:
 *   delete:
 *     summary: Delete a scheduled recipe for the logged-in user
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *       - in: query
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
scheduleRouter.delete('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    const { date } = req.query;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        await scheduleService.deleteScheduledRecipe(
            userId,
            parseInt(recipeId),
            new Date(date as string),
            role
        );
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export { scheduleRouter };
