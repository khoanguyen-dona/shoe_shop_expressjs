const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const bearerToken = req.headers.token
    if (bearerToken) { 
    
        const TOKEN = bearerToken.split(";")[0].split(" ")[1]
        const userId = bearerToken.split(";")[1].split(" ")[1]
       
        jwt.verify(TOKEN, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({message: 'Token is not valid'});
            req.user = user;
            req.id = userId           
            next();
          });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization =(req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.id || req.user.isAdmin === true){
            next();
        } else {
            return res.status(403).json({message: 'You are not allowed to do that '})
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
           return res.status(403).json({message: 'You are not allowed to this'})
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}