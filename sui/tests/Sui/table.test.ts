import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { table } from '../wrappers/dependencies/Sui/table';
import { sui } from '../wrappers/dependencies/Sui/sui';
import { pay } from '../wrappers/dependencies/Sui/pay';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { hash } from '../wrappers/dependencies/Sui/hash';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('table_tests', () => {
    it('simple_all_functions', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);
        let a2 = new String("goodbye");
        let a3 = new U8(1);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        table.add([a0.$type, a1.$type], table_0, a0, a1);
        table.add([a2.$type, a3.$type], table_0, a2, a3);

        let [v_0_bcs] = table.contains([a0.$type, a1.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = table.contains([a2.$type, a3.$type], table_0, a2);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        let [v_2_bcs] = table.borrow([a0.$type, a1.$type], table_0, a0);
        expect(a1.from_bcs_t(v_2_bcs)).toEqual(a1);

        let [v_3_bcs] = table.borrow([a2.$type, a3.$type], table_0, a2);
        expect(a3.from_bcs_t(v_3_bcs)).toEqual(a3);

        let [v_5_bcs] = table.remove([a0.$type, a1.$type], table_0, a0);
        expect(a1.from_bcs_t(v_5_bcs)).toEqual(a1);

        let [v_6_bcs] = table.remove([a2.$type, a3.$type], table_0, a2);
        expect(a3.from_bcs_t(v_6_bcs)).toEqual(a3);

        let [v_7_bcs] = table.contains([a0.$type, a1.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_7_bcs)).toEqual(false);

        let [v_8_bcs] = table.contains([a2.$type, a3.$type], table_0, a2);
        expect(bcs_import.bool().parse(v_8_bcs)).toEqual(false);

        table.destroy_empty([a0.$type, a1.$type], table_0);
        test_scenario.end(scenario);
    })

    it('add_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        table.add([a0.$type, a1.$type], table_0, a0, a1);

        expect(() => table.add([a0.$type, a1.$type], table_0, a0, a1))
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    });

    it('borrow_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        expect(() => table.borrow([a0.$type, a1.$type], table_0, a0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('borrow_mut_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        expect(() => table.borrow([a0.$type, a1.$type], table_0, a0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('remove_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        expect(() => table.remove([a0.$type, a1.$type], table_0, a0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('destroy_non_empty', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new String("hello");
        let a1 = new U8(0);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        table.add([a0.$type, a1.$type], table_0, a0, a1);

        expect(() => table.destroy_empty([a0.$type, a1.$type], table_0))
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    });

    it('sanity_check_contains', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(0);
        let a1 = new U64(1);
        let a2 = new U64(3);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        let [v_0_bcs] = table.contains([a0.$type, a1.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);

        table.add([a0.$type, a1.$type], table_0, a0, a1);

        let [v_1_bcs] = table.contains([a0.$type, a1.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        let [v_2_bcs] = table.contains([a0.$type, a1.$type], table_0, a2);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        test_scenario.end(scenario);
    });

    it('sanity_check_drop', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(0);
        let a1 = new U64(1);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        table.add([a0.$type, a1.$type], table_0, a0, a1);

        table.drop([a0.$type, a1.$type], table_0);

        test_scenario.end(scenario);
    });

    it('sanity_check_size', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(0);
        let a1 = new U64(1);
        let a2 = new U64(2);
        let a3 = new U64(3);

        let [table_0_bcs] = table.new_([a0.$type, a1.$type], scenario.ctx);
        let table_0 = table.Table.bcs.parse(table_0_bcs);

        let [v_0_bcs] = table.is_empty([a0.$type, a1.$type], table_0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = table.length([a0.$type, a1.$type], table_0);
        expect(bcs_import.u64().parse(v_1_bcs)).toEqual("0");

        table.add([a0.$type, a1.$type], table_0, a0, a1);

        let [v_2_bcs] = table.is_empty([a0.$type, a1.$type], table_0);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        let [v_3_bcs] = table.length([a0.$type, a1.$type], table_0);
        expect(bcs_import.u64().parse(v_3_bcs)).toEqual("1");

        table.add([a2.$type, a3.$type], table_0, a2, a3);

        let [v_5_bcs] = table.is_empty([a0.$type, a1.$type], table_0);
        expect(bcs_import.bool().parse(v_5_bcs)).toEqual(false);

        let [v_6_bcs] = table.length([a0.$type, a1.$type], table_0);
        expect(bcs_import.u64().parse(v_6_bcs)).toEqual("2");

        table.drop([a0.$type, a1.$type], table_0);
        test_scenario.end(scenario);
    });
});