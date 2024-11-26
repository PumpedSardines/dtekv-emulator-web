use std::{cell::RefCell, rc::Rc};

use dtekv_emulator_core::{io, Data};
use web_sys::js_sys::Uint8Array;

pub struct VgaBuffer {
    pub buffer: Uint8Array,
    pub last_buffer_index: u32,
    pub dma: Rc<RefCell<io::VgaDma>>,
}

impl VgaBuffer {
    /// Returns a new Memory object with a given size all set to 0
    pub fn new(dma: Rc<RefCell<io::VgaDma>>) -> Self {
        VgaBuffer {
            // One for each color channel
            // Framebuffer
            // Backbuffer
            // Extra space
            buffer: Uint8Array::new_with_length(320 * 240 * 3 * 3),
            last_buffer_index: io::VGA_BUFFER_LOWER_ADDR,
            dma,
        }
    }

    pub fn get(&mut self) -> Uint8Array {
        let buffer = match self.dma.borrow().get_buffer() {
            // If less than 0x8000000, it's the first buffer
            buffer if buffer < io::VGA_BUFFER_LOWER_ADDR => io::VGA_BUFFER_LOWER_ADDR,
            buffer if buffer > io::VGA_BUFFER_HIGHER_ADDR => io::VGA_BUFFER_HIGHER_ADDR,
            buffer => buffer,
        };

        self.last_buffer_index = buffer;

        let start = (buffer - io::VGA_BUFFER_LOWER_ADDR) * 3;
        let end = start + 320 * 240 * 3;

        self.buffer.subarray(start, end)
    }

    pub fn should_update(&self) -> bool {
        self.dma.borrow().get_buffer() != self.last_buffer_index
    }

    pub fn to_color(&self, pixel: u8) -> (u8, u8, u8) {
        let red = pixel & 0b11100000;
        let green = pixel & 0b00011100;
        let blue = pixel & 0b00000011;

        ((red >> 5) * 32, (green >> 2) * 32, blue * 85)
    }
}

impl io::Device<()> for VgaBuffer {
    fn addr_range(&self) -> (u32, u32) {
        (io::VGA_BUFFER_LOWER_ADDR, io::VGA_BUFFER_HIGHER_ADDR)
    }
}

impl io::Interruptable for VgaBuffer {
    fn interrupt(&self) -> Option<u32> {
        None
    }
}

impl Data<()> for VgaBuffer {
    fn load_byte(&self, addr: u32) -> Result<u8, ()> {
        let addr = addr - io::VGA_BUFFER_LOWER_ADDR;
        let addr = addr * 3;
        let red = self.buffer.get_index(addr);
        let green = self.buffer.get_index(addr + 1);
        let blue = self.buffer.get_index(addr + 2);
        let color = (red / 32) << 5 | (green / 32) << 2 | (blue / 85);
        Ok(color)
    }

    fn store_byte(&mut self, addr: u32, byte: u8) -> Result<(), ()> {
        let addr = addr - io::VGA_BUFFER_LOWER_ADDR;
        let addr = addr * 3;
        let (red, green, blue) = self.to_color(byte);
        self.buffer.set_index(addr, red);
        self.buffer.set_index(addr + 1, green);
        self.buffer.set_index(addr + 2, blue);
        Ok(())
    }
}

impl std::fmt::Debug for VgaBuffer {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Vga {{ ... }}")
    }
}
