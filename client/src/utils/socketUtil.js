// import { useRef } from 'react';
// import io from 'socket.io-client';

// const socketRef = useRef(null);

// const connectSocket = () => {
//   socketRef.current = io("http://localhost:3001", {
//     transports: ["websocket"]
//   });

//   socketRef.current.on("connect", () => {
//     console.log("Socket client connected");
//   });

//   socketRef.current.on("disconnect", () => {
//     console.log("Socket client disconnected");
//   });
// }

// const disconnectSocket = () => {
//   if (socketRef.current) {
//     socketRef.current.disconnect();
//   }
// }

// export { socketRef, connectSocket, disconnectSocket };