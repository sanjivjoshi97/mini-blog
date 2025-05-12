import request from "supertest";
import app from "../../src/app";

describe('Auth routes - register', () => {
    it('should register user with data given', async () => {
        const userdata = {
            name: "testu_01",
            email: "test@example.com",
            password: "test123"
        };
        const response = await request(app).post('/api/auth/register').send(userdata);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'User registered');
        expect(response.body.user).toHaveProperty('name', 'testu_01');
    });

    it('should show bad request if username is missing', async () => {
        const userdata = {
            // name: "test",
            email: "test@example.com",
            password: "test123"
        };
        const response = await request(app).post('/api/auth/register').send(userdata);
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message', expect.stringContaining('User name is required!'));
    });

    it("should not allow duplicate user by email", async () => {
        const user = {
            name: "testu_02",
            email: "test@example.com",
            password: "testuser"
        }
        await request(app).post("/api/auth/register").send(user);
        const duplicateuser = {
            name: "testu_03",
            email: "test@example.com",
            password: "testuser"
        }
        const res = await request(app).post("/api/auth/register").send(duplicateuser);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Duplicate User");
    });

    it("should not allow usernames that don't follow a regex", async () => {
        const testuser = {
            name: "yut",
            email: "test@example.com",
            password: "password"
        }
        const res = await request(app).post("/api/auth/register").send(testuser);
        expect(res.body).toHaveProperty('message', expect.stringContaining("Validation"));
    });
})