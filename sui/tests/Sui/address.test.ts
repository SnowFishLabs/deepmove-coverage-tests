import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { address } from '../wrappers/dependencies/Sui/address';
import { ascii } from '../wrappers/dependencies/MoveStdlib/ascii';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('address_test', () => {
    it('test fun to_bytes', () => {
        let [r0] = address.to_bytes("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
        expect(r0).toEqual([
            255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255,
            255, 254
        ]);
    });

    it('test fun to_ascii_string', () => {
        let [r0] = address.to_ascii_string("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
        expect(r0).toEqual('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
    });

    it('test fun to_string', () => {
        let [r0] = address.to_string("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
        expect(r0).toEqual('fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe');
    });

    it('test fun from_ascii_bytes', () => {
        let [r0] = ascii.into_bytes("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
        let [r1] = address.from_ascii_bytes(r0);
        expect(r1).toEqual("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe");
    });

    it('test fun hex_char_value', () => {
        let [r0] = address.hex_char_value(50);
        expect(r0).toEqual(2);
    });

    it('test fun length', () => {
        let [length] = address.length();
        expect(length).toEqual('32');
    });

    it('test fun max', () => {
        let [r0] = address.max();
        expect(r0).toEqual('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    });
})