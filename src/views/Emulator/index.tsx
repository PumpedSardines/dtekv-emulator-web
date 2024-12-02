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

import { clockFrequencyAtom, hasLoadedAtom } from "../../atoms";

import styles from "./Emulator.module.css";
import { feqParser } from "../../utils/feqParser";
import Layout from "../../partials/Layout";

function Emulator() {
  return (
    <Layout navbar={<Nav />}>
      <div className={styles["main"]}>
        <section className={styles["vga"]}>
          <FrequencyCounter />
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
      </div>
    </Layout>
  );
}

function FrequencyCounter() {
  const frequency = useAtomValue(clockFrequencyAtom);
  const hasLoaded = useAtomValue(hasLoadedAtom);

  if (!hasLoaded) {
    return null;
  }
  return <p className={styles.frequency}>{feqParser(frequency)}</p>;
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
