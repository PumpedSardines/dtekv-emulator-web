import React, { useCallback, useEffect, useRef } from "react";
import styles from "./RatioImageBox.module.scss";

type RatioImageBoxProps = {
  width: number;
  height: number;
  src: string;
};

function RatioImageBox(props: RatioImageBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = React.useState({ width: 0, height: 0 });
  const { width, height } = props;

  const updateImgSize = useCallback(() => {
    if (!ref.current) throw new Error("Unreachable");
    const { width: maxWidth, height: maxHeight } =
      ref.current.getBoundingClientRect();

    // Since the VGA display is exactly 320x240 and we don't want to render
    // any weird half pixels, we calculate exactly in steps the size needs to be
    // to fit the display.
    let currentWidth = width / window.devicePixelRatio;
    let currentHeight = height / window.devicePixelRatio;

    do {
      currentWidth += width;
      currentHeight += height;
    } while (currentWidth <= maxWidth && currentHeight <= maxHeight);
    currentWidth -= width;
    currentHeight -= height;
    setImgSize({ width: currentWidth, height: currentHeight });
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
      <img
        style={{ width: `${imgSize.width}px`, height: `${imgSize.height}px` }}
        className={styles["inner"]}
        src={props.src}
        width={props.width}
        height={props.height}
      />
    </div>
  );
}

export default RatioImageBox;
