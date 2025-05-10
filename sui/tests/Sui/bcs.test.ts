import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { bcs } from '../wrappers/dependencies/Sui/bcs';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('bcs_test', () => {
    it('test_uleb_len_fail', () => {
        let [bcs_0] = bcs.new_([0xff, 0xff, 0xff, 0xff, 0x80]);
        
        expect(() => bcs.peel_vec_length(bcs_0)).toThrowError("VMError with status ABORTED with sub status 2")
    })

    it('test_bool_fail', () => {
        let a0 = new U8(10)
        let [r0_bcs] = bcs.to_bytes([U8.$type()], a0);
        let r0 = a0.from_bcs_vector_t(r0_bcs);
        let [bcs_0] = bcs.new_(into_arr_value(r0));

        expect(() => bcs.peel_bool(bcs_0)).toThrowError("VMError with status ABORTED with sub status 1")
    })
});