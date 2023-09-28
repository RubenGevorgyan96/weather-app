import { IDailyWeatherList } from "../types"

export const getDay = () => {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  const currentDate = localDate.toISOString().split("T")[0]
  return currentDate
}

export const getDailyWeather = (data: IDailyWeatherList[]) => {
  let thisTime = new Date().getHours()

  const dailyWeatherByTime = data?.filter((elem) => {
    let time = Number(elem.dt_txt.slice(11, 13))
    if (thisTime - 1 === time && thisTime + 2 === time + 3) {
      return time === thisTime - 1
    } else if (thisTime + 1 === time && thisTime - 2 === time - 3) {
      return time === thisTime + 1
    }
  })

  if (dailyWeatherByTime.length) {
    return dailyWeatherByTime
  } else {
    const filteredByTime = data.filter((item) =>
      item.dt_txt.includes("15:00:00")
    )
    return filteredByTime
  }
}
