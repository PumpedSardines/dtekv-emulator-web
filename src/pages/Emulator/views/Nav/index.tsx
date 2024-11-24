import cx from "../../../../utils/cx";

import styles from "./Nav.module.css";
import { hardReset, loadBinary, reload } from "../../../../cpu";
import { CHANGELOG_URL, GITHUB_URL } from "../../../../consts";
import NavDropDownButton from "./helpers/NavDropDownButton";
import { useAtomValue } from "jotai";
import { hasLoadedAtom } from "../../../../atoms";
import useDialog from "../../../../hooks/useDialog";
import UploadForm from "./helpers/UploadDownloadForms/UploadForm";
import DowloadForm from "./helpers/UploadDownloadForms/DowloadForm";
import { useRef } from "react";

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
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <label className={styles.navButton} htmlFor="load-nav-button">
        Load Binary
        <input
          style={{ display: "none" }}
          ref={fileRef}
          id="load-nav-button"
          type="file"
          onChange={async (e) => {
            const file = e.currentTarget.files![0];
            const bin = new Uint8Array(await file.arrayBuffer());
            loadBinary(bin);
            fileRef.current!.value = "";
          }}
        />
      </label>
      <ReloadButton />
      <ExampleButton />
      <AdvancedButton />
      <div className={styles.splitter} />
      <a
        className={cx(styles.navButton, styles.right)}
        href={CHANGELOG_URL}
        target="_blank"
      >
        v{__APP_VERSION__}
      </a>
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

function ReloadButton() {
  const hasLoaded = useAtomValue(hasLoadedAtom);

  return (
    <button onClick={reload} disabled={!hasLoaded} className={styles.navButton}>
      Reload
    </button>
  );
}

function ExampleButton() {
  return (
    <NavDropDownButton
      title="Load Example"
      buttons={examples.map(({ name, bin }) => ({
        title: name,
        onClick: async () => {
          hardReset();
          loadBinary(await bin);
        },
      }))}
    />
  );
}

function AdvancedButton() {
  const hasLoaded = useAtomValue(hasLoadedAtom);
  const { open: openDialog } = useDialog();

  return (
    <NavDropDownButton
      title="Advanced"
      buttons={[
        {
          title: "Hard reset",
          disabled: !hasLoaded,
          onClick: hardReset,
        },
        {
          title: "Download",
          disabled: !hasLoaded,
          onClick: () => {
            openDialog(<DowloadForm />);
          },
        },
        {
          title: "Upload",
          disabled: !hasLoaded,
          onClick: () => {
            openDialog(<UploadForm />);
          },
        },
      ]}
    />
  );
}

export default Nav;
