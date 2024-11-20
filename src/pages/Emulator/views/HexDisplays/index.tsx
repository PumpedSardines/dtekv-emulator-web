import { useAtomValue } from "jotai";
import HexDisplay from "../../../../components/HexDisplay";

import styles from "./HexDisplays.module.css";
import { hexDisplaysAtom } from "../../../../atoms";

function HexDisplays() {
  const hexDisplays = useAtomValue(hexDisplaysAtom);

  return (
    <div className={styles['hex-displays']}>
      {new Array(6).fill(0).map((_, i) => (
        <HexDisplay key={i} value={hexDisplays[5 - i]} />
      ))}
    </div>
  );
}

export default HexDisplays;
