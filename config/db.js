const mongoose = require("mongoose");
const connectDB = async () => {
  const connection = await mongoose.connect(`${process.env.MONGO_URI}`, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  console.log(
    `mongoDB connected: ${connection.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
