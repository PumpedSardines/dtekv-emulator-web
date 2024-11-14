import React, { useState } from "react";
import styles from "./Emulator.module.css";
import RatioBox from "../../components/RatioBox";
import { useCpuContext } from "../../contexts/CpuContext";
import HexDisplays from "./views/HexDisplays";
import Nav from "./views/Nav";
import Uart from "./views/Uart";
import Button from "./views/Button";
import Switches from "./views/Switches";
import Vga from "./views/Vga";
import NotRunning from "./views/NotRunning";
import cx from "../../utils/cx";
import useIsSafari from "../../hooks/useIsSafari";

function Emulator() {
  const { hasLoaded } = useCpuContext();
  const isSafari = useIsSafari();

  return (
    <main className={styles["main"]}>
      <nav className={cx(styles["nav"], isSafari && styles["safari"])}>
        <Nav />
      </nav>
      <section className={styles["vga"]}>
        <RatioBox width={320} height={240}>
          {hasLoaded ? <Vga /> : <NotRunning />}
        </RatioBox>
      </section>
      <section className={styles["uart"]}>
        <Uart />
      </section>
      <footer className={styles["footer"]}>
        <HexDisplays />
        <div className={styles.splitter} />
        <Switches />
        <Button />
      </footer>
    </main>
  );
}

export default React.memo(Emulator);
