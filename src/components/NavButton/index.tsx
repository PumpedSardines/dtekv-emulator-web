import React, { useRef, useState } from "react";

import styles from "./NavButton.module.css";
import cx from "../../utils/cx";
import useOnClickOutside from "../../hooks/useOnClickOutside";

type NavButtonProps = {
  href?: string;
  target?: string;
  disabled?: boolean;
  right?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

type NavDropDownProps = {
  label: string;
  buttons: (Omit<NavButtonProps, "right"> & { key: React.Key })[];
};

function NavButton(props: NavButtonProps | NavDropDownProps) {
  if ("buttons" in props) {
    return <DropDown {...props} />;
  }

  return <Button {...props} />;
}

const DropDown = React.memo(function DropDown(props: NavDropDownProps) {
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
        {props.label}
      </button>
      <div
        ref={dropDownRef}
        className={cx(styles.dropDown, open && styles.open)}
      >
        {props.buttons.map((props) => {
          return <Button {...props} key={props.key} onClick={() => {
              props.onClick?.();
              setOpen(false);
          }} />;
        })}
      </div>
    </div>
  );
});

const Button = React.memo(function Button(props: NavButtonProps) {
  if (props.href) {
    return (
      <a
        href={props.href}
        target={props.target}
        className={cx(styles.navButton, props.right && styles.right)}
        onClick={props.onClick}
      >
        {props.children}
      </a>
    );
  }

  return (
    <button
      className={cx(styles.navButton, props.right && styles.right)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
});

export default React.memo(NavButton);
