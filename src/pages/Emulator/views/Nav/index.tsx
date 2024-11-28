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

const binaries = new Map<string, Uint8Array>();

async function getBinary(path: string, hash?: string) {
  const finalPath = hash ? `${path}.${hash}.bin` : `${path}.bin`;
  if (binaries.has(finalPath)) return binaries.get(finalPath)!;
  const res = await fetch(finalPath);
  const buf = new Uint8Array(await res.arrayBuffer());
  binaries.set(finalPath, buf);
  return buf;
}

const examples = [
  {
    id: "games",
    name: "Games",
    bin: () => getBinary("games"),
  },
  {
    id: "bad-apple",
    name: "Bad Apple",
    bin: () => getBinary("bad_apple", "433379"),
  },
  {
    id: "prime_counter",
    name: "Prime counter",
    bin: () => getBinary("prime_counter"),
  },
  {
    id: "buffer_swap",
    name: "Buffer swap",
    bin: () => getBinary("buffer_swap"),
  },
  {
    id: "labb1-time4riscv",
    name: "time4riscv",
    bin: () => getBinary("labb1-time4riscv"),
  },
  {
    id: "labb2-riscv32tests",
    name: "riscv32tests",
    bin: () => getBinary("labb2-riscv32tests"),
  },
  {
    id: "labb3-time4timer",
    name: "time4timer",
    bin: () => getBinary("labb3-time4timer"),
  },
  {
    id: "labb3-time4int",
    name: "time4int",
    bin: () => getBinary("labb3-time4int"),
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
      <HardResetButton />
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

function HardResetButton() {
  const hasLoaded = useAtomValue(hasLoadedAtom);

  return (
    <button
      onClick={hardReset}
      disabled={!hasLoaded}
      className={styles.navButton}
    >
      Hard Reset
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
          const binData = await bin()
          hardReset();
          loadBinary(binData);
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
          title: "Reload",
          disabled: !hasLoaded,
          onClick: reload,
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
