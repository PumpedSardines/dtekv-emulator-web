let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

export function init_panic_hook() {
    wasm.init_panic_hook();
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CpuFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cpu_free(ptr >>> 0, 1));

export class Cpu {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Cpu.prototype);
        obj.__wbg_ptr = ptr;
        CpuFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CpuFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cpu_free(ptr, 0);
    }
    /**
     * @returns {Cpu}
     */
    static new() {
        const ret = wasm.cpu_new();
        return Cpu.__wrap(ret);
    }
    set_to_new() {
        wasm.cpu_set_to_new(this.__wbg_ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    get_vga_frame_buffer() {
        const ret = wasm.cpu_get_vga_frame_buffer(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {number}
     */
    get_pc() {
        const ret = wasm.cpu_get_pc(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {boolean}
     */
    get_switch(index) {
        const ret = wasm.cpu_get_switch(this.__wbg_ptr, index);
        return ret !== 0;
    }
    /**
     * @param {number} index
     * @param {boolean} value
     */
    set_switch(index, value) {
        wasm.cpu_set_switch(this.__wbg_ptr, index, value);
    }
    /**
     * @param {number} index
     * @returns {number}
     */
    get_hex_display(index) {
        const ret = wasm.cpu_get_hex_display(this.__wbg_ptr, index);
        return ret;
    }
    /**
     * @param {boolean} value
     */
    set_button(value) {
        wasm.cpu_set_button(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get_button() {
        const ret = wasm.cpu_get_button(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {Uint8Array} bin
     */
    load(bin) {
        const ptr0 = passArray8ToWasm0(bin, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.cpu_load(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {string}
     */
    flush_uart() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cpu_flush_uart(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    reset() {
        wasm.cpu_reset(this.__wbg_ptr);
    }
    handle_interrupt() {
        wasm.cpu_handle_interrupt(this.__wbg_ptr);
    }
    /**
     * @param {number} addr
     * @returns {number}
     */
    read_word(addr) {
        const ret = wasm.cpu_read_word(this.__wbg_ptr, addr);
        return ret;
    }
    /**
     * @param {number} cycles
     */
    clock(cycles) {
        wasm.cpu_clock(this.__wbg_ptr, cycles);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_length_9254c4bd3b9f23c4(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};

export function __wbg_newwithlength_76462a666eca145f(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_setindex_ffcb66ea02efa3aa(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = arg2;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

