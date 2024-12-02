import React from "react";
import Layout from "../../partials/Layout";
import Nav from "./views/Nav";

import styles from "./Settings.module.css";
import Box from "./views/Box";
import Select from "../../components/ui/Select";
import { useAtom } from "jotai";
import { settingsButtonBehaviorAtom } from "../../atoms";
import type { ButtonBehavior } from "../../types";

function Settings() {
  return (
    <Layout navbar={<Nav />}>
      <div className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Settings</h1>
          <ButtonBehavior />
        </div>
      </div>
    </Layout>
  );
}

function ButtonBehavior() {
  const [buttonBehavior, setButtonBehavior] = useAtom(
    settingsButtonBehaviorAtom,
  );

  return (
    <Box
      title="Button Behavior"
      description="Change how the button works, in toggled mode you switch the button state by clicking the button, in momentary mode the button state is only active while the button is pressed."
    >
      <Select
        value={buttonBehavior}
        onChange={(value) => setButtonBehavior(value as ButtonBehavior)}
        options={[
          { value: "momentary", label: "Momentary" },
          { value: "toggle", label: "Toggle" },
        ]}
      />
    </Box>
  );
}

export default React.memo(Settings);
