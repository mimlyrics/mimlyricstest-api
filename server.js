const express = require('express');
const app = express();
const {createServer} = require('http');
const {Server} = require("socket.io")

// cookie parser/session
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['mimche'],
    maxAge: 24 * 60 * 60 * 1000
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
// cors
const credentials = require("./middlewares/credentials");
app.use(credentials);
const cors = require('cors');

let corsOptions = {
    origin: 'http://localhost:3000',    
    credentials: 'true',
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']   
}
app.use(cors(corsOptions));
// dotenv
require('dotenv').config();

const httpServer = createServer(app);


var allowedOrigins = [ 'https://mimlyricstest.onrender.com',
  'https://mimlyricstest2.onrender.com','http://localhost:3000']

const io = new Server(httpServer, {
  /*sid: "lv_VI97HAXpY6yYWAAAC",
  upgrades: ["websocket"],
  pingInterval: 70000,
  pingTimeout: 60000,
  maxPayload: 1e6,
  maxHttpBufferSize: 1e8,
  path: "/my-custom-path",*/
  cors: {
    //origin: "http://localhost:3000",
    origin: function(origin, callback) {
        if(allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }else {
            callback(new Error('Not allowed by cors'));
        }
    },
    methods: ["GET, POST, PUT, DELETE"],
    credentials: true,
  },
});
const port = process.env.PORT || 5175;
const passportSetUp = require('./utils/passport-google');

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// db
const connectDB = require('./config/db');
connectDB();

// routers
const authJWTRoute = require("./routes/userRoutes");
app.use('/api/v1', authJWTRoute);
const refreshRoute = require("./routes/refreshRoutes");
app.use('/api/v1', refreshRoute);
const roomRoute = require("./routes/roomRoutes");
const authGoogle = require("./routes/authRoutes");
app.use("/", authGoogle);
app.use("/api/v1", roomRoute);
const conversationRoute = require("./routes/conversationRoutes");
app.use("/api/v1", conversationRoute);
const messageRoute = require("./routes/messageRoutes");
app.use("/api/v1", messageRoute);
const mimVideoRoutes = require("./routes/videoRoutes");
app.use("/api/v1", mimVideoRoutes);
const lyricRoutes = require("./routes/lyricRoutes");
app.use("/api/v1", lyricRoutes);
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/v1", commentRoutes);
const albumRoutes = require("./routes/albumRoutes");
app.use("/api/v1", albumRoutes);
// CHAT MESSAGE

let users = [];
let user = {};
const addUser = (({id, phone, room, avatar, username}) => {    
    const existingUser = users.find(user => user.room === room && user.phone === phone);
    if(existingUser) {
        return {error: 'Username is taken'};
    }
    user = {id, phone,room, avatar, username}
    users.push(user);
    return {user}
})

const removeUser = (id) => {
    return users = users.filter(user => user.id !== id);
}

const getUser = (id) => { 
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => users.filter(user => user.room === room);

io.on("connection", (socket) => {
    //console.log("connected");     
    socket.on('join', ({phone, room, avatar, username}, callback) => {
        console.log(phone, room);
        id = socket.id
        let {error,user } = addUser({id, phone, room, avatar, username});
        io.emit("getUser", {users, user});
        if(error) return callback(error);
        socket.emit('message', {user: 'admin', text: ` Welcome ${phone} !`});
        socket.broadcast.to(room).emit('message', {user: 'admin', text: `${username}, has joined` });
        socket.join(room);
        callback();
    })
    //console.log(user.id);
    socket.on("sendMessage", ({from, to, text, avatar, username}, callback) => {   
        user = getUser(user.id); 
        //console.log(user);
        io.to(user.room).emit('message', { user: from, text: text, avatar: avatar, username: username });
        callback();
    });
    socket.on("disconnect", () => {
        removeUser(socket.id);
        //console.log("User had left");
        io.emit("getUsers", users);
    });
});

// middlewares routers
const {notFound, errorHandler} = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
