const request = require("supertest");
const app = require("../server");

describe("Daily logs endpoints", () => {
  test("GET /api/dashboard/ping (existing) returns 200", async () => {
    const res = await request(app).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
