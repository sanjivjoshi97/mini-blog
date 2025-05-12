import db from "../../models";

const User = db.User;

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