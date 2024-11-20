import * as ReactDOM from "react-dom/client";
import * as jotai from "jotai";

import "./global.css";
import Emulator from "./pages/Emulator";
import { store } from "./atoms";

import { startCpuLoop } from "./cpu";

const App = () => {
  return (
    <jotai.Provider store={store}>
      <Emulator />
    </jotai.Provider>
  );
};

startCpuLoop();
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);

