import { body, validationResult } from 'express-validator';

export const validateLogin = [
    body('email').trim().notEmpty().withMessage("Email is required"),
    body('password').trim().notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
            return res.status(400).json({
                message: 'Validation failed',
                errors: formattedErrors
            });
        }
        next();
    }
]

export const validateRegister = [
    body('name').notEmpty().withMessage("Username cannot be empty"),
    body('email').notEmpty().isEmail().withMessage("Email should be proper and not empty"),
    body('password').notEmpty().withMessage("Password should not be empty"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
            return res.status(400).json({errors: formattedErrors});
        }
        next();
    }
]