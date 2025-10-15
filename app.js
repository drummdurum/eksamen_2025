import express from 'express';
import sessionMiddleware from './serverSSR/session.js';
import http from 'http';
import { Server } from 'socket.io';
import { webhookRouter, paymentsRouter } from './serverAPI/routes/paymentsRouters.js';
import './database/init.js'; // Initialize database tables

const app = express();

// Configure trust proxy for Railway and other reverse proxies
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust first proxy (Railway)
}

// CORS configuration for Railway
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Session middleware should be early in the pipeline
app.use(sessionMiddleware);

// Debug session middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Session check:', {
      sessionID: req.sessionID,
      hasSession: !!req.session,
      hasUser: !!req.session?.user,
      cookies: req.headers.cookie ? 'present' : 'missing'
    });
  }
  next();
});

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Webhook router (requires raw body, so comes after session but before other routes)
app.use(webhookRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});

io.on("connection", (socket) => {
    socket.on("joinBar", (barId) => {
    socket.join(`bar-${barId}`);
    });
    
    socket.on("disconnect", () => {
    });
});

app.use(paymentsRouter);
app.use(express.static('public'));

// Remove duplicate express.urlencoded - already configured above
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
