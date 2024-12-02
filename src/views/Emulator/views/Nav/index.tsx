import styles from "./Nav.module.css";
import { hardReset, loadBinary, reload } from "../../../../cpu";
import { CHANGELOG_URL, GITHUB_URL } from "../../../../consts";
import { useAtomValue, useSetAtom } from "jotai";
import { hasLoadedAtom, viewAtom } from "../../../../atoms";
import useDialog from "../../../../hooks/useDialog";
import UploadForm from "./helpers/UploadDownloadForms/UploadForm";
import DowloadForm from "./helpers/UploadDownloadForms/DowloadForm";
import { useState } from "react";
import {
  FileHandle,
  getFileHandle,
  hasFileSystemApi,
} from "../../../../utils/fileSystem";
import NavButton from "../../../../components/NavButton";

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
    name: "Prime Counter",
    bin: () => getBinary("prime_counter"),
  },
  {
    id: "buffer_swap",
    name: "Buffer swap",
    bin: () => getBinary("buffer_swap"),
  },
  {
    id: "labb1-time4riscv",
    name: "Labb 1 - time4riscv",
    bin: () => getBinary("labb1-time4riscv"),
  },
  {
    id: "labb2-riscv32tests",
    name: "Labb 2 - riscv32tests",
    bin: () => getBinary("labb2-riscv32tests"),
  },
  {
    id: "labb3-time4timer",
    name: "Labb 3 - time4timer",
    bin: () => getBinary("labb3-time4timer"),
  },
  {
    id: "labb3-time4int",
    name: "Labb 3 - time4int",
    bin: () => getBinary("labb3-time4int"),
  },
];

function Nav() {
  const setView = useSetAtom(viewAtom);

  return (
    <>
      {hasFileSystemApi() ? <FileInputButton /> : <LegacyInputButton />}
      <ExampleButton />
      <AdvancedButton />
      <NavButton onClick={() => setView("settings")}>Settings</NavButton>
      <div className={styles.splitter} />
      <NavButton href={CHANGELOG_URL} target="_blank" right>
        v{__APP_VERSION__}
      </NavButton>
      <NavButton href={GITHUB_URL} target="_blank" right>
        GitHub
      </NavButton>
    </>
  );
}

// Uses input type="file" to load a binary file,
// Works on older browsers
function LegacyInputButton() {
  const hasLoaded = useAtomValue(hasLoadedAtom);

  return (
    <>
      <NavButton
        onClick={async () => {
          // Kinda hacky way, work with components instead of using an input element
          const fileElement = document.createElement("input");
          fileElement.type = "file";
          fileElement.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files![0];
            const bin = new Uint8Array(await file.arrayBuffer());
            loadBinary(bin);
          };
          fileElement.click();
        }}
      >
        Load File
      </NavButton>
      <NavButton disabled={!hasLoaded} onClick={reload}>
        Reload
      </NavButton>
    </>
  );
}

function FileInputButton() {
  const [fileHandle, setFileHandle] = useState<FileHandle | null>(null);
  const hasLoaded = useAtomValue(hasLoadedAtom);

  return (
    <>
      <NavButton
        onClick={async () => {
          const fileHandle = await getFileHandle();
          setFileHandle(fileHandle);
          const file = await fileHandle.getFile();
          const bin = new Uint8Array(await file.arrayBuffer());
          loadBinary(bin);
        }}
      >
        Load File
      </NavButton>
      <NavButton
        disabled={!hasLoaded || !fileHandle}
        onClick={async () => {
          if (!fileHandle || !hasLoaded) return;
          const file = await fileHandle.getFile();
          const bin = new Uint8Array(await file.arrayBuffer());
          loadBinary(bin);
        }}
      >
        Refresh File
      </NavButton>
    </>
  );
}

function ExampleButton() {
  return (
    <NavButton
      label="Example"
      buttons={examples.map(({ id, name, bin }) => ({
        key: id,
        children: name,
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
    <NavButton
      label="Advanced"
      buttons={[
        {
          key: 1,
          children: "Hard Reset",
          disabled: !hasLoaded,
          onClick: hardReset,
        },
        {
          key: 2,
          children: "Download Memory Section",
          disabled: !hasLoaded,
          onClick: () => {
            openDialog(<DowloadForm />);
          },
        },
        {
          key: 3,
          children: "Upload File to Memory",
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
