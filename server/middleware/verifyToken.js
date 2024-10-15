import jwt from 'jsonwebtoken'
// const verifyAccessToken = (req, res, next) => {
//     const auth = req.headers.authorization;
//     if (!auth) {
//         return res.status(401).json({ msg: 'Unauthorized: Missing token' });
//     }
//     const token2 = req.headers.authorization.split(' ')[1];

//     const token = req.cookies.accesstoken;
//     console.log(process.env.ACCESS_TOKEN_SECRET);
//     console.log(process.env.ACCESS_TOKEN_SECRET === token);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             console.log(err);
//             return res.status(403).json({ msg: { message: 'Forbidden: Invalid token' } });
//         }
//         req.userId = decoded.userId;
//         req.userRole = decoded.userRole;
//         req.gymName = decoded.gymName
//         next();
//     });
// };

const verifyAccessToken = (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: Missing token' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ msg: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        req.gymName = decoded.gymName;
        next();
    });
    
};

const verifyRefreshToken = async (req,res)=>{
    const refreshToken =  req.cookies.refreshtoken
    if(!refreshToken){
       return res.status(401).json({ msg: 'No refresh token provided' })
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
        if (err) {
            return res.status(403).json({ msg: 'Invalid refresh token' });
        }
      const  newAccessToken = jwt.sign({ userId: req.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.status(200).json({ msg: 'Refresh successful', newAccessToken });
    })
}
export {verifyAccessToken,verifyRefreshToken} 