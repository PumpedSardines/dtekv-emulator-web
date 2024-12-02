import React, { useMemo } from "react";

import { useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { ledStripAtom } from "../../../../atoms";
import Led from "../../../../components/Led";

import styles from "./LedStrip.module.css";

function LedStrip() {
  return (
    <div className={styles.root}>
      {new Array(10).fill(0).map((_, i) => (
        <ControlledLed key={i} index={i} />
      ))}
    </div>
  );
}

type ControlledLedProps = {
  index: number;
};

function ControlledLed(props: ControlledLedProps) {
  const on = useAtomValue(
    useMemo(
      () => selectAtom(ledStripAtom, (s) => s[props.index]),
      [props.index],
    ),
  );

  return <Led on={on} />;
}

export default React.memo(LedStrip);
