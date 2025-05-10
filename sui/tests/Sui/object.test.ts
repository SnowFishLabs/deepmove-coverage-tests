import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { object_table } from '../wrappers/dependencies/Sui/object_table';
import { object_table_tests } from '../wrappers/dependencies/Sui/object_table_tests';
import { address } from '../wrappers/dependencies/Sui/address';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { display } from '../wrappers/dependencies/Sui/display';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('object_tests', () => {
    it('test_bytes_address_roundtrip', () => {
        let [ctx] = tx_context.dummy();

        let [uid_0] = object.new_(ctx);
        let [uid_1] = object.new_(ctx);

        let [addr0] = object.uid_to_address(uid_0);
        let [byte0] = object.uid_to_bytes(uid_0);

        let [addr1] = object.uid_to_address(uid_1);
        let [byte1] = object.uid_to_bytes(uid_1);

        expect(addr0).not.toEqual(addr1);
        expect(byte0).not.toEqual(byte1);

        let [addr2] = address.from_bytes(byte0);
        let [addr3] = address.from_bytes(byte1);

        expect(addr0).toEqual(addr2);
        expect(addr1).toEqual(addr3);
    })
});