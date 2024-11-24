export function parseAddress(str: string): number | null {
  const [addrString, hex] = str.startsWith("0x")
    ? [str.substring(2), true]
    : [str, false];

  if (hex) {
    if (!/^[0-9a-fA-F]+$/.test(addrString)) {
      return null;
    }
  } else {
    if (!/^\d+$/.test(addrString)) {
      return null;
    }
  }

  const addr = hex
    ? parseInt(addrString, 16)
    : parseInt(addrString);

  if (isNaN(addr) || addr < 0) {
    return null;
  }
  return addr;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}
