const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

const User = require('../models/userModel');
const NewsAPI = require('newsapi');
const axios = require('axios');


exports.getNews=catchAsyncError( async(req, res, next)=>{

  const newsapi = new NewsAPI(process.env.NEWS_API);

  await newsapi.v2.topHeadlines({
      category: "technology",
      language: 'en',
      country: 'in',
      sortBy: 'popularity'
    }).then(response => {
      const number = Math.floor(Math.random()*response.articles.length);
      const article = response?.articles[number];
      res.status(200).json({
        article: article
      })
  });

});

exports.getWeatherInfo=catchAsyncError( async(req, res, next)=>{
    const {lat, lon} = req.body;
    const user = await User.findById(req.user.id);

    const url=  `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.WEATHER_API_KEY}`

    let currLocation={
      city:"",
      state:"",
      country:""
    }
    await axios.get(url).then(response => {
      currLocation = {
          city:response.data[0].name,
          state:response.data[0].state,
          country:response.data[0].country,
        }
    });



    const weather =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    const locationName = `${currLocation.city}, ${currLocation.state}, ${currLocation.country}`

    await axios.get(weather).then(response => {
        res.status(200).json({
            success:true,
            weather: response.data.weather[0],
            temp:response.data.main,
            location:locationName,
        })
    });
});