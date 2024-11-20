import { useEffect, useRef, useState } from "react";
import cx from "../../../../utils/cx";

import styles from "./Nav.module.css";
import { loadBinary, reset } from "../../../../cpu";

const examples = {
  primeCounter: fetch("/prime_counter.bin")
    .then((res) => res.arrayBuffer())
    .then((buf) => new Uint8Array(buf)),
  games: fetch("/games.bin")
    .then((res) => res.arrayBuffer())
    .then((buf) => new Uint8Array(buf)),
  bufferSwap: fetch("/buffer_swap.bin") 
    .then((res) => res.arrayBuffer())
    .then((buf) => new Uint8Array(buf)),
};

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
          <a
            onClick={async () => {
              setExampleButtonActive(false);
              loadBinary(await examples.primeCounter);
            }}
          >
            Prime counter
          </a>
          <a
            onClick={async () => {
              setExampleButtonActive(false);
              loadBinary(await examples.games);
            }}
          >
            Games
          </a>
          <a
            onClick={async () => {
              setExampleButtonActive(false);
              loadBinary(await examples.bufferSwap);
            }}
          >
            Buffer swap
          </a>
        </div>
      </div>
      {
        // <button className={styles.navButton}>Help</button>
      }
      <div className={styles.splitter} />
      <a
        className={cx(styles.navButton, styles.right)}
        href="https://github.com/PumpedSardines/dtekv-emulator-web"
        target="_blank"
      >
        GitHub
      </a>
    </>
  );
}

export default Nav;
