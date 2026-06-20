const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/database');
const reportroutes = require('./routes/reportroutes');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3005;

const app = express();

dbConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.FRONT_URL || "http://localhost:5173",
  "http://localhost:3000"
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

app.use('/', reportroutes);
app.use('/api/v1/report', reportroutes);

app.get('/health', (req, res) => {
    res.send("Moderation Service is running");
});

app.listen(PORT, () => {
    console.log("Moderation Service running at port", PORT);
});
