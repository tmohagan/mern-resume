const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./index');
const User = require('./models/User');

let mongod;

describe('POST /register', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should return 400 if passwords do not match', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password456'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Passwords do not match');
  });
});