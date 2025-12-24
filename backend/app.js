import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

import authRoutes from './src/routes/auth.routes.js';
import bookRoutes from './src/routes/books.routes.js';
import userRoutes from './src/routes/users.routes.js';

const app = express();

// Middleware
const allowedOrigins = [
	process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Swagger
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);


export default app;