import { useEffect, useState } from 'react';
import styles from '../styles/NavBar.module.css';

import {Rubik} from 'next/font/google';
const rubik = Rubik({
  weight: '400',
  subsets: ['latin']
})

import {RxHamburgerMenu} from 'react-icons/rx';

export default function NavBar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventsActive, setEventsActive] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          <img src="/logo.svg" alt="TMKLB Logo"/>
        </a>
        <div className={`${styles.nav_links} ${rubik.className} ${menuOpen ? styles.open : ''}`}>
          <div className={`${styles.nav_item} ${props.about ? styles.active : ''}`}><a href="/about">About</a></div>
          <div className={styles.nav_item}>
            <div className={`${styles.dropdown} ${eventsActive ? styles.active : ''}`}>
              <div className={styles.dropdown_btn} onClick={() => {
                setEventsActive(!eventsActive);
              }}>
                Events
              </div>
              <div className={styles.arrow_back}></div>
              <div className={styles.arrow}></div>
              <div className={styles.dropdown_items}>
                <a className={`${props.thanks ? styles.active : ''}`} href="/thanks">🦃&nbsp;&nbsp;Thanks</a>
              </div>
            </div>
          </div>
          <div className={`${styles.nav_item} ${styles.div}`}><div className={styles.divider}></div></div>
          <div className={styles.nav_item}><span>Sign in</span></div>
          <div className={`${styles.nav_item} ${styles.btn}`}><div className={styles.button}>Sign up</div></div>
        </div>
        <div className={styles.nav_menu} onClick={() => {
          setMenuOpen(!menuOpen);
        }}>
          <RxHamburgerMenu />
        </div>
      </div>
    </nav>
  )
}