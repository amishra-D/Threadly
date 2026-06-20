const axios = require('axios');

const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://content-service:3003';

const addlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const response = await axios.post(`${CONTENT_SERVICE_URL}/internal/posts/${postId}/like`, { userId });
        
        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

const adddislike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const response = await axios.post(`${CONTENT_SERVICE_URL}/internal/posts/${postId}/dislike`, { userId });

        return res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addlike, adddislike };
