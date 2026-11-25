import mongoose from 'mongoose';

// Garante que os testes utilizem um banco separado.
process.env.MONGODB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://127.0.0.1:27017/gestao-de-pets-test';

export const mochaHooks = {
  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  },
};