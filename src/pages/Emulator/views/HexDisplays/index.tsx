import HexDisplay from "../../../../components/HexDisplay";
import { useCpuContext } from "../../../../contexts/CpuContext";

import styles from "./HexDisplays.module.css";

function HexDisplays() {
  const { hexDisplays } = useCpuContext();

  return (
    <div className={styles['hex-displays']}>
      {new Array(6).fill(0).map((_, i) => (
        <HexDisplay key={i} value={hexDisplays[5 - i]} />
      ))}
    </div>
  );
}

export default HexDisplays;
