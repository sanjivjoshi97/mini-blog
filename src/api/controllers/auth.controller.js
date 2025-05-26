import { createUser, findUserByEmail, authenticateUser, getUserProfile } from "../../services/auth.sevices.js";

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
           error.status = 400;
           throw error;
        }
    } catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        next(error);
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            const err = new Error("ID is required");
            err.status = 400;
            throw err;
        }
        const resp = await getUserProfile(id);
        if (!resp) {
            res.status(404).json({message: `ID ${id} not found in DB`});
        }
        res.status(200).json({message: "Profile found", user: resp});
    } catch(error) {
        next(error);
    }
}

export const homepage = async (req, res, next) => {
    res.render('index', {
        interviewer: 'interviewer'
    })
    next();
}