import { createUser, findUserByEmail } from "../../services/auth.sevices";

export const registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        if (name == null) {
            const error = new Error("User name is required!");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            const user = await createUser({name: name, email: email, password: password});
            res.status(200).json({
                message: "User registered",
                user: user
            });
        }
        
    } catch (error) {
        next(error);
    }
};