import db from '../models';

beforeAll(async () => {
    if(process.env.NODE_ENV !== 'test') {
        throw new Error("not test, exiting");
    }
    await db.sequelize.sync({force: true});
});

beforeEach(async () => {
    await db.User.destroy({truncate: true, cascade: true});
})

afterAll(async () => {
    await db.sequelize.close();
})