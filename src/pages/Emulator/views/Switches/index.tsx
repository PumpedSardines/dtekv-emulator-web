import { useCallback, useMemo } from "react";
import Switch from "../../../../components/Switch";
import styles from "./Switches.module.css";
import React from "react";
import { switchesAtom } from "../../../../atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { Switches as TSwitches } from "../../../../types";
import { selectAtom } from "jotai/utils";

function Switches() {
  const setSwitches = useSetAtom(switchesAtom);

  const toggleIndex = useCallback(
    (index: number) => {
      setSwitches((switches) => {
        const newSwitches = switches.slice(0);
        newSwitches[index] = !newSwitches[index]!;
        return newSwitches as TSwitches;
      });
    },
    [setSwitches],
  );

  return (
    <div className={styles.switches}>
      {new Array(10).fill(0).map((_, i) => (
        <ControlledSwitch
          key={i}
          index={9 - i}
          onClick={toggleIndex}
        />
      ))}
      <Numbers />
    </div>
  );
}

type ControlledSwitchProps = {
  index: number;
  onClick: (index: number) => void;
};

function ControlledSwitch(props: ControlledSwitchProps) {
  const { index, onClick } = props;

  const on = useAtomValue(
    useMemo(() => selectAtom(switchesAtom, (s) => s[index]), [index]),
  );

  const onClickHandler = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return <Switch on={on} onClick={onClickHandler} />;
}

function Numbers() {
  const switches = useAtomValue(switchesAtom);

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

  return (
    <p>
      {values.hex.padStart(5, " ")}
      {"  "}
      {values.dec.padStart(4, " ")}
      {"  "}
      {values.signedDec.padStart(4, " ")}
    </p>
  );
}

export default React.memo(Switches);
