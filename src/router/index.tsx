import { Routes, Route } from "react-router-dom"
import HomePage from "../components/home"
import WeatherPage from "../components/weatherContent"
import { IRoute } from "../types"

const routes: IRoute[] = [
  {
    id: "Home_Page",
    path: "/",
    element: <HomePage />
  },
  {
    id: "Weather_Page",
    path: "/weather",
    element: <WeatherPage />
  }
]

const Router = () => {
  return (
    <Routes>
      {routes.map(({ id, path, element }) => (
        <Route key={id} path={path} element={element} />
      ))}
    </Routes>
  )
}

export default Router
