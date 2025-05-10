import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { u8 } from '../wrappers/dependencies/MoveStdlib/u8';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('u8_test', () => {
    it('test fun bitwise_not', () => {
        let [r0] = u8.bitwise_not(0);
        expect(r0).toEqual(255);
    });

    it('test fun max', () => {
        let [r0] = u8.max(0, 1);
        expect(r0).toEqual(1);
    });

    it('test fun min', () => {
        let [r0] = u8.min(0, 1);
        expect(r0).toEqual(0);
    });

    it('test fun diff', () => {
        let [r0] = u8.diff(100, 1);
        expect(r0).toEqual(99);

        let [r1] = u8.diff(1, 100);
        expect(r1).toEqual(99);
    });

    it('test fun divide_and_round_up', () => {
        let [r0] = u8.divide_and_round_up(16, 3);
        expect(r0).toEqual(6);
    });

    it('test fun pow', () => {
        let [r0] = u8.pow(2, 3);
        expect(r0).toEqual(8);
    });

    it('test fun sqrt', () => {
        let [r0] = u8.sqrt(9);
        expect(r0).toEqual(3);

        let [r1] = u8.sqrt(8);
        expect(r1).toEqual(2);
    });

    it('test fun to_string', () => {
        let [r0] = u8.to_string(9);
        expect(r0).toEqual('9');
    });
});