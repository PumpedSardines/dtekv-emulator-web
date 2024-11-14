import { useState, useEffect } from "react";

function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsSafari(ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1);
  }, []);

  return isSafari;
}

export default useIsSafari;
