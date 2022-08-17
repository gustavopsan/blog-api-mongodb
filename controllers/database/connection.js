require("dotenv").config();
const mongoose = require("mongoose");

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.cizdhpm.mongodb.net/blog-api?retryWrites=true&w=majority`;

const connection = mongoose
    .connect(uri, connectionParams)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("Error connecting to the database", err);
    });

module.exports = connection;