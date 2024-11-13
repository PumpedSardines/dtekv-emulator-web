mod utils;

use std::{cell::RefCell, rc::Rc};

use dtekv_emulator::{cpu, io, Data};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
struct Cpu {
    internal_cpu: cpu::Cpu<cpu::Bus>,
    switch: Rc<RefCell<io::Switch>>,
    button: Rc<RefCell<io::Button>>,
    sdram: Rc<RefCell<io::SDRam>>,
    hex_display: Rc<RefCell<io::HexDisplay>>,
    uart: Rc<RefCell<io::Uart>>,
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

        bus.attach_device(switch.clone());
        bus.attach_device(button.clone());
        bus.attach_device(sdram.clone());
        bus.attach_device(hex_display.clone());
        bus.attach_device(uart.clone());

        let cpu = cpu::Cpu::new_with_bus(bus);

        Cpu {
            internal_cpu: cpu,
            switch,
            button,
            sdram,
            hex_display,
            uart,
        }
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

    pub fn set_button(&self, value: bool) {
        self.button.borrow_mut().set(value);
    }

    pub fn load(&mut self, bin: Vec<u8>) {
        self.internal_cpu.bus.load_at(0, bin);
    }

    pub fn reset(&mut self) {
        self.internal_cpu.reset();
        self.internal_cpu.pc = 4;
    }

    pub fn handle_interrupt(&mut self) {
        let cause = self.internal_cpu.bus.should_interrupt();
        if let Some(cause) = cause {
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
    }
}
