import React, { useEffect, useState } from "react";
import useWindowDimension from "./hooks/useWindowDimensions";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./consts";

import { store, viewAtom } from "./atoms";

import TooSmall from "./views/TooSmall";
import ShouldUpdate from "./views/ShouldUpdate";
import Emulator from "./views/Emulator";

import Dialog from "./partials/Dialog";
import * as jotai from "jotai";
import Settings from "./views/Settings";

function fetchVersion(): Promise<string> {
  return fetch("/version.txt").then((res) => res.text());
}

function App() {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const dimensions = useWindowDimension();
  const isTooSmall =
    dimensions.width < MIN_WINDOW_WIDTH ||
    dimensions.height < MIN_WINDOW_HEIGHT;

  useEffect(() => {
    updateVersion();

    function updateVersion() {
      fetchVersion().then((version) => {
        if (version !== __APP_VERSION__) {
          setShouldUpdate(true);
        }
      });
    }

    addEventListener("focus", updateVersion);
    return () => removeEventListener("focus", updateVersion);
  }, []);

  return (
    <jotai.Provider store={store}>
      <Dialog />
      {(() => {
        if (process.env.NODE_ENV !== "development" && shouldUpdate) {
          return <ShouldUpdate />;
        }

        if (isTooSmall) {
          return <TooSmall />;
        } else {
          return <View />;
        }
      })()}
    </jotai.Provider>
  );
}

function View() {
  const view = jotai.useAtomValue(viewAtom);

  switch (view) {
    case "emulator":
      return <Emulator />;
    case "settings":
      return <Settings />;
  }
}

export default React.memo(App);
