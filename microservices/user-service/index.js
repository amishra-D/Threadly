const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const profileroutes = require('./routes/profileroutes');
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { initProfileConsumer } = require('./controllers/Profile');
dotenv.config();
const PORT = process.env.PORT || 3002;

const app = express();

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

dbConnect();
initProfileConsumer();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://localhost:3000" // Allow API Gateway
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Mount the routes
app.use('/', profileroutes);
app.use('/api/v1/profile', profileroutes);

app.get('/health', (req, res) => {
    res.send("User Profile Service is running");
});

app.listen(PORT, () => {
    console.log("User Service running at port", PORT);
});
