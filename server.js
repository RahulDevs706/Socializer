// config
const cloudinary = require('cloudinary');
const connectToDatabse = require('./config/database');
const app = require('./app');
const {createServer} = require("http");

const httpServer = createServer(app);

const socketIo = require("socket.io");
const User = require('./models/userModel');
const { updateUserSocketId, removeUserSocketId } = require('./middleware/socketMiddleware');
const { onlineUsers } = require('./utils/constants');

const io = socketIo(httpServer);



io.on("connection", (socket) => {
    
    // console.log("Socket client connected");

    socket.on("login", async (userId) => {
      try {
       if(userId){
            onlineUsers[userId] = socket.id;
            // console.log(`Socket ${socket.id} connected for user ${userId}`);
            // console.log(onlineUsers);
       }
      } catch (error) {
        console.error(error);
        // Handle errors here
      }
    });
  
    socket.on("logout", async (userId) => {
      try {
        if (onlineUsers[userId] === socket.id) {
          onlineUsers[userId] = null;
          // console.log(`Socket ${socket.id} disconnected for user ${userId}`);
          // console.log(onlineUsers);
        }
      } catch (error) {
        console.error(error);
        // Handle errors here
    }
    });

    socket.on("send_notification", async ({ notification }) => {
      try {
        const recipientIds = notification?.recipientUsers;

        
        recipientIds?.forEach(recipient => {
          // if (!debouncedSendNotification[recipient]) {
          //   debouncedSendNotification[recipient] = setTimeout(() => {
          //     // Emit the 'rec_notify' event after the debounce delay
          if(onlineUsers[recipient]){
            io.to(onlineUsers[recipient]).emit("rec_notify", notification);
            // console.log(recipient, onlineUsers[recipient]);
          }
             
              // clearTimeout(debouncedSendNotification[recipient]);
              // delete debouncedSendNotification[recipient];
            // }, 300); 
          // }
        });
        
      } catch (error) {
        console.error(error);
      }
    });
  });

app.set("io", io);



// handling uncaught exception
process.on("uncaughtException", err=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1)
})

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./config/config.env" });
}
  
const port = 3001;







httpServer.listen(port, ()=>{
    console.log(`server started on http://localhost:${port}`);
})

process.on('unhandledRejection', err=>{
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to unhandled promise rejection");

    httpServer.close(()=>{
        process.exit(1)
    })
})

connectToDatabse();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

