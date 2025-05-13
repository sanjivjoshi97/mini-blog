import db from "../../models";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const User = db.User;
const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (userData) => {
    try {
        const newUser = await User.create(userData);
        const {password, ...rest} = newUser.get({plain: true});
        return rest;
    } catch(error) {
        throw error;
    }
}

export const findUserByEmail = async (email, name) => {
    try {
        const user = await User.findOne({
            where: {
                [db.Sequelize.Op.or]: [{email}, {name}]
            }});
        return user;
    } catch (error) {
        throw error;
    }
}

export const authenticateUser = async (email, password) => {
    const user = await User.findOne({where: { email }});
    if (user) {
        if (user.isValidPassword(password)) {
            const { email, name, id } = user;
            const payload = {
                email: email,
                name: name,
                id: id
            }
            return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
        } 
    }
}

export const getUserById = async (id) => {
    const user = await User.findOne({where: {id: id}});
    return user;
};

export const getUserProfile = async (id) => {
    const user = await getUserById(id);
    if (user) {
        const {id, name, email} = user;
        return {id, name, email};
    }
}