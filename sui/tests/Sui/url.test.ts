import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { url } from '../wrappers/dependencies/Sui/url';
import { ascii } from '../wrappers/dependencies/MoveStdlib/ascii';
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('url_tests', () => {
    it('test_basic_url', () => {
        let hex0 = Array.from(fromHex("414243454647"));

        let [str1] = ascii.string(hex0);

        let [url0] = url.new_unsafe(str1);

        expect(url0.url).toEqual(str1);
    })
});