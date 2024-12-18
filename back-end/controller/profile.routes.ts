import express, { NextFunction, Request, Response } from 'express';
import { ProfileUpdateInput, Role } from '../types';
import profileService from '../service/profile.service';
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

// NOT CORRECTLY IMPLEMENTED YET!!!
// /**
//  * @swagger
//  * /profiles/{userId}:
//  *   put:
//  *     summary: Update profile
//  *     tags: [Profiles]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: userId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: The user ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               bio:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: The updated profile object
//  *       400:
//  *         description: Bad request
//  *       404:
//  *         description: Profile not found
//  *       500:
//  *         description: Internal server error
//  */
// profileRouter.put('/:userId', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const request = req as Request & { auth: { username: string; role: Role } };
//         const { role } = request.auth;
//         const userId = Number(req.params.userId);

//         const profileUpdate: ProfileUpdateInput = req.body;
//         const updatedProfile = await profileService.updateProfile(userId, profileUpdate, role);
//         res.status(200).json(updatedProfile);
//     } catch (error) {
//         next(error);
//     }
// });

export { profileRouter };
