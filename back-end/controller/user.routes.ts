import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserSignupInput, UserLoginInput, Role } from '../types/index.js';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { role } = request.auth;

        const users = await userService.getAllUsers(role);
        res.status(200).json(users.map((user) => user.toJSON()));
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A user object
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const userId = Number(req.params.id);

        if (role !== 'admin' && userId !== (await userService.getUserIdFromUsername(username))) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const user = await userService.getUserById(userId);
        res.status(200).json(user?.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created user object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserSignupInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login using username/password. Returns an object with JWT token and user name when successful.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginData = <UserLoginInput>req.body;
        const result = await userService.authenticate(loginData);
        res.status(200).json({
            message: 'Authentication successful',
            token: result.token,
            username: result.username,
            fullname: result.fullname,
            role: result.role,
        });
    } catch (error) {
        next(error);
    }
});

export { userRouter };
