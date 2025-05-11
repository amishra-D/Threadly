const express = require("express");
const cors = require("cors");
const dbConnect = require('./config/database');


const postroutes = require('./routes/postroutes');
const authroutes = require('./routes/authroutes');
const boardroutes=require('./routes/boardroutes')
const commentroutes=require('./routes/commentroutes')
const reportroutes=require('./routes/reportroutes')
const likedislikeroutes=require('./routes/likedislikeroutes')
const userroutes=require('./routes/userroutes')

const authMiddleware = require('./middlewares/authmiddleware');

const dotenv=require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3000;
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');


const app = express();


app.use(fileUpload({
    useTempFiles : true,
  tempFileDir : '/tmp/'
}))

dbConnect();

app.use(cookieParser()); 

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  process.env.FRONT_URL,
"https://threadly-fro.onrender.com"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
  app.use("/api/v1/auth", authroutes);
  app.use("/api/v1/posts",authMiddleware, postroutes);
  app.use("/api/v1/boards",authMiddleware, boardroutes);
  app.use("/api/v1/comments",authMiddleware, commentroutes);
  app.use("/api/v1/like-dislike",authMiddleware, likedislikeroutes);
  app.use("/api/v1/profile",authMiddleware, userroutes);
  app.use("/api/v1/report",authMiddleware, reportroutes);

app.get('/', (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log("Server running at port", PORT);
});
