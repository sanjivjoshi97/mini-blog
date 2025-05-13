import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
    try {
        const authheader = req.headers['authorization'];
        const token = authheader.split(" ")[1];
        if (!token) {
            const error = new Error("Token cannot be empty");
            error.status = 401;
            throw error;
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                const error = new Error(err.message);
                error.status = 403;
                throw error;
            }
            req.user = payload;
            next();
        })
    } catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
}