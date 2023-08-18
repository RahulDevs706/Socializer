const User = require("../models/userModel");
const { onlineUsers } = require("../utils/constants");



exports.updateUserSocketId = async (socket, userId, next) => {
    try {
      // Get user ID from socket's query parameter
    //   const userId = socket.handshake.query.userId;
      // Find the user in the database and update the socketId
      if(!onlineUsers[userId]){
          onlineUsers[userId] = socket.id;
      }
  
      // Store the user ID and socket connection in a data structure on the server
    //   storeUserSocketConnection(userId, socket);      
      // Call the next middleware function
      next()
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };
  
  // Middleware function to update user's socketId on disconnection
  exports.removeUserSocketId = async (socket,userId) => {
    try {
      // Get user ID from socket's query parameter
    //   const userId = socket.handshake.query.userId;
      onlineUsers[userId]=null;

      // Remove the user ID and socket connection from the data structure on the server
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };