import * as ReactDOM from "react-dom/client";

import './global.scss';
import Emulator from "./pages/Emulator";


const App = () => {
  return (
    <Emulator />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
