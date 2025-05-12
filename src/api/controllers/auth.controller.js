import { createUser, findUserByEmail, authenticateUser } from "../../services/auth.sevices";

export const registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await findUserByEmail(email, name);
        if (!existingUser) {
            const user = await createUser({name: name, email: email, password: password});
            res.status(200).json({
                message: "User registered",
                user: user
            });
        } else {
            res.status(400).json({
                message: "Duplicate User"
            });
        }
        
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await authenticateUser(email, password);
        if (token) {
            res.status(200).json({token: token});
        } else {
           const error = new Error("Invalid credentials");
           error.statusCode = 400;
           throw error;
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};