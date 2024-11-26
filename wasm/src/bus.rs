use super::{Timer, VgaBuffer};
use dtekv_emulator_core::{
    io::{self},
    Data,
};
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
pub struct Bus {
    pub sdram: io::SDRam,
    pub button: io::Button,
    pub hex_display: io::HexDisplay,
    pub led_strip: io::LEDStrip,
    pub switch: io::Switch,
    pub timer: Timer,
    pub uart: io::Uart,
    pub vga_buffer: VgaBuffer,
    pub vga_dma: Rc<RefCell<io::VgaDma>>,
}

impl io::Device<()> for Bus {
    fn addr_range(&self) -> (u32, u32) {
        (0x0, 0xFFFF_FFFF)
    }

    fn clock(&mut self) {
        self.timer.clock();
        self.vga_buffer.clock();
    }
}

impl io::Interruptable for Bus {
    fn interrupt(&self) -> Option<u32> {
        if let Some(int) = self.timer.interrupt() {
            return Some(int);
        } else if let Some(int) = self.button.interrupt() {
            return Some(int);
        } else if let Some(int) = self.switch.interrupt() {
            return Some(int);
        }

        None
    }
}

macro_rules! data_func_on_all_devices {
    ($self:expr, $addr:expr, $func:ident, $($arg:expr),*) => {
        match $addr {
            io::SDRAM_LOWER_ADDR..=io::SDRAM_HIGHER_ADDR => $self.sdram.$func($($arg),*),
            io::BUTTON_LOWER_ADDR..=io::BUTTON_HIGHER_ADDR => $self.button.$func($($arg),*),
            io::HEX_DISPLAY_LOWER_ADDR..=io::HEX_DISPLAY_HIGHER_ADDR => {
                $self.hex_display.$func($($arg),*)
            }
            io::LED_STRIP_LOWER_ADDR..=io::LED_STRIP_HIGHER_ADDR => $self.led_strip.$func($($arg),*),
            io::SWITCH_LOWER_ADDR..=io::SWITCH_HIGHER_ADDR => $self.switch.$func($($arg),*),
            io::TIMER_LOWER_ADDR..=io::TIMER_HIGHER_ADDR => $self.timer.$func($($arg),*),
            io::UART_LOWER_ADDR..=io::UART_HIGHER_ADDR => $self.uart.$func($($arg),*),
            io::VGA_BUFFER_LOWER_ADDR..=io::VGA_BUFFER_HIGHER_ADDR => $self.vga_buffer.$func($($arg),*),
            io::VGA_DMA_LOWER_ADDR..=io::VGA_DMA_HIGHER_ADDR => $self.vga_dma.$func($($arg),*),
            _ => Err(()),
        }
    };
}

impl Data<()> for Bus {
    fn load_byte(&self, addr: u32) -> Result<u8, ()> {
        data_func_on_all_devices!(self, addr, load_byte, addr)
    }

    fn store_byte(&mut self, addr: u32, byte: u8) -> Result<(), ()> {
        data_func_on_all_devices!(self, addr, store_byte, addr, byte)
    }

    fn load_halfword(&self, addr: u32) -> Result<u16, ()> {
        data_func_on_all_devices!(self, addr, load_halfword, addr)
    }

    fn store_halfword(&mut self, addr: u32, halfword: u16) -> Result<(), ()> {
        data_func_on_all_devices!(self, addr, store_halfword, addr, halfword)
    }

    fn load_word(&self, addr: u32) -> Result<u32, ()> {
        data_func_on_all_devices!(self, addr, load_word, addr)
    }

    fn store_word(&mut self, addr: u32, word: u32) -> Result<(), ()> {
        data_func_on_all_devices!(self, addr, store_word, addr, word)
    }
}
