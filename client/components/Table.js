import styles from '../styles/Table.module.css';

export default function Table(props) {
  const rows = [];
  (props.data.rows || []).forEach((item, index) => {
    rows.push(
      item.map((column, _index) => {
        return <div key={_index} className={styles.table_cell}>
          <span className={column.bold ? styles.bold : ''} onClick={column.onClick ? column.onClick : null}>{column.value}</span>
        </div>
      })
    );
  });
  return (
    <div className={styles.table_wrapper}>
      <div className={styles.table}>
        <div className={styles.table_head}>
          {props.data.headers.map((item, index) => {
            return <div key={index} className={styles.table_cell}>{item}</div>
          })}
        </div>
        {rows.map((item, index) => {
          return <div key={index} className={styles.table_row}>{item}</div>
        })}
      </div>
      {/* <div className={styles.table_footer}>
      </div> */}
    </div>
  )
}