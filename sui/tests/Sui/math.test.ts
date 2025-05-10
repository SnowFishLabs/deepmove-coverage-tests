import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { math } from '../wrappers/dependencies/Sui/math';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('math_tests', () => {
    it('test_max', () => {
        let [r_0] = math.max(10, 100);

        expect(r_0).toEqual("100");

        let [r_1] = math.max(0, 0);

        expect(r_1).toEqual("0");
    })

    it('test_min', () => {
        let [r_0] = math.min(10, 100);

        expect(r_0).toEqual("10");

        let [r_1] = math.min(0, 0);

        expect(r_1).toEqual("0");
    })

    it('test_pow', () => {
        let [r_0] = math.pow(1, 0);
        expect(r_0).toEqual("1");

        let [r_1] = math.pow(3, 1);
        expect(r_1).toEqual("3");

        let [r_2] = math.pow(2, 10);
        expect(r_2).toEqual("1024");

        let [r_3] = math.pow(10, 6);
        expect(r_3).toEqual("1000000");
    })

    it('test_pow_overflow', () => {
        expect(() => math.pow(10, 100))
            .toThrowError("VMError with status ARITHMETIC_ERROR");
    })

    it('test_perfect_sqrt', () => {
        for (var i = 0; i < 1000; i++) {
            let [r_0] = math.sqrt(i * i);
            expect(r_0).toEqual(i + "");
        }

        let j: bigint = 0xFFFFFFFFFn;
        while (j < 0xFFFFFFFFFn + 1n) {
            let [r_1] = math.sqrt_u128(j * j);
            expect(r_1).toEqual(j + "");
            j = j + 1n;
        }
    })

    it('test_sqrt_big_numbers', () => {
        let [r_0] = math.sqrt(18446744073709551615n);
        expect(r_0).toEqual("4294967295");
    })
});