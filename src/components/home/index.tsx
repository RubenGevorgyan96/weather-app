import { Link } from "react-router-dom"
import styles from "./home.module.css"

const Home = () => {
  return (
    <div className={styles.home_container}>
      <div className={styles.home_main_info}>
        <h1 className={styles.home_welcome}>Get Your City Weather</h1>
        <Link to={"/weather"} className={styles.home_btn}>
          Get Weather
        </Link>
      </div>
    </div>
  )
}

export default Home
