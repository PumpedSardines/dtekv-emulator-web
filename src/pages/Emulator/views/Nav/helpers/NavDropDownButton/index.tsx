import React, { useRef, useState } from "react";

import styles from "./NavDropDownButton.module.css";
import useOnClickOutside from "../../../../../../hooks/useOnClickOutside";
import cx from "../../../../../../utils/cx";

type NavDropDownButtonProps = {
  title: string;
  buttons: {
    title: string;
    disabled?: boolean;
    onClick: () => void;
  }[];
};

function NavDropDownButton(props: NavDropDownButtonProps) {
  const [open, setOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside([dropDownRef, buttonRef], () => setOpen(false));

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        onClick={() => {
          setOpen(!open);
        }}
        className={styles.navButton}
      >
        {props.title}
      </button>
      <div
        ref={dropDownRef}
        className={cx(styles.dropDown, open && styles.open)}
      >
        {props.buttons.map(({ title, disabled, onClick }) => {
          return (
            <button
              disabled={disabled}
              key={title}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
            >
              {title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(NavDropDownButton);
