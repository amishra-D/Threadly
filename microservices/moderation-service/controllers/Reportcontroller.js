const Report = require('../models/Report');
const axios = require('axios');
const amqp = require('amqplib');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://localhost:3003';

let channel;
const connectRabbitMQ = async () => {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    await channel.assertExchange('post_deleted_event', 'fanout', { durable: true });
    const q1 = await channel.assertQueue('moderation_post_cleanup', { durable: true });
    await channel.bindQueue(q1.queue, 'post_deleted_event', '');
    channel.consume(q1.queue, async (msg) => {
        if(msg !== null) {
            const postId = JSON.parse(msg.content.toString()).postId;
            try {
                await Report.deleteMany({ contentId: postId });
                console.log(`[RabbitMQ] Deleted reports for post ${postId}`);
            } catch(err) {
                console.error("Error in deleting post reports", err);
            }
            channel.ack(msg);
        }
    });

    await channel.assertExchange('user_delete_event', 'fanout', { durable: true });
    const q2 = await channel.assertQueue('moderation_user_cleanup', { durable: true });
    await channel.bindQueue(q2.queue, 'user_delete_event', '');
    channel.consume(q2.queue, async (msg) => {
        if(msg !== null) {
            const authId = JSON.parse(msg.content.toString()).authId;
            try {
                await Report.deleteMany({ reportedBy: authId });
                console.log(`[RabbitMQ] Deleted reports for user ${authId}`);
            } catch(err) {
                console.error("Error in deleting user reports", err);
            }
            channel.ack(msg);
        }
    });

    await channel.assertQueue('post_reports_count', { durable: true });

    console.log("RabbitMQ Connected in Moderation Service");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ in Moderation Service, retrying...", err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};
connectRabbitMQ();

const addreport = async (req, res) => {
  try {
    const { type, reason } = req.body;
    const userId = req.user.id;
    const {contentId}=req.params;

    if (!type || !reason) {
      return res.status(400).json({ message: "Type and reason are required." });
    }

    const report = new Report({ type,contentId, reason, reportedBy:userId });
    await report.save();

    try {
        if(type === 'Post') {
            channel.sendToQueue('post_reports_count', Buffer.from(JSON.stringify({
                postId: contentId,
                increment: 1
            })));
        }
    } catch(err) {
        console.error("Failed to enqueue reports count update", err.message);
    }

    return res.status(201).json({
      message: "Report submitted successfully.",
      report,
    });
  } catch (err) {
    console.error("Report submission error:", err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const getallreports = async(req,res)=>{
  try{
    const reports = await Report.find().lean();
    
    const userIds = [...new Set(reports.map(r => r.reportedBy))];
    const userMap = {};
    await Promise.all(userIds.map(async (id) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/internal/profile/${id}`);
            if (response.data && response.data.profile) {
                userMap[id] = response.data.profile;
            }
        } catch(err) {
            console.error(`Could not fetch profile for user ${id}`);
        }
    }));

    const populatedReports = reports.map(r => ({
        ...r,
        reportedBy: userMap[r.reportedBy] ? { _id: r.reportedBy, username: userMap[r.reportedBy].username } : r.reportedBy
    }));

    return res.status(200).json({reports: populatedReports});
  } catch(err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ message: "Internal Server Error." });
  }
}

const deletereport=async(req,res)=>{
  try{
    const reportId=req.params.id;
    const report=await Report.findByIdAndDelete(reportId);
    if(!report){
      return res.status(404).json({ message: "Report not found." });
    }
    return res.status(200).json({ message: "Report deleted successfully." });
  } catch(err){
    console.error("Error deleting report:", err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
}


module.exports = {addreport, getallreports, deletereport};
