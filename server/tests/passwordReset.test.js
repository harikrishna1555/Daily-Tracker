const request = require("supertest");
const app = require("../server");

describe("Auth password reset", () => {
  test("POST /api/auth/forgot-password responds with success message", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "noone@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
