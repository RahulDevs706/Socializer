// import { createSlice } from '@reduxjs/toolkit';
// import io from 'socket.io-client';

// const socketSlice = createSlice({
//   name: 'socket',
//   initialState: {
//     socketRef: null,
//     isMounted: true,
//     notifications: [],
//   },
//   reducers: {
//     setSocketRef: (state, action) => {
//       state.socketRef = action.payload;
//     },
//     setIsMounted: (state, action) => {
//       state.isMounted = action.payload;
//     },
//     addNotification: (state, action) => {
//       state.notifications.push(action.payload);
//     },
//     clearNotifications: (state) => {
//       state.notifications = [];
//     },
//   },
// });

// export const {
//   setSocketRef,
//   setIsMounted,
//   addNotification,
//   clearNotifications,
// } = socketSlice.actions;

// export default socketSlice.reducer;

// export const sendNotification = (notification) => (dispatch, getState) => {
//   const { socketRef } = getState().socket;

//   if (socketRef) {
//     socketRef.emit('send_notification', { notification });
//   }
// };

// export const receiveNotification = () => (dispatch, getState) => {
//   const { socketRef } = getState().socket;

//   if (socketRef) {
//     socketRef.on('rec_notify', (data) => {
//       dispatch(addNotification(data));
//     });
//   }
// };

// export const connectToSocketServer = () => (dispatch, getState) => {
//   const { isMounted } = getState().socket;

//   if (isMounted) {
//     const socket = io('http://192.168.1.4:3001/', {
//       transports: ['websocket'],
//     });

//     socket.on('connect', () => {
//       dispatch(setSocketRef(socket));
//       console.log('Socket client connected');
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket client disconnected');
//     });
//   }
// };

// export const disconnectFromSocketServer = () => (dispatch, getState) => {
//   const { socketRef } = getState().socket;

//   if (socketRef) {
//     socketRef.disconnect();
//   }
// };
