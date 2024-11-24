import { useSetAtom } from 'jotai';
import { dialogElementAtom } from '../atoms';

function useDialog() {
  const setDialogElement = useSetAtom(dialogElementAtom)

  return {
    open: (node: React.ReactNode) => setDialogElement(node),
    close: () => setDialogElement(null)
  } 
}

export default useDialog;
