import express from 'express';
import sessionMiddleware from './serverSSR/session.js';
import http from 'http';
import { Server } from 'socket.io';
import { webhookRouter, paymentsRouter } from './serverAPI/routes/paymentsRouters.js';
import './database/init.js'; // Initialize database tables

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {

    socket.on("joinBar", (barId) => {
    socket.join(`bar-${barId}`);
    });
    
    socket.on("disconnect", () => {
    });
});

app.use(webhookRouter);

app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(paymentsRouter);

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set('io', io);

import pagesRouter from './serverAPI/routes/pagesRoutes.js';
app.use(pagesRouter);

import authRouter from './serverAPI/routes/authRoutes.js';
app.use(authRouter);

import mailRouters from './serverAPI/routes/mailRoutes.js'
app.use(mailRouters)

import usersRouter from './serverAPI/routes/usersRoutes.js';
app.use(usersRouter);

import barsRouter from './serverAPI/routes/barsRoutes.js';
app.use(barsRouter);

import typesRouter from './serverAPI/routes/typesRoutes.js';
app.use(typesRouter);

import commentsRouter from './serverAPI/routes/commentsRouter.js';
app.use(commentsRouter);

import googleApiRouter from './serverAPI/routes/googleRouteRoutes.js';
app.use(googleApiRouter);

import routesRouter from './serverAPI/routes/routesRoutes.js';
app.use(routesRouter);

import mustTryRouter from './serverAPI/routes/mustTryRouter.js';
app.use(mustTryRouter);

import orderRouter from './serverAPI/routes/orderRouter.js';
app.use(orderRouter); 


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
