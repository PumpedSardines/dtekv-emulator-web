/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function init_panic_hook(): void;
export function __wbg_cpu_free(a: number, b: number): void;
export function cpu_new(): number;
export function cpu_set_to_new(a: number): void;
export function cpu_get_vga_frame_buffer(a: number): number;
export function cpu_get_pc(a: number): number;
export function cpu_get_switch(a: number, b: number): number;
export function cpu_set_switch(a: number, b: number, c: number): void;
export function cpu_get_hex_display(a: number, b: number): number;
export function cpu_set_button(a: number, b: number): void;
export function cpu_get_button(a: number): number;
export function cpu_load(a: number, b: number, c: number): void;
export function cpu_flush_uart(a: number, b: number): void;
export function cpu_reset(a: number): void;
export function cpu_handle_interrupt(a: number): void;
export function cpu_read_word(a: number, b: number): number;
export function cpu_clock(a: number, b: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
