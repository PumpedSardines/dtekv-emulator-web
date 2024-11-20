import React from "react";
import { useAtomValue } from "jotai";

import HexDisplays from "./views/HexDisplays";
import Nav from "./views/Nav";
import Uart from "./views/Uart";
import Button from "./views/Button";
import Switches from "./views/Switches";
import Vga from "./views/Vga";
import NotRunning from "./views/NotRunning";
import LedStrip from "./views/LedStrip";

import RatioBox from "../../components/RatioBox";

import cx from "../../utils/cx";
import useIsSafari from "../../hooks/useIsSafari";
import { hasLoadedAtom } from "../../atoms";

import styles from "./Emulator.module.css";

function Emulator() {
  const isSafari = useIsSafari();

  return (
    <main className={styles["main"]}>
      <nav className={cx(styles["nav"], isSafari && styles["safari"])}>
        <Nav />
      </nav>
      <section className={styles["vga"]}>
        <RatioBox width={320} height={240}>
          <VgaNotRunning />
        </RatioBox>
      </section>
      <section className={styles["uart"]}>
        <Uart />
      </section>
      <footer className={styles["footer"]}>
        <HexDisplays />
        <div className={styles.splitter} />
        <div className={styles.switchLedBox}>
          <div className={styles.led}>
            <LedStrip />
          </div>
          <Switches />
        </div>
        <Button />
      </footer>
    </main>
  );
}

function VgaNotRunning() {
  const hasLoaded = useAtomValue(hasLoadedAtom);
  if (hasLoaded) {
    return <Vga />;
  } else {
    return <NotRunning />;
  }
}

export default React.memo(Emulator);
