import React from "react";
import styles from "./Emulator.module.scss";
import RatioImageBox from "../../components/RatioImageBox";

type EmulatorProps = {
  
};

function Emulator(props: EmulatorProps) {
  return (
    <main className={styles['main']}>
      <nav className={styles['nav']} /> 
      <section className={styles['vga']}>
        <RatioImageBox width={320} height={240} src="/assets/vga.png" />
      </section>
      <section className={styles['uart']} />
      <footer className={styles['footer']} />
    </main>
  )
}

export default React.memo(Emulator);
