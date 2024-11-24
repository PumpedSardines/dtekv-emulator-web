import { useRef, useState } from "react";
import cx from "../../../../utils/cx";

import styles from "./Nav.module.css";
import {
  softReset,
  loadBinary,
  loadDataAt,
  readDataAt,
  reload,
} from "../../../../cpu";
import { GITHUB_URL } from "../../../../consts";
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import NavDropDownButton from "./helpers/NavDropDownButton";
import { useAtomValue } from "jotai";
import { hasLoadedAtom } from "../../../../atoms";
import useDialog from "../../../../hooks/useDialog";
import UploadForm from "./helpers/UploadDownloadForms/UploadForm";
import DowloadForm from "./helpers/UploadDownloadForms/DowloadForm";

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
      <button onClick={reload} className={styles.navButton}>
        Reload
      </button>
      <ExampleButton />
      <AdvancedButton />
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

function ExampleButton() {
  return (
    <NavDropDownButton
      title="Load Example"
      buttons={examples.map(({ name, bin }) => ({
        title: name,
        onClick: async () => {
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
      title="Advanced features"
      buttons={[
        {
          title: "Soft reset",
          onClick: softReset,
        },
        {
          title: "Download",
          disabled: !hasLoaded,
          onClick: () => {
            openDialog(<DowloadForm />)
          },
        },
        {
          title: "Upload",
          disabled: !hasLoaded,
          onClick: () => {
            openDialog(<UploadForm />)
          },
        },
      ]}
    />
  );
}

function DownloadButton() {
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileNameInput = useRef<HTMLInputElement>(null);
  const addressInput = useRef<HTMLInputElement>(null);
  const lengthInput = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [fileName, setFileName] = useState("data.bin");
  const [address, setAddress] = useState("0x00000000");
  const [length, setLength] = useState(1024);

  useOnClickOutside([contentRef, buttonRef], () => setActive(false));

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        onClick={() => {
          setActive(!active);
        }}
        className={styles.navButton}
      >
        Download
      </button>
      <div
        ref={contentRef}
        className={cx(styles.popoutContainer, active && styles.active)}
      >
        <div>
          <label htmlFor="dtekv-download-filename" className={styles.formLabel}>
            Filename
          </label>
          <input
            ref={fileNameInput}
            id="dtekv-download-filename"
            className={styles.formInput}
            value={fileName}
            onInput={(e) => setFileName((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dtekv-download-addr" className={styles.formLabel}>
            Address
          </label>
          <input
            ref={addressInput}
            id="dtekv-download-addr"
            className={styles.formInput}
            value={address}
            onInput={(e) => setAddress((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dtekv-download-length" className={styles.formLabel}>
            Length
          </label>
          <input
            ref={lengthInput}
            id="dtekv-download-length"
            className={styles.formInput}
            type="number"
            min={0}
            required
            value={length || ""}
            onInput={(e) =>
              setLength(parseInt((e.target as HTMLInputElement).value))
            }
          />
        </div>
        <div>
          <button
            className={styles.formButton}
            onClick={async () => {
              const addr = parseAddress(address);
              if (!fileName) {
                showError(fileNameInput, "Please provide a file name.");
                return;
              }
              if (addr === null) {
                showError(addressInput, "Please provide an address.");
                return;
              }
              if (isNaN(length) || length <= 0) {
                showError(
                  lengthInput,
                  "Please provide an amount of bytes to download.",
                );
                return;
              }

              setActive(false);
              let data: Uint8Array;
              try {
                data = readDataAt(addr, length);
              } catch (e) {
                alert(e);
                return;
              }
              const blob = new Blob([data]);
              downloadBlob(blob, fileName);
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}

export default Nav;
