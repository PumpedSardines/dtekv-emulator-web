import React, { createContext, useCallback, useEffect, useRef } from "react";
import styles from "./RatioBox.module.css";

type RatioImageBoxProps = {
  width: number;
  height: number;
  children: React.ReactNode;
};

const RatioBoxContext = createContext<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

export function useRatioBox() {
  return React.useContext(RatioBoxContext);
}

function RatioImageBox(props: RatioImageBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const { width, height } = props;

  const updateImgSize = useCallback(() => {
    if (!ref.current) throw new Error("Unreachable");
    const { width: maxWidth, height: maxHeight } =
      ref.current.getBoundingClientRect();

    // Since the VGA display is exactly 320x240 and we don't want to render
    // any weird half pixels, we calculate exactly in steps the size needs to be
    // to fit the display.
    let currentWidth = width;
    let currentHeight = height;

    do {
      currentWidth += width;
      currentHeight += height;
    } while (currentWidth <= maxWidth && currentHeight <= maxHeight);
    currentWidth -= width;
    currentHeight -= height;
    setSize({ width: currentWidth, height: currentHeight });
  }, [width, height]);

  useEffect(() => {
    const { current } = ref;
    if (!current) throw new Error("Unreachable");
    const observer = new ResizeObserver(updateImgSize);
    observer.observe(current);
    updateImgSize();
    return () => observer.disconnect();
  }, [updateImgSize]);

  return (
    <div ref={ref} className={styles["outer"]}>
      <div
        className={styles["inner"]}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <RatioBoxContext.Provider value={size}>
          {props.children}
        </RatioBoxContext.Provider>
      </div>
    </div>
  );
}

export default RatioImageBox;
