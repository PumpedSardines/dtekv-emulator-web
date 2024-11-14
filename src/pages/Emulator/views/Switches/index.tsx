import { useCallback, useMemo, useState } from "react";
import Switch from "../../../../components/Switch";
import styles from "./Switches.module.css";
import React from "react";
import { useCpuContext } from "../../../../contexts/CpuContext";

function Switches() {
  const { setSwitchState } = useCpuContext();
  const [switches, setSwitches] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const values = useMemo(() => {
    const value = switches.reduce((acc, sw, i) => {
      if (sw) {
        return acc | (1 << i);
      }
      return acc;
    }, 0);

    const signedValue = switches.reduce((acc, sw, i) => {
      if (sw) {
        if (i === 9) {
          return -(acc ^ 0x1ff) - 1;
        } else {
          return acc | (1 << i);
        }
      }
      return acc;
    }, 0);

    return {
      dec: value.toString(10),
      signedDec: signedValue.toString(10),
      hex: "0x" + value.toString(16),
    };
  }, [switches]);

  const toggleIndex = useCallback((index: number) => {
    setSwitches((switches) => {
      const newSwitches = switches.slice(0);
      newSwitches[index] = !newSwitches[index]!;
      setSwitchState(
        newSwitches as [
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
          boolean,
        ],
      );
      return newSwitches;
    });
  }, [setSwitchState]);

  const getOnClickHandler = useCallback(
    (index: number) => {
      return () => toggleIndex(index);
    },
    [toggleIndex],
  );

  return (
    <div className={styles.switches}>
      {new Array(10).fill(0).map((_, i) => (
        <Switch
          key={i}
          on={switches[9 - i]}
          onClick={getOnClickHandler(9 - i)}
        />
      ))}
      <p>
        {values.hex.padStart(5, " ")}
        {"  "}
        {values.dec.padStart(4, " ")}
        {"  "}
        {values.signedDec.padStart(4, " ")}
      </p>
    </div>
  );
}

export default React.memo(Switches);
