const express = require("express");
const cors = require("cors");
const dbConnect = require('./config/database');
const authroutes = require('./routes/authroutes');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://localhost:3000" // Allow API Gateway
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/", authroutes);
app.use("/api/v1/auth", authroutes);

app.get('/health', (req, res) => {
    res.send("Auth Service is running");
});

app.listen(PORT, () => {
    console.log("Auth Service running at port", PORT);
});
