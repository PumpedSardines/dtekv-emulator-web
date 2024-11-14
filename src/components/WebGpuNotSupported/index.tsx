import React from "react";
import styles from "./WebGpuNotSupported.module.css";

function WebGpuNotSupported() {
  return (
    <div className={styles.root}>
      <h1>Your browser doesn't support VGA emulation :(</h1>
      <p>
        Download a browser with WebGPU to emulate VGA. If you're not using VGA,
        don't worry! Everything else will work as normal
      </p>
    </div>
  );
}

export default React.memo(WebGpuNotSupported);
