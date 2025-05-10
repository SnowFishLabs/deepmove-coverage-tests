import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { bit_vector } from '../wrappers/dependencies/MoveStdlib/bit_vector';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('bit_vector_test', () => {
    it('test fun new', () => {
        let [r0] = bit_vector.new_(10);

        expect(r0.length).toEqual('10');
        expect(r0.bit_field[0]).toEqual(false);
        expect(r0.bit_field[9]).toEqual(false);
    });

    it('test fun set', () => {
        let [r0] = bit_vector.new_(10);

        bit_vector.set(r0, 3);
        expect(r0.bit_field[0]).toEqual(false);
        expect(r0.bit_field[3]).toEqual(true);
    });

    it('test fun unset', () => {
        let [r0] = bit_vector.new_(10);

        bit_vector.set(r0, 3);
        expect(r0.bit_field[0]).toEqual(false);
        expect(r0.bit_field[3]).toEqual(true);
        bit_vector.unset(r0, 3);
        expect(r0.bit_field[3]).toEqual(false);
    });

    it('test fun shift_left', () => {
        let [r0] = bit_vector.new_(10);

        bit_vector.set(r0, 0);
        bit_vector.set(r0, 1);
        bit_vector.set(r0, 2);
        bit_vector.set(r0, 3);
        bit_vector.set(r0, 4);
        bit_vector.set(r0, 5);
        expect(r0.bit_field[0]).toEqual(true);
        expect(r0.bit_field[1]).toEqual(true);
        expect(r0.bit_field[2]).toEqual(true);
        expect(r0.bit_field[3]).toEqual(true);
        expect(r0.bit_field[4]).toEqual(true);
        expect(r0.bit_field[5]).toEqual(true);
        bit_vector.shift_left(r0, 3);
        expect(r0.bit_field[0]).toEqual(true);
        expect(r0.bit_field[1]).toEqual(true);
        expect(r0.bit_field[2]).toEqual(true);
        expect(r0.bit_field[3]).toEqual(false);
        expect(r0.bit_field[4]).toEqual(false);
        expect(r0.bit_field[5]).toEqual(false);
    });

    it('test fun length', () => {
        let [r0] = bit_vector.new_(10);

        let [a0] = bit_vector.length(r0);
        expect(a0).toEqual('10');

        let [r1] = bit_vector.new_(120);

        let [a1] = bit_vector.length(r1);
        expect(a1).toEqual('120');
    });

    it('test fun longest_set_sequence_starting_at', () => {
        let [r0] = bit_vector.new_(10);

        bit_vector.set(r0, 0);
        bit_vector.set(r0, 1);
        bit_vector.set(r0, 2);
        bit_vector.set(r0, 5);
        bit_vector.set(r0, 6);

        let [a0] = bit_vector.longest_set_sequence_starting_at(r0, 7);
        expect(a0).toEqual('0');
        let [a1] = bit_vector.longest_set_sequence_starting_at(r0, 6);
        expect(a1).toEqual('1');
    });
})