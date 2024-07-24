const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorhandler");
const { connectDb } = require("./config/dbConnection");

const dotenv = require("dotenv").config();

connectDb();


const app=express();

const port=process.env.PORT || 5000;
app.use(cors({
    origin: true, // Your React development server URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
app.use(express.json());
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port,()=>{
    console.log("Server Listening on port ",port);
})
