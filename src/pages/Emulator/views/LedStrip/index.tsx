import React from "react";

import { useAtomValue } from "jotai";
import { ledStripAtom } from "../../../../atoms";
import Led from "../../../../components/Led";

import styles from "./LedStrip.module.css"

function LedStrip() {
  const ledStrip = useAtomValue(ledStripAtom);

  return <div className={styles.root}>
    {ledStrip.map((on, i) => <Led key={i} on={on} />)}
  </div>
}

export default React.memo(LedStrip);
