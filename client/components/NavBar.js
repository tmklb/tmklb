import styles from '../styles/NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          {/* <img src="/assets/logo.svg" class="logo" alt="TMKLB"/> */}
          TMKLB
        </a>
        {/* <ul className={styles.nav_links}>
          <li className={styles.nav_item}><a href="/about">About</a></li>
          <li className={styles.nav_item}><a href="/location">Events</a></li>
          <li className={styles.nav_item}><a href="/location">Services</a></li>
        </ul> */}
      </div>
    </nav>
  )
}