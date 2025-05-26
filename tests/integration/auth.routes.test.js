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
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "name",
                    message: "Username cannot be empty"
                })
            ])
        );
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

describe("Auth login - suite", () => {
    it("should login and give jwt token in return", async () => {
        const testuser = {
            name: "testu_01",
            email: "test@example.com",
            password: "password"
        }

        const user = await request(app).post("/api/auth/register").send(testuser);
        if (user) {
            const logincred = {
                email: "test@example.com",
                password: "password"
            }
            const res = await request(app).post("/api/auth/login").send(logincred);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        }
    })

    it("should say bad request if login credentials are missing", async () => {
        const payload = {
            email: "test@example.com",
            password: ""
        }
        const res = await request(app).post("/api/auth/login").send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Validation failed");
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "password",
                    message: "Password is required"
                })
            ])
        );
    });
})

describe("Profile suite", () => {
    it("should show profile of existing user", async () => {
        const user = "testu_09";
        const email = "test@example.com"
        const password = "password"
        const userinfo = {
            name: user,
            email: email,
            password: password
        }
        const info = await request(app).post("/api/auth/register").send(userinfo);
        expect(info.status).toBe(200);
        if (info.status == 200) {
            const res = await request(app).post("/api/auth/login").send({email: email, password: password});
            expect(res.status).toBe(200);
            const user = await request(app).get(`/api/auth/profile/${info.body.user.id}`).set("authorization", `Bearer ${res.body.token}`);
            expect(user.body.message).toBe("Profile found");
        }
    });

    it("should show id required for retrieving user", async () => {
        const name = "testu_09";
        const email = "test@example.com"
        const password = "password"
        const userinfo = {
            name: name,
            email: email,
            password: password
        }
        const info = await request(app).post("/api/auth/register").send(userinfo);
        expect(info.status).toBe(200);
        const res = await request(app).post("/api/auth/login").send({email: email, password: password});
        expect(res.status).toBe(200);
        const user = await request(app).get(`/api/auth/profile/%20`).set("authorization", `Bearer ${res.body.token}`);
        expect(user.status).toBe(400);
    })
})