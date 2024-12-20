import express, { NextFunction, Request, Response } from 'express';
import { Role } from '../types';
import userService from '../service/user.service';

const profileRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profiles management
 */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get profile of the logged-in user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A user profile object
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
profileRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const profile = await userService.getOwnProfile(username, role);
        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
});

export { profileRouter };
