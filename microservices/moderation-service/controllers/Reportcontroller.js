const Report = require('../models/Report');
const axios = require('axios');
const { publishToQueue } = require('../rabbitmq/producer');

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
            await publishToQueue('post_reports_count', {
                postId: contentId,
                increment: 1
            });
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
