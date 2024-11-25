mod utils;

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
    internal_cpu: cpu::Cpu<cpu::Bus>,
    switch: Rc<RefCell<io::Switch>>,
    button: Rc<RefCell<io::Button>>,
    sdram: Rc<RefCell<io::SDRam>>,
    hex_display: Rc<RefCell<io::HexDisplay>>,
    uart: Rc<RefCell<io::Uart>>,
    vga_dma: Rc<RefCell<io::VgaDma>>,
    vga_buffer: Rc<RefCell<VgaBuffer>>,
    led_strip: Rc<RefCell<io::LEDStrip>>,
    timer: Rc<RefCell<Timer>>,
}

#[wasm_bindgen]
impl Cpu {
    pub fn new() -> Self {
        let mut bus = cpu::Bus::new();

        let switch = Rc::new(RefCell::new(io::Switch::new()));
        let button = Rc::new(RefCell::new(io::Button::new()));
        let sdram = Rc::new(RefCell::new(io::SDRam::new()));
        let hex_display = Rc::new(RefCell::new(io::HexDisplay::new()));
        let uart = Rc::new(RefCell::new(io::Uart::new()));
        let vga_dma = Rc::new(RefCell::new(io::VgaDma::new()));
        let vga_buffer = Rc::new(RefCell::new(VgaBuffer::new(vga_dma.clone())));
        let timer = Rc::new(RefCell::new(Timer::new()));
        let led_strip = Rc::new(RefCell::new(io::LEDStrip::new()));

        bus.attach_device(switch.clone());
        bus.attach_device(button.clone());
        bus.attach_device(sdram.clone());
        bus.attach_device(hex_display.clone());
        bus.attach_device(uart.clone());
        bus.attach_device(vga_dma.clone());
        bus.attach_device(vga_buffer.clone());
        bus.attach_device(timer.clone());
        bus.attach_device(led_strip.clone());

        let cpu = cpu::Cpu::new_with_bus(bus);

        Cpu {
            internal_cpu: cpu,
            switch,
            button,
            sdram,
            hex_display,
            uart,
            vga_dma,
            vga_buffer,
            timer,
            led_strip,
        }
    }

    // To prevent memory leaks, we only work within one Cpu object, we let Rust take care of
    // memory
    pub fn set_to_new(&mut self) {
        *self = Cpu::new();
    }

    pub fn get_vga_frame_buffer(&self) -> Uint8Array {
        let mut vga = self.vga_buffer.borrow_mut();
        vga.get()
    }

    pub fn did_vga_frame_buffer_update(&self) -> bool {
        let vga = self.vga_buffer.borrow();
        vga.should_update()
    }

    pub fn get_pc(&self) -> u32 {
        self.internal_cpu.pc
    }

    pub fn get_switch(&self, index: u32) -> bool {
        self.switch.borrow().get(index)
    }

    pub fn set_switch(&self, index: u32, value: bool) {
        self.switch.borrow_mut().set(index, value);
    }

    pub fn get_hex_display(&self, index: u32) -> u8 {
        self.hex_display.borrow().get(index)
    }

    pub fn get_led(&self, index: u32) -> bool {
        self.led_strip.borrow().get(index)
    }

    pub fn set_button(&self, value: bool) {
        self.button.borrow_mut().set(value);
    }

    pub fn get_button(&self) -> bool {
        self.button.borrow().get()
    }

    pub fn flush_uart(&mut self) -> String {
        let mut ret_str = String::new();
        let mut uart = self.uart.borrow_mut();

        while let Some(c) = uart.next() {
            ret_str.push(c);
        }

        ret_str
    }

    pub fn reset(&mut self) {
        self.internal_cpu.reset();
    }

    pub fn handle_interrupt(&mut self) {
        if let Some(cause) = self.internal_cpu.bus.interrupt() {
            self.internal_cpu.external_interrupt(cause);
        }
    }

    pub fn read_word(&self, addr: u32) -> u8 {
        let word = self.sdram.borrow().load_byte(addr).unwrap();
        word
    }

    pub fn clock(&mut self, cycles: u32) {
        for _ in 0..cycles {
            self.internal_cpu.clock();
        }
        self.internal_cpu.bus.clock();
    }

    pub fn store_at(&mut self, addr: u32, data: Vec<u8>) {
        let _ = self.internal_cpu.store_at(addr, data);
    }

    pub fn load_at(&self, addr: u32, length: usize) -> Result<Vec<u8>, JsError> {
        let data = self
            .internal_cpu
            .load_at(addr, length)
            .map_err(|_| JsError::new("Out of range"))?;
        Ok(data)
    }
}
