const Boards=require('../models/Board.js')

const createboard=async (req,res)=>{
    try{
    const {name,description}=req.body;
    const board=new Boards({name,description});
    await board.save();
        return res.status(200).json({
            success:true,
            message:'Board saved successfully'
        })
    }
    catch(error){
        console.log('Error in creating board')
        return res.status(500).json({
            success: false,
            message: 'Board was not saved',
            error: error.message,
        });
    }
}
const getallboards=async(req,res)=>{
    try{
        const boards=await Boards.find();
        return res.status(200).json({
            success:true,
            message:'Board fetched successfully',
            boards
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Boards were not found',
            error: error.message,
        });
    }
}
const updateboard=async(req,res)=>{
    try{
        const {id}=req.params;
        const {img}=req.body;
        const board = await Boards.findByIdAndUpdate(id, { $set: { img } }, { new: true });
        return res.status(200).json({
            success:true,
            message:'Board updated successfully',
            board
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Board couldnot update',
            error: error.message,
        });
    }

}
module.exports={createboard,getallboards,updateboard}