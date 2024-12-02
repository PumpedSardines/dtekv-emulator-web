import React, { useEffect, useState } from "react";
import useWindowDimension from "./hooks/useWindowDimensions";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./consts";

import Emulator from "./pages/Emulator";
import { store } from "./atoms";

import TooSmall from "./pages/TooSmall";
import Dialog from "./partials/Dialog";
import * as jotai from "jotai";
import ShouldUpdate from "./pages/ShouldUpdate";

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
          return <Emulator />;
        }
      })()}
    </jotai.Provider>
  );
}

export default React.memo(App);
