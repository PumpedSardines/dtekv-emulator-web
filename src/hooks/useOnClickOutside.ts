import { useEffect } from "react";

/**
 * A hook that provides a callback called when the user clicks outside the
 * provided elements.
 *
 * @param elements A list of refs to elements that are concidered "inside".
 * @param onClickOutside A callback when the user clicks "outside".
 */
function useOnClickOutside(
  elements: React.RefObject<HTMLElement>[],
  onClickOutside: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        elements.every(
          (element) => element.current && !element.current.contains(target),
        )
      ) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elements, onClickOutside]);
}

export default useOnClickOutside;
