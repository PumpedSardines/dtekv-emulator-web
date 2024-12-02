import React from "react";

import styles from "./Layout.module.css";
import useIsSafari from "../../hooks/useIsSafari";
import cx from "../../utils/cx";

type LayoutProps = {
  navbar: React.ReactNode;
  children: React.ReactNode;
};

function Layout(props: LayoutProps) {
  const isSafari = useIsSafari();

  return (
    <div className={styles.layout}>
      <nav className={cx(styles.navbar, isSafari && styles.safari)}>
        {props.navbar}
      </nav>
      <main className={styles.main}>{props.children}</main>
    </div>
  );
}

export default React.memo(Layout);
