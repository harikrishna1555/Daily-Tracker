const request = require("supertest");
const app = require("../server");

describe("Admin endpoints", () => {
  test("GET /api/admin/users without developer secret should be unauthorized", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
