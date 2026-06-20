const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const commentroutes = require('./routes/commentroutes');
const likedislikeroutes = require('./routes/likedislikeroutes');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { setupConsumers } = require('./rabbitmq/consumer');
dotenv.config();
const PORT = process.env.PORT || 3004;

const app = express();

dbConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectRabbitMQ().then(() => {
    setupConsumers();
});
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

app.use('/', commentroutes);
app.use('/', likedislikeroutes);
app.use('/api/v1/comments', commentroutes);
app.use('/api/v1/like-dislike', likedislikeroutes);

app.get('/health', (req, res) => {
    res.send("Interaction Service is running");
});

app.listen(PORT, () => {
    console.log("Interaction Service running at port", PORT);
});
