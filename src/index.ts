import express from 'express';
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
import { types } from 'joi';
import routes from './routes/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server started on port " + PORT));