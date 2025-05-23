import express from 'express';
import sessionMiddleware from './serverSSR/session.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A client connected", socket.id);

    socket.on("joinBar", (barId) => {
    socket.join(`bar-${barId}`);
    console.log(`Client ${socket.id} joined room bar-${barId}`);
    });
    
    socket.on("disconnect", () => {
        console.log("A client disconnected", socket.id);
    });
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

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


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
