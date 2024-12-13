// ---- Used in User Story 2 ----

import express, { NextFunction, Request, Response } from 'express';
import recipeService from '../service/recipe.service';

const recipeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Retrieve a list of recipes
 *     description: Retrieve a list of all recipes from the database.
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
        const recipe = await recipeService.getAllRecipes();
        res.status(200).json(recipe);
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
        const recipe = await recipeService.getRecipeById({ id: parseInt(recipeId) });
        if (recipe) {
            res.status(200).json(recipe.toJSON());
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        next(error); // passes the error to the error-handling middleware in app.ts
    }
});

recipeRouter.post('/ingredients', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeIds } = req.body;
    try {
        const ingredients = await recipeService.getIngredientsForRecipes(recipeIds);
        res.status(200).json(ingredients);
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The updated recipe object
 *       404:
 *         description: Recipe not found
 */
recipeRouter.put('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    const recipeInputData = req.body;
    const userId = 1; // TEMPORARY USER ID

    try {
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
 *       404:
 *         description: Recipe not found
 */
recipeRouter.delete('/:recipeId', async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId } = req.params;
    try {
        await recipeService.deleteRecipe(parseInt(recipeId));
        res.status(204).send(); // server processed the request but there's no response body
    } catch (error) {
        next(error);
    }
});

export { recipeRouter };
