import { useState, useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchWeatherDaily, fetchCurrentWeatherData } from "../../store/actions"
import { Link } from "react-router-dom"
import { getDay } from "../../helpers"
import { IDailyWeatherList, IFilteredWeatherListWithDay } from "../../types"
import styles from "./weather.module.css"
import { WeatherHourlyItems } from "./WeatherHourlyItems"

const Weather = () => {
  const dispatch = useAppDispatch()
  const { weatherData, dailyWeatherList, city, notFound } = useAppSelector(
    (state) => state.weather
  )
  const currentCity: string | null = localStorage.getItem("currentCity")
  const [cityName, setCityName] = useState<string>("")
  const [weatherPageData, setWeatherPageData] = useState({
    isCelsius: true
  })
  const [selectedHourlyItems, setSelectedHourlyItems] =
    useState<IFilteredWeatherListWithDay>({
      list: null,
      currentItem: []
    })

  const dailyWeatherToday = dailyWeatherList?.filter(
    (item) => item.dt_txt?.split(" ")[0] === getDay()
  )
  const dailyWeatherByTime = dailyWeatherList?.filter((item) =>
    item.dt_txt.includes("15:00:00")
  )

  const celsiusOrFahrenheit = weatherPageData.isCelsius ? "°C" : "°F"

  const getCurrent = useCallback(
    (list: IDailyWeatherList) => {
      const currentItem = dailyWeatherList?.filter(
        (item) => item.dt_txt?.split(" ")[0] === list.dt_txt.split(" ")[0]
      )
      setSelectedHourlyItems({ list, currentItem })
    },
    [dailyWeatherList]
  )

  useEffect(() => {
    if (!cityName && "geolocation" in navigator)
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        const data = await response.json()
        const city = await data.address.city
        localStorage.setItem("currentCity", city)
        dispatch(fetchCurrentWeatherData({ city: city }))
        dispatch(fetchWeatherDaily({ city: city }))
      })
  }, [currentCity, dispatch])

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      dispatch(fetchCurrentWeatherData({ city: cityName }))
      dispatch(fetchWeatherDaily({ city: cityName }))
      if (selectedHourlyItems.currentItem && selectedHourlyItems.list) {
        setSelectedHourlyItems({ currentItem: [], list: null })
      }
    }, 200)
    return () => {
      clearTimeout(timeout)
      if (!cityName && currentCity) {
        dispatch(fetchCurrentWeatherData({ city: currentCity }))
        dispatch(fetchWeatherDaily({ city: currentCity }))
      }
    }
  }, [cityName, dispatch, city, currentCity])

  return (
    <div className={styles.weather_page_wrapper}>
      <div className={styles.weather_info_wrapper}>
        <div className={styles.weather_header}>
          <Link to={"/"} className={styles.back_btn}>
            Back to Home Page
          </Link>
          <div className={styles.weather_search}>
            <input
              type="search"
              placeholder="Find weather of city"
              className={styles.weather_input}
              onChange={(e) => setCityName(e.target.value)}
              value={cityName}
            />
          </div>
          <div className={styles.weather_celsius_block}>
            <button
              className={`${styles.weather_type_btn} ${
                weatherPageData.isCelsius && styles.active
              }`}
              onClick={() => setWeatherPageData({ isCelsius: true })}
            >
              &#8451;
            </button>
            <button
              className={`${styles.weather_type_btn} ${
                !weatherPageData.isCelsius && styles.active
              }`}
              onClick={() => setWeatherPageData({ isCelsius: false })}
            >
              &#8457;
            </button>
          </div>
        </div>

        {notFound ? (
          <div className={styles.weather_notFound}>
            <p>Oops Something went wrong</p>
          </div>
        ) : (
          <>
            <div className={styles.weather_current_wrapper}>
              <div className={styles.weather_today}>
                <p>{weatherData.name}</p>
                <p>
                  {selectedHourlyItems.list && weatherPageData.isCelsius
                    ? selectedHourlyItems.list.main.temp.toFixed(0)
                    : selectedHourlyItems.list && !weatherPageData.isCelsius
                    ? (
                        selectedHourlyItems.list?.main?.temp * (9 / 5) +
                        32
                      ).toFixed(0)
                    : null}
                  {!selectedHourlyItems.list &&
                    (weatherData && weatherPageData.isCelsius
                      ? (+weatherData.main.temp).toFixed(0)
                      : (+weatherData.main.temp * (9 / 5) + 32).toFixed(0))}

                  {celsiusOrFahrenheit}
                </p>
                {weatherData.weather?.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${
                      selectedHourlyItems.list
                        ? selectedHourlyItems.list.weather[0].icon
                        : weatherData.weather.icon
                    }@2x.png`}
                    alt="weather-icon"
                  />
                )}
              </div>
              <div className={styles.weather_daily}>
                {dailyWeatherToday && (
                  <WeatherHourlyItems
                    hourlyItems={{
                      dailyWeatherList: !selectedHourlyItems.currentItem.length
                        ? dailyWeatherToday
                        : selectedHourlyItems.currentItem
                    }}
                    isCelsius={weatherPageData.isCelsius}
                    celsiusOrFahrenheit={celsiusOrFahrenheit}
                  />
                )}
              </div>
            </div>
            <div className={styles.weather_for_five_days_wrapper}>
              {dailyWeatherByTime?.map((item) => (
                <div
                  className={`${styles.weather_for_day}
                   ${
                     !selectedHourlyItems.list &&
                     item.dt_txt.split(" ")[0] === getDay()
                       ? styles.weather_for_day_selected
                       : null ||
                         item.dt_txt.split(" ")[0] ===
                           selectedHourlyItems.list?.dt_txt.split(" ")[0]
                       ? styles.weather_for_day_selected
                       : null
                   }
                  `}
                  key={item.dt_txt}
                  onClick={() => {
                    getCurrent(item)
                  }}
                >
                  <p>{item.dt_txt.split(" ")[0]}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="weather"
                  />
                  <p>
                    {weatherPageData.isCelsius
                      ? item.main.temp.toFixed(0)
                      : (item.main.temp * (9 / 5) + 32).toFixed()}
                    {celsiusOrFahrenheit}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Weather
