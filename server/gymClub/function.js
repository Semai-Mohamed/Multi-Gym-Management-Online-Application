import mongoose from "mongoose";
import Club, { moveToActiveList } from "./gymModel.js";
const getClub = async (req,res)=>{
   
    try {
        const userRole = req.userRole
        const gymName = req.gymName
        if (userRole !== 'admin') {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
      const club = await Club.findOne({gymName:gymName}).populate([
        { path: 'coaches' },
        { path: 'members' },
        {path:'coachesWaitingList'},
        {path:'membersWaitingList'}
      ])
    //   .populate({
    //     path: 'interaction.reservation',
    //     model: 'Product'
    //   })
    //   .populate({
    //     path: 'interaction.save', 
    //     model: 'Product' 
    //   });
      if(!club){
       return res.status(404).json({msg:"Club not found"})
      }
      res.status(200).json({msg:{club}})

    } catch (error) {
        res.status(500).json({msg:error})
    }
}
const updateGymClub = async (req, res) => {
    try {
        const userRole = req.userRole
        const clubName = req.gymName
        if (userRole !== 'admin') {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
        const club = await Club.findOneAndUpdate({ gymName: clubName }, req.body, { new: true });
        if (!club) {
            return res.status(404).json({ msg: 'Club not found' })
        }
        res.status(200).json({ msg: 'Club updated successfully', data: club })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    } 
};
const updateWaitingList = async (req, res) => {
    const {  id, type } = req.body;

    if (!id || !type) {
        return res.status(400).send('gymName, memberId, and type are required.');
    }

    try {
        const memberObjectId = new mongoose.Types.ObjectId(id);
        const club = await Club.findOne({gymName:req.gymName});
        if (!club) {
            return res.status(404).send('Club not found');
        }
        await moveToActiveList(req.gymName, memberObjectId, type);
        const newClub = await Club.findOne({gymName:req.gymName});
        res.status(200).json({msg:`Member ${id} moved to active ${type}s list`,newClub});
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
};
export {updateGymClub,getClub,updateWaitingList}

