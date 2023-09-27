export interface IDailyWeatherList {
  clouds: {
    all: number
  }
  dt_txt: string
  main: { temp: number }
  weather: {
    description: string
    icon: string
    id: number
    main: string
  }[]
}

export interface IFilteredWeatherListWithDay {
  list: IDailyWeatherList | null
  currentItem: IDailyWeatherList[]
}

export interface IHourlyWeather {
  dailyWeatherList: IDailyWeatherList[]
}

export interface IWeatherInitialState {
  city: string
  weatherLoading: boolean
  notFound: string
  celsiusOrFahrenheit: {
    isCelsius: boolean
    degree: string
  }
  weatherData: {
    name: string
    id: string
    main: { temp: string | number }
    weather: {
      description: string
      icon: string
      id: string
      main: string
    }
  }
  dailyWeatherList: IDailyWeatherList[]
}

export interface IRoute {
  id: string
  path: string
  element: JSX.Element
}
