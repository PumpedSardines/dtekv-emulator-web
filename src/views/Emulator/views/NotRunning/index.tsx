import React from "react";
import styles from "./NotRunning.module.css";

function NotRunning() {
  return (
    <div className={styles.root}>
      <LoadUi />
    </div>
  );
}

function LoadUi() {
  return (
    <div className={styles.loadUi}>
      <h1>No File Loaded</h1>
      <div className={styles.buttons}>
        {
          // <label className={styles.button}>
          //   Load Binary
          //   <input
          //     type="file"
          //     onChange={async (e) => {
          //       const file = e.currentTarget.files![0];
          //       const bin = new Uint8Array(await file.arrayBuffer());
          //       loadBinary(bin);
          //     }}
          //   />
          // </label>
        }
        {
          // <button className={styles.button}>Load Example</button>
        }
      </div>
    </div>
  );
}

export default React.memo(NotRunning);
