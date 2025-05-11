const Report = require('../models/Report');

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
    return res.status(201).json({
      message: "Report submitted successfully.",
      report,
    });
  } catch (err) {
    console.error("Report submission error:", err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
const getallreports=async(req,res)=>{
  try{
    const reports=await Report.find().populate('reportedBy').populate('contentId');
    return res.status(200).json({reports});
    }catch(err){
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
      }catch(err){
        console.error("Error deleting report:", err);
        return res.status(500).json({ message: "Internal Server Error." });
        }
}
module.exports={addreport,getallreports,deletereport};
