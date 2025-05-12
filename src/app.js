import express from 'express';
import authRoutes from './api/routes/auth.routes';
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// error handler
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.statusCode || 500).json({message: err.message || 'Internal server error'});
});

export default app;