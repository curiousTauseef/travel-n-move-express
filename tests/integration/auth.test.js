const app = require("./../../app");
const UserModel = require("./../../database/models/user_model");
const mongoose = require("./../../database/connect");
const supertest = require("supertest");

//login tests
describe("login tests", () => {
  const userDetails = {
    email: "nat6@test.com",
    telephone: "1234",
    first_name: "test",
    last_name: "test"
  };

  beforeAll(async () => {
    await UserModel.deleteOne({ email: userDetails.email });
    const user = new UserModel(userDetails);
    await user.setPassword("test");
    await user.save();
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: userDetails.email });
    mongoose.disconnect();
  });

  test("POST /auth/login with no email and password should return error", async () => {
    const response = await supertest(app)
      .post("/auth/login")
      .send({
        email: "",
        password: ""
      })
      .expect(400);
    expect(response.body.message).toBe("Validation Error");
  });

  test("POST /auth/login with invalid credentials should return error", async () => {
    const response = await supertest(app)
      .post("/auth/login")
      .send({
        email: "error@error.com",
        password: "error"
      })
      .expect(401);
    expect(response.text).toEqual("Password or username is incorrect");
  });

  test("POST /auth/login with valid email and password should return token", async () => {
    const response = await supertest(app)
      .post("/auth/login")
      .send({
        email: userDetails.email,
        password: "test"
      });
    expect(200);
    expect(response.body.token).toBeTruthy();
  });
});
