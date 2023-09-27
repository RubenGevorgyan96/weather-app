import { createSlice } from "@reduxjs/toolkit"
import { IWeatherInitialState } from "../types"
import { fetchWeatherDaily, fetchCurrentWeatherData } from "./actions"

const initialState: IWeatherInitialState = {
  weatherLoading: false,
  city: "",
  celsiusOrFahrenheit: {
    isCelsius: true,
    degree: ""
  },
  weatherData: {
    name: "",
    id: "",
    main: { temp: "" },
    weather: {
      description: "",
      icon: "",
      id: "",
      main: ""
    }
  },
  dailyWeatherList: [],
  notFound: ""
}

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    filteredDailyWeather: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeatherData.pending, (state) => {
        state.weatherLoading = true
      })
      .addCase(fetchCurrentWeatherData.fulfilled, (state, action) => {
        state.weatherLoading = false
        state.weatherData.id = action.payload.id
        state.weatherData.name = action.payload.name
        state.weatherData.main.temp = action.payload?.main?.temp
        state.weatherData.weather = action.payload?.weather?.[0]
        state.notFound = action.payload.message
      })
      .addCase(fetchCurrentWeatherData.rejected, (state) => {
        state.weatherLoading = false
      })
      .addCase(fetchWeatherDaily.fulfilled, (state, action) => {
        state.dailyWeatherList = action.payload.list
      })
  }
})

export default weatherSlice.reducer
