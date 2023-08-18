import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { sendMail } from "../../utils/sendMail";

const initialState={
    weather:{
        loading:true,
        details:{},
        temp:{},
        location:"",
        success:false,
        error:false,
        message:""
    },
    news:{
        loading:true,
        data:{},
        success:false,
        error:false,
        message:""
    },
    search:{
        loading:false,
        error:false,
        message:"",
        result:[]
    }
}

export const getWeather = createAsyncThunk('utils/weather', async(action)=>{
    try {
        let response ;
        await axios.post("/api/v1/util/weather", action).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const getNews = createAsyncThunk('utils/news', async(action)=>{
    try {
        let response ;
        await axios.get("/api/v1/util/news").then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})

export const searchAction = createAsyncThunk('utils/searchAction', async(action)=>{
    try {
        let response ;
        await axios.get(`/api/v1/user/search?keyword=${action&& action}`).then(res=>{
            response = res.data;
        }).catch(err=>{
            response = err.response.data
        })

        return response;
    }catch(err){
     console.log(err)   
    }
})



const utilSlice = createSlice({
    name:"utils",
    initialState,
    extraReducers:{
        [getWeather.pending]: (state)=>{
            state.weather.loading = true;
        },
        [getWeather.fulfilled]: (state, action)=>{
            state.weather.loading = false;
            
            if(action.payload.succes===false){
                state.weather.message = action.payload.message;
                state.weather.error = true
            }else{
                state.weather.success = true;
                state.weather.details = action.payload.weather
                state.weather.temp = action.payload.temp
                state.weather.location = action.payload.location
            }
        },
        [getNews.pending]: (state)=>{
            state.news.loading = true;
        },
        [getNews.fulfilled]: (state, action)=>{
            state.news.loading = false;
            
            if(action.payload.succes===false){
                state.news.message = action.payload.message;
                state.news.error = true
            }else{
                state.news.success = true;
                state.news.data = action.payload.article
            }
        },
        [searchAction.pending]: (state)=>{
            state.search.loading = true;
        },
        [searchAction.fulfilled]: (state, action)=>{
            state.search.loading = false;
            
            if(action.payload.succes===false){
                state.search.message = action.payload.message;
                state.search.error = true
            }else{
                state.search.success = true;
                state.search.result = action.payload.data
            }
        },
    }
})

export default utilSlice.reducer;
