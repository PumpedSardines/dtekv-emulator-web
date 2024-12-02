import React from "react";

import styles from "./ShouldUpdate.module.css";

function ShouldUpdate() {
  return (
    <div className={styles.root}>
      <h1>New version is available</h1>
      <p>Refresh page to access the new version</p>
      <div className={styles.splitter} />
      <p>
        <a onClick={() => window.location.reload()}>
           Refresh
        </a>
      </p>
    </div>
  );
}

export default React.memo(ShouldUpdate);
