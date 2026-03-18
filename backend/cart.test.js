const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // adjust if app.js is in another folder
const Cart = require("../models/cartModel");

describe("Cart API", () => {
  beforeAll(async () => {
    const url = "mongodb://127.0.0.1:27017/deetech_test";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a new cart", async () => {
    const res = await request(app).post("/api/cart").send({
      user: new mongoose.Types.ObjectId(),
      items: [{ product: new mongoose.Types.ObjectId(), qty: 2 }],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.items[0].qty).toBe(2);
  });

  it("should fetch a user cart", async () => {
    const userId = new mongoose.Types.ObjectId();

    // create a cart first
    await request(app).post("/api/cart").send({
      user: userId,
      items: [{ product: new mongoose.Types.ObjectId(), qty: 1 }],
    });

    const res = await request(app).get(`/api/cart/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.items.length).toBeGreaterThan(0);
  });
});
