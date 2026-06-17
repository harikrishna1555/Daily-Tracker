const request = require("supertest");
const app = require("../server");

describe("Dashboard endpoints", () => {
  test("GET /api/admin/dashboard without secret returns 401", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.statusCode).toBe(401);
  });
});
