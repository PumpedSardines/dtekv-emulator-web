use dtekv_emulator_core::{cpu, exception, io, Data};

pub const TIMER_LOWER_ADDR: u32 = 0x4000020;
pub const TIMER_HIGHER_ADDR: u32 = 0x400003f;

#[derive(Clone)]
pub struct Timer {
    period: u32,
    running: bool,
    time_out: bool,
    cont: bool,
    irq: bool,
    period_duration: u64,
    clock_start: web_sys::js_sys::Date,
}

impl Default for Timer {
    fn default() -> Self {
        Self::new()
    }
}

impl Timer {
    /// Returns a new Memory object with a given size all set to 0
    pub fn new() -> Self {
        Timer {
            period: 0,
            running: false,
            time_out: true,
            cont: false,
            irq: false,
            period_duration: 0,
            clock_start: web_sys::js_sys::Date::new_0(),
        }
    }

    fn set_part_period(&mut self, i: u32, byte: u8) {
        match i {
            0 => self.period = (self.period & 0xFFFF_FF00) | ((byte as u32) << 0),
            1 => self.period = (self.period & 0xFFFF_00FF) | ((byte as u32) << 8),
            2 => self.period = (self.period & 0xFF00_FFFF) | ((byte as u32) << 16),
            3 => self.period = (self.period & 0x00FF_FFFF) | ((byte as u32) << 24),
            _ => unreachable!(),
        }

        // Calculate the period duration in milliseconds
        self.period_duration = ((self.period as u64) * 1_000) / cpu::CLOCK_FEQ as u64;
    }

    pub fn should_interrupt(&self) -> bool {
        self.time_out && self.irq
    }
}

impl io::Device<()> for Timer {
    fn addr_range(&self) -> (u32, u32) {
        (TIMER_LOWER_ADDR, TIMER_HIGHER_ADDR)
    }

    fn clock(&mut self) {
        if self.running {
            let elapsed = web_sys::js_sys::Date::new_0().get_time() as u64
                - self.clock_start.get_time() as u64;
            if elapsed >= self.period_duration {
                self.time_out = true;
                self.clock_start = web_sys::js_sys::Date::new_0();
            }
        }
    }

}

impl io::Interruptable for Timer {
    fn interrupt(&self) -> Option<u32> {
        if self.should_interrupt() {
            Some(exception::TIMER_INTERRUPT)
        } else {
            None
        }
    }
}

impl Data<()> for Timer {
    fn load_byte(&self, addr: u32) -> Result<u8, ()> {
        let addr = addr - TIMER_LOWER_ADDR;
        let part = addr / 4;
        let i = addr % 4;

        Ok(match part {
            0 => {
                if i == 0 {
                    let mut res: u8 = 0;

                    if self.time_out {
                        res |= 1 << 0
                    }

                    if self.running {
                        res |= 1 << 1
                    }

                    res
                } else {
                    0
                }
            }
            1 => {
                if i == 0 {
                    let mut res: u8 = 0;

                    if self.irq {
                        res |= 1 << 0
                    }

                    if self.cont {
                        res |= 1 << 1
                    }

                    res
                } else {
                    0
                }
            }
            _ => 0,
        })
    }

    fn store_byte(&mut self, addr: u32, byte: u8) -> Result<(), ()> {
        let addr = addr - TIMER_LOWER_ADDR;
        let part = addr / 4;
        let i = addr % 4;

        match part {
            0 => {
                if i == 0 {
                    let old_time_out = self.time_out;
                    self.time_out = byte & 1 == 1;

                    if old_time_out && !self.time_out {
                        // self.clock_start = Instant::now();
                    }
                }
            } // Data address, can store here
            1 => {
                if i == 0 {
                    self.irq = byte & 1 != 0;
                    self.cont = byte & 2 != 0;
                    let start = byte & 4 != 0;
                    let stop = byte & 8 != 0;

                    if start && stop {
                        unimplemented!("Sending start and stop signal is not supported");
                    }

                    if start {
                        self.running = true;
                    } else if stop {
                        self.running = false;
                    }
                }
            } // Direction address, can store here, but changes nothing
            2 => {
                // Lower 16 bits of the state
                match i {
                    0 => self.set_part_period(i, byte),
                    1 => self.set_part_period(i, byte),
                    _ => {}
                }
            }
            3 => {
                // Upper 16 bits of the state
                match i {
                    0 => self.set_part_period(i + 2, byte),
                    1 => self.set_part_period(i + 2, byte),
                    _ => {}
                }
            }
            _ => unreachable!("The timer address space is only 4 words long, if this error happens, update the bus module"),
        };

        Ok(())
    }
}

impl std::fmt::Debug for Timer {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "Timer {{ Running: {}, IRQ: {} }}",
            self.running, self.irq
        )
    }
}
