import React from "react";

import ChevronIcon from "../../../assets/chevron.svg?react"

import styles from "./Select.module.css";

type SelectProps<T extends string> = {
  value: T;
  options: { value: string; label: string }[];
  onChange?: (value: T) => void;
};

function Select<T extends string>(props: SelectProps<T>) {
  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value as T)}
      >
        {props.options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <ChevronIcon />
    </div>
  );
}

export default React.memo(Select);
