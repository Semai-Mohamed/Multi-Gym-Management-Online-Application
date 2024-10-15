const verifyAuthorization = (requiredRole,req, res, next) =>  {
  try {
    const userRole = req.userRole;
    if (!userRole) {
        return res.status(403).json({ msg: 'Invalid user role' });
    }
    if (!requiredRole.includes(userRole)) {
        return res.status(401).json({ msg: 'Unauthorized: Not authorized to perform this operation' });
    }
    next();
  } catch (error) {
    res.status(500).json({msg : 'somthing went wrong'})
  } 
};

export default verifyAuthorization;
