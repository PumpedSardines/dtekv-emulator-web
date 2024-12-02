import React from "react";

import styles from "./Box.module.css";

type BoxProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

function Box(props: BoxProps) {
  return (
    <div className={styles.box}>
      <section className={styles.textContent}>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </section>
      <section className={styles.content}>{props.children}</section>
    </div>
  );
}

export default React.memo(Box);
