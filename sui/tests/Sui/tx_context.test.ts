import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, afterTestAll, beforeTest, afterTest, get_wasm } from '@deepmove/sui';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { object } from '../wrappers/dependencies/Sui/object';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('tx_context_tests', () => {
    it('test_id_generation', () => {
        refresh_vm();

        let [ctx] = tx_context.dummy();

        let [id1] = object.new_(ctx);
        let [id2] = object.new_(ctx);

        expect(id1).not.toEqual(id2);

        let [v0] = tx_context.get_ids_created(ctx);
        expect(v0).toEqual("2");
    })
});