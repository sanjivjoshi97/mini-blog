import request from "supertest";
import app from "../../src/app";

describe('Auth routes - register', () => {
    it('should register user with data given', async () => {
        const userdata = {
            name: "test",
            email: "test@example.com",
            password: "test123"
        };
        const response = await request(app).post('/api/auth/register').send(userdata);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered');
        expect(response.body).toHaveProperty('name', 'test');
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
})