/* tslint:disable */
/* eslint-disable */
export function init_panic_hook(): void;
export class Cpu {
  free(): void;
  /**
   * @returns {Cpu}
   */
  static new(): Cpu;
  set_to_new(): void;
  /**
   * @returns {Uint8Array}
   */
  get_vga_frame_buffer(): Uint8Array;
  /**
   * @returns {number}
   */
  get_pc(): number;
  /**
   * @param {number} index
   * @returns {boolean}
   */
  get_switch(index: number): boolean;
  /**
   * @param {number} index
   * @param {boolean} value
   */
  set_switch(index: number, value: boolean): void;
  /**
   * @param {number} index
   * @returns {number}
   */
  get_hex_display(index: number): number;
  /**
   * @param {boolean} value
   */
  set_button(value: boolean): void;
  /**
   * @returns {boolean}
   */
  get_button(): boolean;
  /**
   * @param {Uint8Array} bin
   */
  load(bin: Uint8Array): void;
  /**
   * @returns {string}
   */
  flush_uart(): string;
  reset(): void;
  handle_interrupt(): void;
  /**
   * @param {number} addr
   * @returns {number}
   */
  read_word(addr: number): number;
  /**
   * @param {number} cycles
   */
  clock(cycles: number): void;
}
