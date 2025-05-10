import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { fixed_point32 } from '../wrappers/dependencies/MoveStdlib/fixed_point32';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('fixed_point32_test', () => {
    it('test fun multiply_u64', () => {
        let [a0] = fixed_point32.create_from_rational(32, 10);
        let [r0] = fixed_point32.multiply_u64(10, a0);

        expect(r0).toEqual('31');
    });

    it('test fun divide_u64', () => {
        let [a0] = fixed_point32.create_from_rational(32, 10);
        let [r0] = fixed_point32.divide_u64(10000, a0);

        expect(r0).toEqual('3125');
    });

    it('test fun create_from_raw_value', () => {
        let [a0] = fixed_point32.create_from_raw_value(32);
        let [r0] = fixed_point32.divide_u64(10000, a0);

        expect(a0.value).toEqual('32');
    });

    it('test fun get_raw_value', () => {
        let [a0] = fixed_point32.create_from_raw_value(32);

        let [r0] = fixed_point32.get_raw_value(a0);
        expect(r0).toEqual('32');
    });

    it('test fun is_zero', () => {
        let [a0] = fixed_point32.create_from_raw_value(32);

        let [r0] = fixed_point32.is_zero(a0);
        expect(r0).toEqual(false);
    });
});