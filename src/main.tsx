import * as ReactDOM from "react-dom/client";

import "./global.css";
import "./fonts.css";

import { startCpuLoop } from "./cpu";
import App from "./App";

const test: any = 3;

startCpuLoop();
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
