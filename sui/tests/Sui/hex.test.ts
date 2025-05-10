import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { hex } from '../wrappers/dependencies/Sui/hex';
import { dynamic_object_field } from '../wrappers/dependencies/Sui/dynamic_object_field';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { display } from '../wrappers/dependencies/Sui/display';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('hex_tests', () => {
    it('test_hex_encode_string_literal', () => {
        let [a0] = string.as_bytes("0");
        let [a1] = string.as_bytes("30");
        let [a2] = string.as_bytes("a");
        let [a3] = string.as_bytes("61");
        let [a5] = string.as_bytes("fff");
        let [a6] = string.as_bytes("666666");

        let [r0] = hex.encode(a0)
        expect(r0).toEqual(a1);

        let [r1] = hex.encode(a2)
        expect(r1).toEqual(a3);

        let [r2] = hex.encode(a5)
        expect(r2).toEqual(a6);
    })

    it('test_hex_encode_hex_literal', () => {
        let [a0] = string.as_bytes("ff");
        let [a1] = string.as_bytes("fe");
        let [a2] = string.as_bytes("00");

        let [r0] = hex.encode([0xff])
        expect(r0).toEqual(a0);

        let [r1] = hex.encode([0xfe])
        expect(r1).toEqual(a1);

        let [r2] = hex.encode([0x00])
        expect(r2).toEqual(a2);
    });

    it('test_hex_decode_string_literal', () => {
        let [a0] = string.as_bytes("ff");
        let [a1] = string.as_bytes("fe");
        let [a2] = string.as_bytes("00");

        let [r0] = hex.decode(a0)
        expect(r0).toEqual([0xff]);

        let [r1] = hex.decode(a1)
        expect(r1).toEqual([0xfe]);

        let [r2] = hex.decode(a2)
        expect(r2).toEqual([0x00]);
    });

    it('test_hex_decode_string_literal__lowercase_and_uppercase', () => {
        let [a0] = string.as_bytes("Ff");
        let [a1] = string.as_bytes("fF");
        let [a2] = string.as_bytes("FF");

        let [r0] = hex.decode(a0)
        expect(r0).toEqual([0xff]);

        let [r1] = hex.decode(a1)
        expect(r1).toEqual([0xff]);

        let [r2] = hex.decode(a2)
        expect(r2).toEqual([0xff]);
    });

    it('test_hex_decode_string_literal__long_hex', () => {
        let [a0] = string.as_bytes("036d2416252ae1Db8aedAd59e14b007bee6aB94a3e77a3549a81137871604456f3");

        let [r0] = hex.decode(a0)
        let hex_0 = fromHex("036d2416252ae1db8aedad59e14b007bee6ab94a3e77a3549a81137871604456f3");

        expect(new Uint8Array(r0)).toEqual(hex_0);
    });

    it('test_hex_decode__invalid_length', () => {
        let [a0] = string.as_bytes("0");

        expect(() => hex.decode(a0))
            .toThrowError("VMError with status ABORTED with sub status 0")
    });

    it('test_hex_decode__hex_literal', () => {
        expect(() => hex.decode([0xff, 0xff]))
            .toThrowError("VMError with status ABORTED with sub status 1")
    });

    it('test_hex_decode__invalid_string_literal', () => {
        let [a0] = string.as_bytes("0g");

        expect(() => hex.decode(a0))
            .toThrowError("VMError with status ABORTED with sub status 1")
    });
});