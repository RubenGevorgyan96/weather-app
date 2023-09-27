import { IHourlyWeather } from "../../types"
import styles from "./weather.module.css"

export const WeatherHourlyItems = ({
  hourlyItems,
  isCelsius,
  celsiusOrFahrenheit
}: {
  hourlyItems: IHourlyWeather
  isCelsius: boolean
  celsiusOrFahrenheit: string
}) => {
  return (
    <>
      {hourlyItems.dailyWeatherList.map((item) => (
        <div key={item.dt_txt} className={styles.daily_weather_item}>
          <span>{item.dt_txt?.split(" ")[1]}</span>
          <span>
            {isCelsius
              ? item.main.temp.toFixed(0)
              : (item.main.temp * (9 / 5) + 32).toFixed(0)}
            {celsiusOrFahrenheit}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt="weather"
            className={styles.daily_weather_icon}
          />
        </div>
      ))}
    </>
  )
}
