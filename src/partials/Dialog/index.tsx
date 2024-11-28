import React, { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { dialogElementAtom } from "../../atoms";
import styles from "./Dialog.module.css";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useDialog from "../../hooks/useDialog";

function Dialog() {
  const element = useAtomValue(dialogElementAtom);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { close: closeDialog } = useDialog();

  useOnClickOutside([innerRef], () => {
    closeDialog();
  });

  useEffect(() => {
    if (element && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }

    if (!element && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [element]);

  return (
    <dialog className={styles.dialog} ref={dialogRef}>
      <div ref={innerRef} className={styles.inner}>
        {element}
      </div>
    </dialog>
  );
}

export default React.memo(Dialog);
