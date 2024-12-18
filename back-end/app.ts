import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { userRouter } from './controller/user.routes';
import { scheduleRouter } from './controller/schedule.routes';
import { recipeRouter } from './controller/recipe.routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import { profileRouter } from './controller/profile.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Plateful API',
            version: '1.0.0',
            description: 'API for managing personal meal schedules and recipes',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Recipe: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        title: {
                            type: 'string',
                            example: 'Spaghetti Bolognese',
                        },
                        instructions: {
                            type: 'string',
                            example: 'Cook pasta, prepare sauce, mix together',
                        },
                        cookingTime: {
                            type: 'integer',
                            example: 30,
                        },
                        category: {
                            type: 'string',
                            example: 'DINNER',
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    ingredientId: {
                                        type: 'integer',
                                        example: 1,
                                    },
                                    unit: {
                                        type: 'string',
                                        example: 'g',
                                    },
                                    quantity: {
                                        type: 'number',
                                        example: 200,
                                    },
                                },
                            },
                        },
                        imageUrl: {
                            type: 'string',
                            example: 'https://example.com/image.jpg',
                        },
                        isFavorite: {
                            type: 'boolean',
                            example: true,
                        },
                        notes: {
                            type: 'string',
                            example: 'Delicious with garlic bread',
                        },
                        source: {
                            type: 'string',
                            example: 'Family recipe',
                        },
                        scheduledDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-12-03T00:00:00.000Z',
                        },
                    },
                },
            },
        },
    },
    apis: ['./controller/*.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // logs the error
    res.status(500).json({ message: 'Something went wrong!' }); // sends an error response
});

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status'],
    })
);

app.use('/schedules', scheduleRouter);
app.use('/users', userRouter);
app.use('/recipes', recipeRouter);
app.use('/profiles', profileRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Plateful API is running...' });
});

// error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // logs the error

    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'ValidationError') {
        res.status(400).json({ status: 'validation error', message: err.message });
    } else if (err.name === 'NotFoundError') {
        res.status(404).json({ status: 'not found', message: err.message });
    } else if (err instanceof TypeError) {
        res.status(400).json({ status: 'type error', message: err.message });
    } else {
        res.status(500).json({ status: 'internal server error', message: 'Something went wrong!' });
    }
});

app.listen(port || 3000, () => {
    console.log(`Plateful API is running on port ${port}.`);
});
