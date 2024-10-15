import member from "../authentification/memberModel.js"
import communications from "./communicationModel.js"
const getChat = async (req, res) => {
    try {
       const page = req.query.page
       const pageSize = req.query.pageSize
       const senderId = req.userId
       const recipientId = req.params.id
       
       const chat = await communications.find({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
       })

       if (!chat ) {
           return res.status(404).json({ msg: 'Chat not found' })
       }

       res.status(200).json({chat})
    } catch (error) {
        res.status(500).json(error)
    }
}
const sendMessage = async (req, res) => {
    try {
        const sender = req.userId
        const { recipient, message } = req.body
        if (!message || !recipient) {
            return res.status(400).json({ msg: 'Recipient and message are required' })
        }
        const recipientUser = await member.findById(recipient)
        if(!recipientUser){
            return res.status(404).json({msg:'Recipient not found'})
        }
        if (req.gymName!==recipientUser.gymName) {
            return res.status(401).json({ msg: 'Unauthorized: You can only message the users in the same club' });
        }
        let newMessage = await communications.create({
            recipient: recipient,
            sender: sender,
            message: message,
            timestamp: Date.now()
        });
        if (!newMessage) {
            return res.status(500).json({ msg: 'Failed to create message' })
        }
        res.status(201).json({ msg: 'Message has been created', data: newMessage })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' })
    }
};
const deleteMessage =async (req,res)=>{
  try {
   const messageId = req.params.id
    const message = await communications.findByIdAndDelete(messageId)
    if(!message){
       return res.status(404).json({msg:'message not found'})
    }
    res.status(200).json({msg:'message has been deleted'})
  } catch (error) {
    res.status(500).json(error)
  }

}
export {deleteMessage,sendMessage,getChat}