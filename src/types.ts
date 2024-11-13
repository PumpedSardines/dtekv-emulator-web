type EmulatorState = {
  // If we need to fetch a new vga frame
  vgaHasUpdate: boolean;
  // All switch data
  switches: boolean[];
  // Hex Displays
  hexDisplays: number[];
  // Uart pipe
  uartPipe: string;
}
