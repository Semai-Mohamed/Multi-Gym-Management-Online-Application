import member from "../authentification/memberModel.js"
import Member from "../authentification/memberModel.js"
import verifyAuthorization from "../middleware/authorization.js"

const Profile = async (req, res) => {
    try {
        const id = req.userId
        const user = await Member.findById(id)
        // .populate([
        //     { path: 'friends' },
        //     { path: 'coachInfo' }
        //   ]).populate({
        //     path: 'interaction.reservation', 
        //     model: 'Product'
        //   })
        //   .populate({
        //     path: 'interaction.save', 
        //     model: 'Product' 
        //   })
                  if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Member.findOne({_id:id,gymName:req.gymName}).populate([
            { path: 'friends' },
            { path: 'coachInfo' }
          ]).populate({
            path: 'interaction.reservation', 
            model: 'Product'
          })
          .populate({
            path: 'interaction.save', 
            model: 'Product' 
          });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}
const getAllStudents = async (req,res)=>{
 try {
    const students = await Member.find({role : 'member',gymName:req.gymName}).populate({
        path: 'interaction.reservation', 
        model: 'Product'
      })
      .populate({
        path: 'interaction.save', 
        model: 'Product' 
      }).populate([
        { path: 'friends' },
        { path: 'coachInfo' }
      ]);
    if(!students){
        return res.status(404).json({msg:'there no students'})
      }
      return res.status(200).json(students)
 } catch (error) {
    res.status(500).json(error)
 }
}
const getAllCoach = async (req,res)=>{
    try {
        const coaches = await Member.find({role:'coach',gymName:req.gymName}).populate({
            path: 'interaction.reservation', 
            model: 'Product'
          })
          .populate({
            path: 'interaction.save', 
            model: 'Product' 
          }).populate([
            { path: 'friends' },
            { path: 'coachInfo' }
          ]); 
        if(!coaches){
            return res.status(404).json({msg:'there no coaches'})
          }
          return res.status(200).json(coaches)
     } catch (error) {
        res.status(500).json(error)
     }
}
// const getCoach = async (req,res)=>{
//     try {
//         const {id} = req.params
//         const coach = await Member.findById(id).populate('friends')
//         if(!coach){
//           return  res.status(404).json({msg:'not found a coach'})
//         }
//         res.status(200).json(coach)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }
const updateProfile = async (req, res) => {
    try {          
        const id = req.userId;
        const updateUser = await Member.findByIdAndUpdate(id, req.body, { new: true })
        if (!updateUser) {
            return res.status(404).json({ msg: 'User not found' })
        }
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
}
const updateOtherProfile = async (req, res) => {
    try {
        const userRole = req.userRole;
        if (userRole !== 'admin') {
            return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
        }
        const { Duration, coachInfo, friends } = req.body
        const user = await member.findOne({gymName:req.gymName,_id:req.params.id})
            const userToUpdate = await member.findOneAndUpdate(
            { _id: req.params.id, gymName: req.gymName }, 
            {  coachInfo: coachInfo, friends: friends,Duration:Duration, },
            { new: true } 
        );
        if (!userToUpdate) {
            return res.status(404).json({ msg: user })
        }
        res.status(200).json({ msg: 'User updated by the admin', userToUpdate })
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
}
const deleteProfile = async (req, res) => {
    try {
        verifyAuthorization(['member', 'coach'])(req, res, async () => {
            const id = req.userId;
            const profile = await Member.findByIdAndDelete(id);
            if (!profile) {
                return res.status(404).json({ msg: 'Profile not found' });
            }
            res.status(200).json({ msg: 'Profile has been deleted' });
        }); 
    } catch (error) {
        res.status(500).json(error);
    }
};
const deleteOtherProfile = async (req,res)=>{
    try {
        const userRole = req.userRole;
    if (!userRole) {
        return res.status(403).json({ msg: 'Invalid user role' })
    }
    if (!'admin'.includes(userRole)) {
        return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' })
    }
            const {id} = req.params
            if(id == req.userId){
                return res.status(403).json({msg:'Cant not delete the admin compte'})
            }
            const Profile = await Member.findOneAndDelete({_id:id,gymName:req.gymName})
            if(!Profile){
                return res.status(404).json({msg:'Profile not found'})
            }
            res.status(200).json({msg:'Profile has been deleted'})
      
    } catch (error) {
        res.status(500).json(error)  
    }
}
const searchUsers = async (req, res) => { 
    try {
        const nameQuery = req.query.name;
        const users = await Member.find({ $or: [{ firstName: { $regex: nameQuery, $options: 'i' } }, { lastName: { $regex: nameQuery, $options: 'i' } }],gymName:req.gymName})
       if(!users){
        res.status(404).json({msg:"Not founded"})
       }
       return  res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' })
    }
};
export { Profile, getUser, updateProfile, deleteProfile,getAllCoach,getAllStudents,searchUsers,deleteOtherProfile,updateOtherProfile};
