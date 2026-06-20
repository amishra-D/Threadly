const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const postroutes = require('./routes/postroutes');
const boardroutes = require('./routes/boardroutes');
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { setupConsumers } = require('./rabbitmq/consumer');
dotenv.config();
const PORT = process.env.PORT || 3003;

const app = express();

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

dbConnect();

connectRabbitMQ().then(() => {
    setupConsumers();
});
app.use(cookieParser());
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

app.use('/', postroutes);
app.use('/', boardroutes);
app.use('/api/v1/posts', postroutes);
app.use('/api/v1/boards', boardroutes);

app.get('/health', (req, res) => {
    res.send("Content Service is running");
});

app.listen(PORT, () => {
    console.log("Content Service running at port", PORT);
});
