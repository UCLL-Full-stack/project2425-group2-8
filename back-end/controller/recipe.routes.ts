// ---- Used in User Story 2 ----

import express, { NextFunction, Request, Response } from 'express';
import recipeService from '../service/recipe.service';
import { Role } from '../types';
import userService from '../service/user.service';

const recipeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipes management
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Retrieve a list of recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Internal server error
 */
recipeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const recipes = await recipeService.getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /recipes/{recipeId}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: A recipe object
 *       404:
 *         description: Recipe not found
 */
recipeRouter.get('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const recipe = await recipeService.getRecipeById(parseInt(recipeId));
        res.status(200).json(recipe.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /recipes/{recipeId}:
 *   put:
 *     summary: Update a recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeUpdateInput'
 *     responses:
 *       200:
 *         description: The updated recipe object
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Recipe not found
 */
recipeRouter.put('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    const recipeInputData = req.body;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        const updatedRecipe = await recipeService.updateRecipe(
            parseInt(recipeId),
            recipeInputData,
            userId
        );
        res.status(200).json(updatedRecipe.toJSON());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /recipes/{recipeId}:
 *   delete:
 *     summary: Delete a recipe by ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     responses:
 *       204:
 *         description: No content
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Recipe not found
 */
recipeRouter.delete('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const userId = await userService.getUserIdFromUsername(username);

        await recipeService.deleteRecipe(parseInt(recipeId));
        res.status(204).send(); // server processed the request but there's no response body
    } catch (error) {
        next(error);
    }
});

export { recipeRouter };
