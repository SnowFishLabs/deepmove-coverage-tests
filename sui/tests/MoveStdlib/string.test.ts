import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, String, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { string } from '../wrappers/dependencies/MoveStdlib/string';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('string_test', () => {
    it('test fun utf8', () => {
        let [r0] = string.utf8([97, 98]);

        expect(r0).toEqual("ab");
    });

    it('test fun from_ascii', () => {
        let [r0] = string.from_ascii("ab");
        expect(r0).toEqual("ab");
    });

    it('test fun to_ascii', () => {
        let [r0] = string.to_ascii("ab");
        expect(r0).toEqual("ab");
    });

    it('test fun try_utf8', () => {
        let [r0] = string.try_utf8([97, 98]);
        expect(r0.vec[0]).toEqual("ab");
    });

    it('test fun as_bytes', () => {
        let [r0] = string.as_bytes("ab");
        expect(r0).toEqual([97, 98]);
    });

    it('test fun into_bytes', () => {
        let [r0] = string.into_bytes("ab");
        expect(r0).toEqual([97, 98]);
    });

    it('test fun is_empty', () => {
        let [r0] = string.is_empty("");
        expect(r0).toEqual(true);

        let [r1] = string.is_empty("ab");
        expect(r1).toEqual(false);
    });

    it('test fun length', () => {
        let [r0] = string.length("");
        expect(r0).toEqual('0');

        let [r1] = string.length("ab");
        expect(r1).toEqual('2');
    });

    it('test fun append', () => {
        let a0 = new String("");
        string.append(a0, "ab");
        expect(a0.value).toEqual('ab');
    });

    it('test fun append_utf8', () => {
        let a0 = new String("");
        string.append_utf8(a0, [97, 98]);
        expect(a0.value).toEqual('ab');
    });

    it('test fun insert', () => {
        let a0 = new String("defghijk");
        string.insert(a0, 0, "ab");
        expect(a0.value).toEqual('abdefghijk');
    });

    it('test fun substring', () => {
        let [r0] = string.substring("abdefghijk", 0, 2);
        expect(r0).toEqual('ab');
    });

    it('test fun index_of', () => {
        let [r0] = string.index_of("abdefghijk", "ghi");
        expect(r0).toEqual('5');
    });
});