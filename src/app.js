import express from 'express';
import authRoutes from './api/routes/auth.routes.js';
// import cookieParser from 'cookie-parser';
// import csurf from 'csurf';
// import helmet from 'helmet';

const app = express();
// app.use(cookieParser());
// app.use(csurf({cookie: true}))
// app.use(helmet());

app.use(express.json({limit: '10kb'}));

app.use("/api/auth", authRoutes);

// error handler
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.statusCode || 500).json({message: err.message || 'Internal server error'});
});

export default app;