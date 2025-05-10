import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, Ascii, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { ascii } from '../wrappers/dependencies/MoveStdlib/ascii';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('ascii_test', () => {
    it('test fun char', () => {
        let [r0] = ascii.char(12);
        expect(r0.byte).toEqual(12);
    });

    it('test fun string', () => {
        let [r0] = ascii.string([97, 98]);
        expect(r0).toEqual("ab");
    });

    it('test fun try_string', () => {
        let [r0] = ascii.try_string([97, 98]);
        expect(r0.vec[0]).toEqual("ab");
        let [r1] = ascii.try_string([128]);
        expect(r1.vec.length).toEqual(0);
    });

    it('test fun all_characters_printable', () => {
        let [r0] = ascii.all_characters_printable("ab");
        expect(r0).toEqual(true);
        let [r1] = ascii.all_characters_printable("😅");
        expect(r1).toEqual(false);
    })

    it('test fun push_char', () => {
        let a0 = new Ascii("ab");
        ascii.push_char(a0, new ascii.Char(99));
        expect(a0.into_value()).toEqual("abc");
    });

    it('test fun pop_char', () => {
        let a0 = new Ascii("ab");
        let [r0] = ascii.pop_char(a0);
        expect(a0.into_value()).toEqual("a");
        expect(r0.byte).toEqual(98); // "b"
    });

    it('test fun length', () => {
        let [r0] = ascii.length("ab");
        expect(r0).toEqual("2");
    });

    it('test fun append', () => {
        let a0 = new Ascii("ab");
        ascii.append(a0, "cd");
        expect(a0.value).toEqual("abcd");
    });

    it('test fun insert', () => {
        let a0 = new Ascii("ab");
        ascii.insert(a0, 0, "cd");
        expect(a0.value).toEqual("cdab");
    });

    it('test fun substring', () => {
        let [r0] = ascii.substring("abcde", 0, 3);
        expect(r0).toEqual("abc");

        let [r1] = ascii.substring("abcde", 0, 5);
        expect(r1).toEqual("abcde");

        expect(() => ascii.substring("abcde", 0, 6)).toThrowError('ascii::substring')
    });

    it('test fun as_bytes', () => {
        let [r0] = ascii.as_bytes("ab");
        expect(r0).toEqual([97, 98]);
    })

    it('test fun into_bytes', () => {
        let [r0] = ascii.into_bytes("ab");
        expect(r0).toEqual([97, 98]);
    })

    it('test fun byte', () => {
        let a0 = new ascii.Char(97);
        let [r0] = ascii.byte(a0);
        expect(r0).toEqual(97);
    })

    it('test fun is_valid_char', () => {
        let [r0] = ascii.is_valid_char(97);
        expect(r0).toEqual(true);

        let [r1] = ascii.is_valid_char(255);
        expect(r1).toEqual(false);
    })

    it('test fun is_printable_char', () => {
        let [r0] = ascii.is_printable_char(97);
        expect(r0).toEqual(true);

        let [r1] = ascii.is_printable_char(255);
        expect(r1).toEqual(false);
    })

    it('test fun is_empty', () => {
        let [r0] = ascii.is_empty("");
        expect(r0).toEqual(true);

        let [r1] = ascii.is_empty("a");
        expect(r1).toEqual(false);
    })

    it('test fun to_uppercase', () => {
        let [r0] = ascii.to_uppercase("abcde");
        expect(r0).toEqual("ABCDE");
    })

    it('test fun to_lowercase', () => {
        let [r0] = ascii.to_lowercase("ABCDE");
        expect(r0).toEqual("abcde");
    })

    it('test fun index_of', () => {
        let [r0] = ascii.index_of("ABCDE", "CD");
        expect(r0).toEqual('2');

        let [r1] = ascii.index_of("ABCDE", "cd");
        expect(r1).toEqual('5');

        let [r2] = ascii.index_of("ABCDE", "");
        expect(r2).toEqual('0');
    })

    it('tet fun char_to_uppercase', () => {
        let [r0] = ascii.char_to_uppercase(97);
        expect(r0).toEqual(65);
    });

    it('tet fun char_to_lowercase', () => {
        let [r0] = ascii.char_to_lowercase(65);
        expect(r0).toEqual(97);
    });
})