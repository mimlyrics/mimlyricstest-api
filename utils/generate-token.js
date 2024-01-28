const jwt = require("jsonwebtoken");

const generateToken = (res, userId, {isAdmin, isEditor}) => {
    const refreshToken = jwt.sign({userId, isAdmin, isEditor}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "3d" 
    })
    console.log(refreshToken);
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
    })
    return refreshToken;
}

const generateAccessToken = (res, userId, {isAdmin, isEditor}) => {
    console.log("XXXXXXXXXX_isAdmin: ", isAdmin);
    const accessToken = jwt.sign({userId, isAdmin, isEditor}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d" 
    })
    return accessToken;
}

module.exports = {generateToken, generateAccessToken};