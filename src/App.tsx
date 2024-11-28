import React from "react";
import useWindowDimension from "./hooks/useWindowDimensions";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "./consts";

import Emulator from "./pages/Emulator";
import { store } from "./atoms";

import TooSmall from "./pages/TooSmall";
import Dialog from "./partials/Dialog";
import * as jotai from "jotai";

function App() {
  const dimensions = useWindowDimension();
  const isTooSmall =
    dimensions.width < MIN_WINDOW_WIDTH ||
    dimensions.height < MIN_WINDOW_HEIGHT;

  return (
    <jotai.Provider store={store}>
      <Dialog />
      {(() => {
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
