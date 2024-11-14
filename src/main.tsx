import * as ReactDOM from "react-dom/client";

import "./global.css";
import Emulator from "./pages/Emulator";
import { CpuContextProvider } from "./contexts/CpuContext";

const App = () => {
  return (
    <CpuContextProvider>
      <Emulator />
    </CpuContextProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
