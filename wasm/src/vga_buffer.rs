use dtekv_emulator_core::{io, Data};
use web_sys::js_sys::Uint8Array;

pub const VGA_BUFFER_LOWER_ADDR: u32 = 0x08000000;
pub const VGA_BUFFER_HIGHER_ADDR: u32 = 0x80257ff;

pub struct VgaBuffer {
    pub buffer: Uint8Array,
}

impl VgaBuffer {
    /// Returns a new Memory object with a given size all set to 0
    pub fn new() -> Self {
        VgaBuffer {
            buffer: Uint8Array::new_with_length(320 * 240 * 3),
        }
    }

    pub fn to_color(&self, pixel: u8) -> (u8, u8, u8) {
        let red = pixel & 0b11100000;
        let green = pixel & 0b00011100;
        let blue = pixel & 0b00000011;

        ((red >> 5) * 32, (green >> 2) * 32, blue * 85)
    }

    pub fn get_pixel(&self, x: u32, y: u32) -> (u8, u8, u8) {
        let x = x;
        let y = y;
        let x = x * 3;
        let y = y * 320 * 3;
        let addr = x + y;
        let addr = addr;
        (
            self.buffer.get_index(addr),
            self.buffer.get_index(addr + 1),
            self.buffer.get_index(addr + 2),
        )
    }
}

impl io::Device<()> for VgaBuffer {
    fn addr_range(&self) -> (u32, u32) {
        (VGA_BUFFER_LOWER_ADDR, VGA_BUFFER_HIGHER_ADDR)
    }

    fn clock(&mut self) {}
}

impl io::Interruptable for VgaBuffer {
    fn interrupt(&self) -> Option<u32> {
        None
    }
}

impl Data<()> for VgaBuffer {
    fn load_byte(&self, _addr: u32) -> Result<u8, ()> {
        // Hard wired to 0
        Ok(0)
    }

    fn store_byte(&mut self, addr: u32, byte: u8) -> Result<(), ()> {
        let addr = addr - VGA_BUFFER_LOWER_ADDR;
        if addr >= self.buffer.length() as u32 {
            return Err(());
        }
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
