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
        },
    },
    schemas: {
        Recipe: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                ingredients: {
                    type: 'array',
                    items: {
                        type: 'string',
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

app.get('/status', (req, res) => {
    res.json({ message: 'Plateful API is running...' });
});

app.listen(port || 3000, () => {
    console.log(`Plateful API is running on port ${port}.`);
});
