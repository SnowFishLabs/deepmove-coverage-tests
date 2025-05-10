import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { uq32_32 } from '../wrappers/dependencies/MoveStdlib/uq32_32';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('uq32_32_test', () => {
    it('test fun from_quotient', () => {
        let [r0] = uq32_32.from_quotient(3, 4);
        expect(r0.pos0).toEqual("3221225472");
    });

    it('test fun from_int', () => {
        let [r0] = uq32_32.from_int(3);
        expect(r0.pos0).toEqual("12884901888");
    });

    it('test fun add', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.add(r0, r1);
        expect(r2.pos0).toEqual("16106127360");
    });

    it('test fun sub', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.sub(r0, r1);
        expect(r2.pos0).toEqual("9663676416");
    });

    it('test fun mul', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.mul(r0, r1);
        expect(r2.pos0).toEqual("9663676416");
    });

    it('test fun div', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.div(r0, r1);
        expect(r2.pos0).toEqual("17179869184");
    });

    it('test fun to_int', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.to_int(r0);
        expect(r1).toEqual(3);
    });

    it('test fun int_mul', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.int_mul(3, r0);
        expect(r1).toEqual('9');
    });

    it('test fun int_div', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.int_div(9, r0);
        expect(r1).toEqual('3');
    });

    it('test fun le', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.le(r0, r1);
        expect(r2).toEqual(false);
    });

    it('test fun lt', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.lt(r0, r1);
        expect(r2).toEqual(false);
    });

    it('test fun ge', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.ge(r0, r1);
        expect(r2).toEqual(true);
    });

    it('test fun gt', () => {
        let [r0] = uq32_32.from_int(3);
        let [r1] = uq32_32.from_quotient(3, 4);
        let [r2] = uq32_32.gt(r0, r1);
        expect(r2).toEqual(true);
    });

    it('test fun to_raw', () => {
        let [r0] = uq32_32.from_int(3);
        let [r2] = uq32_32.to_raw(r0);
        expect(r2).toEqual('12884901888');
    });

    it('test fun from_raw', () => {
        let [r0] = uq32_32.from_raw('12884901888');
        expect(r0.pos0).toEqual('12884901888');
    });
});