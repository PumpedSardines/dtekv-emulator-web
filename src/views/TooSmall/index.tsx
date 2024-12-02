import React from "react";

import useWindowDimension from "../../hooks/useWindowDimensions";
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT, GITHUB_URL } from "../../consts";

import styles from "./TooSmall.module.css";

function TooSmall() {
  const dimensions = useWindowDimension();

  return (
    <div className={styles.root}>
      <h1>Your viewport is too&nbsp;small</h1>
      <p>The DTEK-V emulator is designed to be run in a desktop&nbsp;browser</p>
      <div className={styles.splitter} />
      <p>
        Minimum: {MIN_WINDOW_WIDTH}x{MIN_WINDOW_HEIGHT}
      </p>
      <p>
        Current {dimensions.width}x{dimensions.height}
      </p>
      <div className={styles.splitter} />
      <div className={styles.splitter} />
      <p>
        <a href={GITHUB_URL} target="_blank">
          View project on GitHub
        </a>
      </p>
    </div>
  );
}

export default React.memo(TooSmall);
