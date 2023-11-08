import { useEffect, useState } from 'react';
import styles from '../styles/NavBar.module.css';

import {Rubik} from 'next/font/google';
const rubik = Rubik({
  weight: '400',
  subsets: ['latin']
})

export default function NavBar(props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <img src="/logo.svg" className={styles.logo} alt="TMKLB Logo"/>
        </a>
        <ul className={`${styles.nav_links} ${rubik.className}`}>
          <li className={`${styles.nav_item} ${props.about ? styles.active : ''}`}><a href="/about">About</a></li>
          <li className={styles.nav_item}>
            <div className={`${styles.dropdown} ${menuOpen ? styles.active : ''}`}>
              <div className={styles.dropdown_btn} onClick={() => {
                setMenuOpen(!menuOpen);
              }}>
                Events
              </div>
              <div className={styles.arrow_back}></div>
              <div className={styles.arrow}></div>
              <div className={styles.dropdown_items}>
                <a className={`${props.thanks ? styles.active : ''}`} href="/thanks">🦃&nbsp;&nbsp;Thanks</a>
              </div>
            </div>
          </li>
          <li className={styles.nav_item}><div className={styles.divider}></div></li>
          <li className={styles.nav_item}><span>Sign in</span></li>
          <li className={styles.nav_item}><div className={styles.button}>Sign up</div></li>
        </ul>
      </div>
    </nav>
  )
}