import NavBar from '../components/NavBar';

import styles from '../styles/About.module.css';

import {Rubik} from 'next/font/google';
const rubik300 = Rubik({
  weight: '300',
  subsets: ['latin']
})

const rubik600 = Rubik({
  weight: '600',
  subsets: ['latin']
})

export default function About() {
  return (
    <div>
      <NavBar about={true} />
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={`${styles.title} ${rubik600.className}`}>
            Our Story
          </div>
          <div className={`${styles.info} ${rubik300.className}`}>
            <p>
              TMKLB, as an organization, was founded in 2013 with the primary objective of fostering and
              strengthening the connections among close friends.
              <br/><br/>
              Over the years, the group has experienced remarkable growth, welcoming new members,
              and is currently undergoing a transformation as it progresses towards becoming a publicly
              recognized entity.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.spacer}></div>
      <div className={styles.section}>
        <div className={`${styles.title} ${rubik600.className}`}>
          Founders
        </div>
        <div className={styles.row}>
          <div className={styles.item}>
            <div className={styles.profile}>
              <img src="/profile_yuup.jpg" alt="Profile Image"/>
            </div>
            <div className={styles.name}>Yuup</div>
            <div className={styles.subtitle}>President</div>
          </div>
          <div className={styles.item}>
            <div className={styles.profile}>
              <img src="/profile_sha.jpg" alt="Profile Image"/>
            </div>
            <div className={styles.name}>Sha</div>
          </div>
          <div className={styles.item}>
            <div className={styles.profile}>
              <img src="/profile_mel.jpg" alt="Profile Image"/>
            </div>
            <div className={styles.name}>Mel</div>
          </div>
        </div>
      </div>
    </div>
  );
}
