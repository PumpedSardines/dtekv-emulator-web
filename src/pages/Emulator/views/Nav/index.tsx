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
import { useRef, useState } from "react";
import { FileHandle, getFileHandle, hasFileSystemApi } from "../../../../utils/fileSystem";

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
  return (
    <>
      {hasFileSystemApi() ? <FileInputButton /> : <LegacyInputButton />}
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

// Uses input type="file" to load a binary file,
// Works on older browsers
function LegacyInputButton() {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
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
  );
}

function FileInputButton() {
  const [fileHandle, setFileHandle] = useState<FileHandle | null>(null);
  const hasLoaded = useAtomValue(hasLoadedAtom);

  return (
    <>
      <button
        className={styles.navButton}
        onClick={async () => {
          const fileHandle = await getFileHandle();
          setFileHandle(fileHandle);
          console.log(fileHandle);
          const file = await fileHandle.getFile();
          const bin = new Uint8Array(await file.arrayBuffer());
          loadBinary(bin);
        }}
      >
        Load File
      </button>
      <button
        className={styles.navButton}
        disabled={!hasLoaded || !fileHandle}
        onClick={async () => {
          if (!fileHandle || !hasLoaded) return;
          const file = await fileHandle.getFile();
          const bin = new Uint8Array(await file.arrayBuffer());
          loadBinary(bin);
        }}
      >
        Refresh File
      </button>
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
          const binData = await bin();
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
          title: "Hard Reset",
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
