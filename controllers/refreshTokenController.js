const User = require("../models/User");
const jwt = require('jsonwebtoken');
const {generateAccessToken} = require("../utils/generate-token");
const asyncHandler = require('express-async-handler');
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("cookies: ", cookies);
    console.log("HEYY");
    if(!cookies?.jwt) { return res.status(401).json({message: 'no cookie'});}
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const user = await User.findOne({refreshToken: refreshToken});
    console.log(user);
    if(!user) { return res.status(401).json({message: 'Unauthorized_NO user'}); }
    /*jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user._id !== decoded.userId) return res.status(403);
        const {accessToken} = generateToken(res, user._id, user.role);
        return res.status(201).json({accessToken});*/
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(decoded.userId);
    if(user._id == decoded.userId) {
        console.log("yep");
        const accessToken = generateAccessToken(res, user._id, user.role);
        return res.status(201).json({accessToken});
    }
}

module.exports = {handleRefreshToken};