import { useEffect, useRef, useState } from "react";
import cx from "../../../../utils/cx";

import styles from "./Nav.module.css";
import { loadBinary, reset } from "../../../../cpu";
import { GITHUB_URL } from "../../../../consts";

const examples = [
  {
    id: "prime_counter",
    name: "Prime counter",
    bin: fetch("/prime_counter.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "games",
    name: "Games",
    bin: fetch("/games.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "buffer_swap",
    name: "Buffer swap",
    bin: fetch("/buffer_swap.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "labb1-time4riscv",
    name: "time4riscv",
    bin: fetch("/labb1-time4riscv.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "labb2-riscv32tests",
    name: "riscv32tests",
    bin: fetch("/labb2-riscv32tests.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "labb3-time4timer",
    name: "time4timer",
    bin: fetch("/labb3-time4timer.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
  {
    id: "labb3-time4int",
    name: "time4int",
    bin: fetch("/labb3-time4int.bin")
      .then((res) => res.arrayBuffer())
      .then((buf) => new Uint8Array(buf)),
  },
];

function Nav() {
  const [exampleButtonActive, setExampleButtonActive] = useState(false);
  const exampleRef = useRef<HTMLDivElement>(null);
  const exampleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exampleRef.current &&
        exampleButtonRef.current &&
        !exampleRef.current.contains(event.target as Node) &&
        !exampleButtonRef.current.contains(event.target as Node)
      ) {
        setExampleButtonActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exampleRef]);

  return (
    <>
      <label className={styles.navButton} htmlFor="load-nav-button">
        Load Binary
        <input
          style={{ display: "none" }}
          id="load-nav-button"
          type="file"
          onChange={async (e) => {
            const file = e.currentTarget.files![0];
            const bin = new Uint8Array(await file.arrayBuffer());
            loadBinary(bin);
          }}
        />
      </label>
      <button onClick={reset} className={styles.navButton}>
        Reset
      </button>
      <div className={styles.wrapper}>
        <button
          ref={exampleButtonRef}
          onClick={() => {
            setExampleButtonActive(!exampleButtonActive);
          }}
          className={styles.navButton}
        >
          Load Example
        </button>
        <div
          ref={exampleRef}
          className={cx(styles.example, exampleButtonActive && styles.active)}
        >
          {examples.map(({ id, name, bin }) => {
            return (
              <a
                key={id}
                onClick={async () => {
                  setExampleButtonActive(false);
                  loadBinary(await bin);
                }}
              >
                {name}
              </a>
            );
          })}
        </div>
      </div>
      <div className={styles.splitter} />
      <a
        className={cx(styles.navButton, styles.right)}
        href={GITHUB_URL}
        target="_blank"
      >
        GitHub
      </a>
    </>
  );
}

export default Nav;
