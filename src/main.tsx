import * as ReactDOM from "react-dom/client";
import * as jotai from "jotai";

import "./global.css";
import Emulator from "./pages/Emulator";
import { store } from "./atoms";

import { startCpuLoop } from "./cpu";
import useWindowDimension from "./hooks/useWindowDimensions";
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from "./consts";
import TooSmall from "./pages/TooSmall";

const App = () => {
  const dimensions = useWindowDimension();
  const isTooSmall =
    dimensions.width < MIN_WINDOW_WIDTH ||
    dimensions.height < MIN_WINDOW_HEIGHT;

  return (
    <jotai.Provider store={store}>
      {(() => {
        if (isTooSmall) {
          return <TooSmall />;
        } else {
          return <Emulator />;
        }
      })()}
    </jotai.Provider>
  );
};

startCpuLoop();
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
