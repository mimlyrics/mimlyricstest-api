const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
require('dotenv').config();

const protect = async (req, res, next) => {
    let token;
    if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }else { 
        const authHeader = req.headers['authorization'];
        token = authHeader.split(" ")[1];  
    }
    console.log("token: ", token);
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log(decoded);
            req.user = await User.findById(decoded.userId).select('-password');
            console.log(req.user);
            next();
        }catch(error) {
            res.status(401);
            throw new Error(`Not authorized, invalid token`);
        }
    }else {
        res.status(401);
        throw new Error(`Not authorized, no token`)
    }
}

const protectAdmin = asyncHandler (async (req, res, next) => {
    let token;
    console.log("Heyyy");
    console.log(req.headers);
    //console.log(req.cookies);
    if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }else { 
        const authHeader = req.headers['authorization'];
        token = authHeader.split(" ")[1];  
    }
    console.log("token: ", token);
    if(token) {
        console.log("token: ", token);
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log("decoded: ", decoded);
            let user = await User.findById({_id: decoded.userId}).where({'role.isAdmin': decoded.isAdmin});
            console.log(user.role);
            req.role = user.role;
            const { userId, isEditor, isAdmin} = decoded;
            if(isAdmin === true) {
                next();
            }
            else {
                return res.status(401).json({message: `You are not authorized to use this page`});
            }
        }catch(error) {
            return res.status(401).json({message: `*Not authorized`});
        }
    }else {
        return res.status(401).json({message: `Not authorized`});
    }
})

const protectEditor = asyncHandler (async (req, res, next) => {
    let token;
    if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }else { 
        const authHeader = req.headers['authorization'];
        token = authHeader.split(" ")[1];  
    }
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const { userId, isEditor, isAdmin} = decoded;
            if( isEditor == true || isAdmin == true) {
                next();
            }
            else {
                return res.status(401).json({message: `You are not authorized to use this page`});
            }
        }catch(error) {
            return res.status(401).json({message: `*Not authorized`});
        }
    }else {
        return res.status(401).json({message: `Not authorized`});
    }
})

module.exports = {protect, protectAdmin, protectEditor};