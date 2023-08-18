import {configureStore} from "@reduxjs/toolkit"
import postSlice from "./Slice/postSlice"
import userSlice from "./Slice/userSlice"
import utilSlice from "./Slice/utilSlice"
import socketSlice from "./Slice/socketSlice"

export const store = configureStore({
    reducer:{
        user:userSlice,
        utils:utilSlice,
        post:postSlice,
        // socket:socketSlice
    }
})