import styles from '../styles/Loader.module.css';

export default function Loader(props) {
  return (
    <div className={styles.container + ' ' + (props.hide ? styles.hide : '')}>
      <div className={styles.dot_flashing}></div>
    </div>
  );
}