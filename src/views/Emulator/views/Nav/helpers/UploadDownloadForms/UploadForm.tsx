import React, { useRef, useState } from "react";
import styles from "./styles.module.css";
import cx from "../../../../../../utils/cx";
import { storeAt } from "../../../../../../cpu";
import { parseAddress } from "./utils";
import useDialog from "../../../../../../hooks/useDialog";

function UploadForm() {
  const addressRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [address, setAddress] = useState("0x00000000");
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
        const file = formData.get("file") as File;

        const data = new Uint8Array(await file.arrayBuffer());
        storeAt(address, data);
        dialog.close();
      }}
    >
      <h1>Data Upload</h1>
      <div>
        <label htmlFor="dtekv-upload-addr" className={styles.formLabel}>
          Address
        </label>
        <input
          id="dtekv-upload-addr"
          ref={addressRef}
          name="address"
          className={styles.formInput}
          value={address}
          onInput={(e) => {
            const addr = (e.target as HTMLInputElement).value;
            setAddress(addr);

            if (parseAddress(addr) === null) {
              addressRef.current!.setCustomValidity(
                "This needs to be a valid address",
              );
            } else {
              addressRef.current!.setCustomValidity("");
            }
          }}
          required
        />
      </div>
      <div>
        <label htmlFor="dtekv-upload-file" className={styles.formLabel}>
          Content
        </label>
        <input
          id="dtekv-upload-file"
          type="file"
          name="file"
          className={styles.formInput}
          required
        />
      </div>
      <div>
        <button type="submit" className={styles.formButton}>
          Upload
        </button>
      </div>
    </form>
  );
}

export default React.memo(UploadForm);
