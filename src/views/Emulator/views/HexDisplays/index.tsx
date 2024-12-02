import { useAtomValue } from "jotai";
import HexDisplay from "../../../../components/HexDisplay";

import styles from "./HexDisplays.module.css";
import { hexDisplaysAtom } from "../../../../atoms";
import { useMemo } from "react";
import { selectAtom } from "jotai/utils";

function HexDisplays() {
  return (
    <div className={styles["hex-displays"]}>
      {new Array(6).fill(0).map((_, i) => (
        <ControlledHexDisplay key={i} index={5 - i} />
      ))}
    </div>
  );
}

type ControlledHexDisplayProps = {
  index: number;
};

function ControlledHexDisplay(props: ControlledHexDisplayProps) {
  const value = useAtomValue(
    useMemo(
      () => selectAtom(hexDisplaysAtom, (s) => s[props.index]),
      [props.index],
    ),
  );

  return <HexDisplay value={value} />;
}

export default HexDisplays;
