export type FileHandle = {
  getFile: () => Promise<File>;
};

declare global {
  interface Window {
    showOpenFilePicker?: () => Promise<FileHandle[]>;
  }
}

export function hasFileSystemApi(): boolean {
  return 'showOpenFilePicker' in window;
}

export async function getFileHandle(): Promise<FileHandle> {
  if (!hasFileSystemApi()) {
    throw new Error('File System API is not supported in this browser');
  }

  const [handle] = await window.showOpenFilePicker!();
  return handle;
}
