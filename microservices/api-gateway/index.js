const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    content: process.env.CONTENT_SERVICE_URL || 'http://localhost:3003',
    interaction: process.env.INTERACTION_SERVICE_URL || 'http://localhost:3004',
    moderation: process.env.MODERATION_SERVICE_URL || 'http://localhost:3005',
};

const allowedOrigins = [
  process.env.FRONT_URL,
  "http://localhost:5173",
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

app.use('/api/v1/auth', createProxyMiddleware({ target: services.auth, changeOrigin: true }));

app.use('/api/v1/profile', createProxyMiddleware({ target: services.user, changeOrigin: true }));

app.use('/api/v1/posts', createProxyMiddleware({ target: services.content, changeOrigin: true }));
app.use('/api/v1/boards', createProxyMiddleware({ target: services.content, changeOrigin: true }));

app.use('/api/v1/comments', createProxyMiddleware({ target: services.interaction, changeOrigin: true }));
app.use('/api/v1/like-dislike', createProxyMiddleware({ target: services.interaction, changeOrigin: true }));

app.use('/api/v1/report', createProxyMiddleware({ target: services.moderation, changeOrigin: true }));

app.get('/', (req, res) => {
    res.send("Threadly API Gateway is running");
});

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
