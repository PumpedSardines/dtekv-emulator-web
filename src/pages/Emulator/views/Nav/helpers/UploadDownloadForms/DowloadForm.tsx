import React, { useRef  } from "react";
import styles from "./styles.module.css";
import cx from "../../../../../../utils/cx";
import { loadAt } from "../../../../../../cpu";
import { downloadBlob, parseAddress } from "./utils";
import useDialog from "../../../../../../hooks/useDialog";

function DownloadForm() {
  const addressRef = useRef<HTMLInputElement>(null);
  const lengthRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dialog = useDialog();

  return (
    <form
      className={cx(styles.cont)}
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current!);

        const addressRaw = formData.get("address") as string;
        const address = parseAddress(addressRaw);
        if (address === null) {
          throw new Error(
            "Shouldn't happen due to setCustomValidity in address input",
          );
        }
        const lengthRaw = formData.get("length") as string;
        const length = parseAddress(lengthRaw);
        if (length === null) {
          throw new Error(
            "Shouldn't happen due to setCustomValidity in length input",
          );
        }
        const filename = formData.get("filename") as string;

        const blob = new Blob([loadAt(address, length)]);
        downloadBlob(blob, filename);
        dialog.close();
      }}
    >
      <h1>Data Download</h1>
      <div>
        <label htmlFor="dtekv-dowload-filename" className={styles.formLabel}>
          Filename
        </label>
        <input
          id="dtekv-dowload-filename"
          defaultValue="data.bin"
          name="filename"
          className={styles.formInput}
          required
        />
      </div>
      <div>
        <label htmlFor="dtekv-dowload-addr" className={styles.formLabel}>
          Address
        </label>
        <input
          id="dtekv-dowload-addr"
          ref={addressRef}
          name="address"
          defaultValue="0x0"
          className={styles.formInput}
          onInput={(e) => {
            const addr = (e.target as HTMLInputElement).value;
            if (parseAddress(addr) === null) {
              addressRef.current!.setCustomValidity("Enter a valid number");
            } else {
              addressRef.current!.setCustomValidity("");
            }
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="dtekv-dowload-length" className={styles.formLabel}>
          Length
        </label>
        <input
          id="dtekv-dowload-length"
          ref={lengthRef}
          name="length"
          defaultValue="0x0"
          className={styles.formInput}
          onInput={(e) => {
            const addr = (e.target as HTMLInputElement).value;
            if (parseAddress(addr) === null) {
              lengthRef.current!.setCustomValidity("Enter a valid number");
            } else {
              lengthRef.current!.setCustomValidity("");
            }
          }}
          required
        />
      </div>
      <div>
        <button type="submit" className={styles.formButton}>
          Download
        </button>
      </div>
    </form>
  );
}

export default React.memo(DownloadForm);
