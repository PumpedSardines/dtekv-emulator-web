import React from "react";
import NavButton from "../../../../components/NavButton";
import { useSetAtom } from "jotai";
import { viewAtom } from "../../../../atoms";

function Nav() {
  const setView = useSetAtom(viewAtom);

  return <>
    <NavButton onClick={() => setView("emulator")}>Back to Emulator</NavButton>
  </>
}

export default React.memo(Nav);
