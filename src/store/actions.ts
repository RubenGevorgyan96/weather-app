import { createAsyncThunk } from "@reduxjs/toolkit"

const currentCity: string | null = localStorage.getItem("currentCity") || null
export const fetchCurrentWeatherData = createAsyncThunk(
  "weather/fetchCurrentWeatherData",
  async ({ city }: { city: string | null }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}weather?q=${
          city || currentCity || "Yerevan"
        }&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      )
      return response.json()
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return rejectWithValue("City not found")
    }
  }
)

export const fetchWeatherDaily = createAsyncThunk(
  "weather/fetchWeatherDaily",
  async ({ city }: { city: string | null }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}forecast?q=${
          city || currentCity || "Yerevan"
        }&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      )
      return response.json()
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return rejectWithValue("City not found")
    }
  }
)
