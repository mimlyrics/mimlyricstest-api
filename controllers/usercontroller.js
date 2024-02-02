const asyncHandler = require("express-async-handler");
const router = require("express").Router();
const User = require("../models/User");
const {generateToken, generateAccessToken} = require("../utils/generate-token");
const fs = require("fs");
const jwt = require('jsonwebtoken');

const register =  asyncHandler (async (req, res) => {
    var {firstName, lastName, email, phone, password, role} = req.body;    
    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(401);
        throw new Error('User already exists');
    }
    console.log("heyy");
    const user = await User.create({firstName, lastName, email, phone, password, role});    
    if(user ) {
        const refreshToken = generateToken(res, user._id, user.role);
        //const refreshToken = jwt.sign({"userId": user._id, "isEditor": isEditor, "isAdmin": isAdmin}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15min'})
        user.refreshToken = refreshToken;
        const accessToken = generateAccessToken(res, user._id, user.role);
        await user.save();
        //console.log(generateToken);
        //console.log(user);
        res.status(201).json({_id: user._id, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            phone: user.phone,
            role: user.role,
            accessToken: accessToken
        });
    }else {
        res.status(400);
        throw new Error(`Invalid user data`);
    }
})

const auth = asyncHandler ( async (req, res) => {    
    const {email, password} = req.body;
    const user = await User.findOne({email});
    console.log(user);
    if(user &&  (await user.matchPassword(password))) {
        const refreshToken = generateToken(res, user._id, user.role);
        user.refreshToken = refreshToken;
        const accessToken = generateAccessToken(res, user._id, user.role);
        await user.save();
        //console.log(generateToken);
        //console.log(user);
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            accessToken: accessToken
        })
    }else {
        res.status(401);
        throw new Error(`Invalid email or password`);
    }
})

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    //console.log("heyy");
    //console.log('To be emptied ', cookies);
    if(!cookies.jwt) return res.status(204).message({message:'no jwt cookie'});
    const refreshToken = cookies.jwt;
    // is refreshToken in DB
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) {
        res.clearCookie('jwt', '', {
            httpOnly: true,
            sameSite: 'None',
            expiresIn: new Date(0)
        })
        return res.status(200).message({message: "cookie has been emptied"});
    }
    // delete refreshToken in DB
    user.refreshToken = '';
    await user.save();
    res.clearCookie('jwt', '', {httpOnly: true, sameSite: 'None', expiresIn: new Date(0)})
    return res.status(200).json({message: "user logged out"});
})

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById({_id: req.user._id});
  if (user) {
    const user = {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role
    }
    console.log(req.user);
    return res.status(201).json({user});
  } else {
    return res.status(404).json({message: 'No user with such id'});
  }
});

const getUser = asyncHandler(async (req, res) => {
  const {userId} = req.params
  const userx = await User.findById({_id: userId});
  if (userx) {
    return res.status(201).json({userx})        
  } else {
    return res.status(404).json({message: 'No user with id'});
  }
});

const getUserByPhone = asyncHandler(async (req, res) => {
    const {phone} = req.params;
    const user = await User.findOne({phone: phone});
    if(user) {
        return res.status(201).json({user});
    }else {
        return res.status(404).json({message: `No user with such phone number`});
    }
})

const getUsersProfile = asyncHandler(async (req, res) => {
    //console.log(req.user);
    console.log("Get user Profile")
    const users = await User.find({});
    if(users) {
        res.status(201).json({users});
    }else {
        return res.status(404).json({message: 'No User has been found'});
    }
})

const EditRole = async (req, res) => {
    const {id} = req.params;
    const {role} = req.body;
    const user = await User.findById({_id:id});
    if(user) {
        user.role = role || user.role;
        await user.save();
        return res.status(201).json({user});
    }
}

const updateUserProfile = asyncHandler(async (req, res) => {
    console.log("Update User Profile");
    console.log(req.body);
    const user = await User.findById({_id: req.user._id});
    console.log(req.user);
    if(user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName
        const accessToken = generateAccessToken(res, user._id, user.role);
        const updatedUser = await user.save();
        console.log(updatedUser);
        return res.status(201).json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            accessToken: accessToken
        });
    }    
})

const AdminUpdateUser = asyncHandler(async (req, res) => {
    const {userId, hisId} = req.params;
    const {firstName, lastName, email, password} = req.body;
    const user = await User.findById({_id: userId});
    const userx = await User.findById({_id: hisId} )
    if(user.role === "201") {
        avatar = req.protocol + "://" + req.get("host") + "/public/profilePicture/" + req.file.filename;
        userx.firstName = req.body.firstName || userx.firstName,
        userx.lastName = req.body.lastName || userx.lastName,
        userx.email = req.body.email || userx.email,
        userx.password = req.body.password || userx.password
        userx.avatar = avatar || userx.avatar
    } else {
        return res.status(201).json({message: `Permission denied`});
    }
})

const searchProfile = asyncHandler(async (req, res) => {
    const {searchId} = req.params;
    const users = await User.find({ $or: [{firstName: searchId}, {lastName: searchId}, {email:searchId}, {phone: searchId}]});
    if(users) {
        return res.status(201).json({users});
    }else {
        return res.status(404).json({message: `No User exist with such searchId`});
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const user = await User.findOneAndDelete({_id: userId});
    if(user.avatar) {
        const avatarSplit = user.avatar.split(":5000");
        const deleteAvatar = "." + avatarSplit[1];   
        fs.unlink(deleteAvatar, (err) => {
            if(err) throw err;
            console.log("Deleted File successfully");
        })
    }
    res.cookie('jwt', '', {
        httpOnly: true,
        expiresIn: new Date(0)
    })
    return res.status(200).json("successfully deleted user");  
})

const postAvatar = asyncHandler (async (req, res) => {
    const {userId} = req.params;
    console.log(req.file);
    avatar = req.protocol + "://" + req.get("host") + "/public/profilePicture/" + req.file.filename;
    const user = await User.findById({_id:userId});
    if(user || user.avatar) {
        const splitAvatar = user.avatar.split(":5000");
        const deleteAvatar = "." + splitAvatar[1];
        fs.unlink(deleteAvatar, (err) => {
            if (err) return res.status(400).json({message: "Bad request. Avatar has not been deleted"})
            console.log("deleted avatar successfully");
        })
        user.avatar = avatar || user.avatar;
    }
    const updatedUser = await user.save();
    return res.status(201).json({_id: updatedUser._id, firstName: updatedUser.firstName, 
        updatedUser: updatedUser.lastName, email: updatedUser.email, phone:updatedUser.phone,
         avatar:updatedUser.avatar});
})

const deleteAvatar = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    const user = await User.findById({_id:userId});
    if(user.avatar) {
        user.avatar = "" || user.avatar;
        const avatarSplit = user.avatar.split(":5000");
        const deleteAvatar = "." + avatarSplit[1];   
        fs.unlink(deleteAvatar, (err) => {
            if(err) throw err;
            console.log("Deleted File successfully");
        })
    }
    await user.save();
    // delete from the server
    return res.status(201).json(`Successfully deleted avatar`);
})

const getAvatar = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const user = await User.findById({_id:userId});
    if(user) {
        return res.status(201).json({user});
    }
})

const protectAdminx = asyncHandler (async (req, res, next) => {
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
            const { userId, isEditor, isAdmin} = decoded;
            if(isAdmin === true) {
                return res.status(200).json({user});
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

const protectEditorx = asyncHandler (async (req, res, next) => {
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
            const { userId, isEditor, isAdmin} = decoded;
            if(isEditor === true || isAdmin === true) {
                return res.status(200).json({user});
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

module.exports = {register, auth, logout, getUsersProfile, deleteUser,
     getUserProfile, updateUserProfile, 
     postAvatar, deleteAvatar,
     getAvatar, getUser, AdminUpdateUser, searchProfile, getUserByPhone, EditRole,
     protectAdminx: protectAdminx, protectEditorx: protectEditorx};