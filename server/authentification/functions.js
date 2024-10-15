import Member from "./memberModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Club from "../gymClub/gymModel.js"; 
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, gymName, maxCoaches, maxMembers,Duration,} = req.body;

        if (role !== "admin" && role !== "coach" && role !== "member") {
            return res.status(400).json({ msg: 'Invalid role provided' });
        }

        if (!firstName || !lastName || !email || !password || !gymName) {
            return res.status(400).json({ msg: 'Please fill all the fields' });
        }

        const existingMember = await Member.findOne({ email: email });
        if (existingMember) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        if (role === "admin") {
            if (!maxCoaches || !maxMembers) {
                return res.status(400).json({ msg: 'Please provide maxCoaches and maxMembers for admin' });
            }
            const existingClub = await Club.findOne({ gymName: gymName });
            if (existingClub) {
                return res.status(400).json({ msg: 'Club name already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Member.create({
                gymName:gymName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                password: hashedPassword,
            });

            const newClub = await Club.create({
                gymName,
                owner: user._id,
                maxCoaches,
                maxMembers
            });

            return res.status(201).json({ msg: 'Admin and Club created successfully', user, newClub });
        } else {
            const existingClub = await Club.findOne({ gymName: gymName });
            if (!existingClub) {
                return res.status(404).json({ msg: 'Gym club not found' });
            }
            if(role == 'coach' && existingClub.coaches.length == existingClub.maxCoaches){
                return res.status(401).json({msg:'There are enough trainers'})
            }
            if(role == 'member' && existingClub.members.length == existingClub.maxMembers){
                return res.status(401).json({msg:'There are enough member'})
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Member.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role,
                password: hashedPassword,
                Duration:Duration,
                gymName:gymName,
            });
            if (role === 'coach') {
                
                await Club.findOneAndUpdate({ gymName: gymName }, { $push: { coachesWaitingList: user._id } });
            } else if (role === 'member') {
                await Club.findOneAndUpdate({ gymName: gymName }, { $push: { membersWaitingList: user._id } });
            }
            return res.status(201).json({ msg: 'User created and added in the waiting list successfully', user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please fill all the fields' });
        }
        const member = await Member.findOne({ email: email });
        if (!member) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const isvalid = await bcrypt.compare(password, member.password);
        if (!isvalid) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }
        const club = await Club.findOne({gymName:member.gymName})
       if(club.coachesWaitingList){
        if (club.coachesWaitingList.includes(req.userId) ) {
            return res.status(401).json({ msg: "You are in the coach waiting list" });
        }    
       }
       if(club.membersWaitingList){
        if (club.membersWaitingList.includes(member._id) ) {
            return res.status(401).json({ msg: "You are in the member waiting list" });
        }   
       }
        const accessToken = jwt.sign({ userId: member._id, userRole: member.role, gymName: member.gymName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: member._id, userRole: member.role, gymName: member.gymName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    res.cookie('refreshtoken', refreshToken, { 
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
        sameSite: "none",
        secure: true,
        path: "/"
    });

    res.cookie('accesstoken', accessToken, { 
        maxAge: 1 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "none",
        secure: true,
        path: "/"
    });

    res.status(200).json({ msg: 'Login successful', accessToken });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});



const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await Member.findOne({ email });

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset Code',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Password Reset Request</h2>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Your password reset code is:</p>
                <h1 style="color: #2e6da4;">${resetCode}</h1>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
        `,
    };
    transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.error('There was an error:', err);
            return res.status(500).json({ msg: 'Error sending email' });
        } else {
            res.status(200).json({ msg: 'Recovery email sent' });
        }
    });
};
const verifyResetCode = async (req, res) => {
    const { email, resetCode } = req.body;

    const user = await Member.findOne({
        email,
        resetPasswordToken: resetCode, 
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset code' });
    }

    res.status(200).json({ msg: 'Code verified successfully' });
};
const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body

    const user = await Member.findOne({
        email,
        resetPasswordToken: resetCode,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset code' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save();
    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Your password has been changed',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Password Changed Successfully</h2>
                <p>Hello,</p>
                <p>This is a confirmation that the password for your account <strong>${user.email}</strong> has just been changed.</p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('There was an error:', err)
        }
    });

    res.status(200).json({ msg: 'Password has been reset successfully' })
};

export {signUp,login,requestPasswordReset,verifyResetCode,resetPassword}
