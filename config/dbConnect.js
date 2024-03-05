const monngoose = require('mongoose');

const dbConnect = async () => {
  try {
    await monngoose.connect(process.env.MONGO_URL);
    console.log('DB connected successfully');
  } catch (error) {
    console.log('DB connection failed', error.message);
  }
};

dbConnect();
