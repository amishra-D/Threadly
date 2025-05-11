const mongoose=require('mongoose')
const boardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  img: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('Board', boardSchema);
