import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { u128 } from '../wrappers/dependencies/MoveStdlib/u128';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('u128_test', () => {
    it('test fun bitwise_not', () => {
        let [r0] = u128.bitwise_not(0);
        expect(r0).toEqual("340282366920938463463374607431768211455");
    });

    it('test fun max', () => {
        let [r0] = u128.max(0, 1);
        expect(r0).toEqual('1');
    });

    it('test fun min', () => {
        let [r0] = u128.min(0, 1);
        expect(r0).toEqual('0');
    });

    it('test fun diff', () => {
        let [r0] = u128.diff(100, 1);
        expect(r0).toEqual('99');

        let [r1] = u128.diff(1, 100);
        expect(r1).toEqual('99');
    });

    it('test fun divide_and_round_up', () => {
        let [r0] = u128.divide_and_round_up(16, 3);
        expect(r0).toEqual('6');
    });

    it('test fun pow', () => {
        let [r0] = u128.pow(2, 3);
        expect(r0).toEqual('8');
    });

    it('test fun sqrt', () => {
        let [r0] = u128.sqrt(9);
        expect(r0).toEqual('3');

        let [r1] = u128.sqrt(8);
        expect(r1).toEqual('2');
    });

    it('test fun try_as_u8', () => {
        let [r0] = u128.try_as_u8(9);
        expect(r0.vec[0]).toEqual(9);
    });

    it('test fun try_as_u16', () => {
        let [r0] = u128.try_as_u16(9);
        expect(r0.vec[0]).toEqual(9);
    });

    it('test fun try_as_u32', () => {
        let [r0] = u128.try_as_u32(9);
        expect(r0.vec[0]).toEqual(9);
    });

    it('test fun try_as_u64', () => {
        let [r0] = u128.try_as_u64(9);
        expect(r0.vec[0]).toEqual('9');
    });

    it('test fun to_string', () => {
        let [r0] = u128.to_string(9);
        expect(r0).toEqual('9');
    });
});