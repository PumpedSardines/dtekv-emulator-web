import * as ReactDOM from "react-dom/client";

import "./global.css";
import "./fonts.css";

import { startCpuLoop } from "./cpu";
import App from "./App";


startCpuLoop();
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
