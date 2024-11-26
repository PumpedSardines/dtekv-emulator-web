use std::{cell::RefCell, rc::Rc};

use dtekv_emulator_core::{
    cpu,
    io::{self, Device, Interruptable},
    Data,
};
use wasm_bindgen::prelude::*;
mod vga_buffer;
use vga_buffer::VgaBuffer;
mod timer;
use timer::Timer;
use web_sys::js_sys::Uint8Array;
mod bus;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[allow(dead_code)]
struct Cpu {
    cpu: cpu::Cpu<bus::Bus>,
}

#[wasm_bindgen]
impl Cpu {
    pub fn new() -> Self {
        let vga_dma = Rc::new(RefCell::new(io::VgaDma::new()));

        let bus = bus::Bus {
            switch: io::Switch::new(),
            button: io::Button::new(),
            sdram: io::SDRam::new(),
            hex_display: io::HexDisplay::new(),
            uart: io::Uart::new(),
            vga_dma: vga_dma.clone(),
            vga_buffer: VgaBuffer::new(vga_dma.clone()),
            timer: Timer::new(),
            led_strip: io::LEDStrip::new(),
        };

        let cpu = cpu::Cpu::new_with_bus(bus);

        Cpu { cpu }
    }

    // To prevent memory leaks, we only work within one Cpu object, we let Rust take care of
    // memory
    pub fn set_to_new(&mut self) {
        *self = Cpu::new();
    }

    pub fn get_vga_frame_buffer(&mut self) -> Uint8Array {
        self.cpu.bus.vga_buffer.get()
    }

    pub fn did_vga_frame_buffer_update(&self) -> bool {
        self.cpu.bus.vga_buffer.should_update()
    }

    pub fn get_pc(&self) -> u32 {
        self.cpu.pc
    }

    pub fn get_switch(&self, index: u32) -> bool {
        self.cpu.bus.switch.get(index)
    }

    pub fn set_switch(&mut self, index: u32, value: bool) {
        self.cpu.bus.switch.set(index, value);
    }

    pub fn get_hex_display(&self, index: u32) -> u8 {
        self.cpu.bus.hex_display.get(index)
    }

    pub fn get_led(&self, index: u32) -> bool {
        self.cpu.bus.led_strip.get(index)
    }

    pub fn set_button(&mut self, value: bool) {
        self.cpu.bus.button.set(value);
    }

    pub fn get_button(&self) -> bool {
        self.cpu.bus.button.get()
    }

    pub fn flush_uart(&mut self) -> String {
        let mut ret_str = String::new();

        while let Some(c) = self.cpu.bus.uart.next() {
            ret_str.push(c);
        }

        ret_str
    }

    pub fn reset(&mut self) {
        self.cpu.reset();
    }

    pub fn handle_interrupt(&mut self) {
        if let Some(cause) = self.cpu.bus.interrupt() {
            self.cpu.external_interrupt(cause);
        }
    }

    pub fn clock(&mut self, cycles: u32) {
        for _ in 0..cycles {
            self.cpu.clock();
        }
        self.cpu.bus.clock();
    }

    pub fn store_at(&mut self, addr: u32, data: Vec<u8>) {
        let _ = self.cpu.store_at(addr, data);
    }

    pub fn load_at(&self, addr: u32, length: usize) -> Result<Vec<u8>, JsError> {
        let data = self
            .cpu
            .load_at(addr, length)
            .map_err(|_| JsError::new("Out of range"))?;
        Ok(data)
    }
}
