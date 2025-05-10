import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { object_table } from '../wrappers/dependencies/Sui/object_table';
import { object_table_tests } from '../wrappers/dependencies/Sui/object_table_tests';
import { linked_table } from '../wrappers/dependencies/Sui/linked_table';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
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

describe('object_table_tests', () => {
    it('simple_all_functions', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let [id_0_bcs] = object.id([count_0.$type], count_0);

        let id_0 = object.ID.bcs.parse(id_0_bcs);

        let [count_1] = object_table_tests.new_(scenario);
        count_1.count = 1;

        let [id_1_bcs] = object.id([count_1.$type], count_1);

        let id_1 = object.ID.bcs.parse(id_1_bcs);

        let a0 = new String("hello");
        let a1 = new String("goodbye");

        object_table.add([a0.$type, count_0.$type], table_0, a0, count_0);
        object_table.add([a1.$type, count_1.$type], table_0, a1, count_1);

        let [v_0_bcs] = object_table.contains([a0.$type, count_0.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = object_table.contains([a1.$type, count_1.$type], table_0, a1);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        let [v_2_bcs] = object_table.value_id([a0.$type, count_0.$type], table_0, a0);
        let v_2 = option.Option.bcs(object.ID.bcs).parse(v_2_bcs);
        expect(v_2.vec[0]).toEqual(id_0);

        let [v_3_bcs] = object_table.value_id([a1.$type, count_1.$type], table_0, a1);
        let v_3 = option.Option.bcs(object.ID.bcs).parse(v_3_bcs);
        expect(v_3.vec[0]).toEqual(id_1);

        let [v_7_bcs] = object_table.borrow([a0.$type, count_0.$type], table_0, a0);
        let [v_8_bcs] = object_table.borrow([a1.$type, count_1.$type], table_0, a1);

        let v_7 = count_0.from_bcs_t(v_7_bcs);
        let v_8 = count_1.from_bcs_t(v_8_bcs);
        expect(v_7.count).toEqual("0");
        expect(v_8.count).toEqual("1");

        let [v_9_bcs] = object_table.remove([a0.$type, count_0.$type], table_0, a0);
        let [v_10_bcs] = object_table.remove([a1.$type, count_1.$type], table_0, a1);
        let v_9 = count_0.from_bcs_t(v_9_bcs);
        let v_10 = count_1.from_bcs_t(v_10_bcs);
        expect(v_9.count).toEqual("0");
        expect(v_10.count).toEqual("1");

        let [v_11_bcs] = object_table.contains([a0.$type, count_0.$type], table_0, a0);
        expect(bcs_import.bool().parse(v_11_bcs)).toEqual(false);

        let [v_12_bcs] = object_table.contains([a1.$type, count_1.$type], table_0, a1);
        expect(bcs_import.bool().parse(v_12_bcs)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('add_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let [count_1] = object_table_tests.new_(scenario);
        count_1.count = 1;

        let a0 = new String("hello");
        let a1 = new String("goodbye");

        object_table.add([a0.$type, count_0.$type], table_0, a0, count_0);

        expect(() => object_table.add([a0.$type, count_1.$type], table_0, a0, count_1))
                            .toThrowError("VMError with status ABORTED with sub status " + 0);

        test_scenario.end(scenario);
    });

    it('borrow_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let a0 = new String("hello");

        expect(() => object_table.borrow([a0.$type, count_0.$type], table_0, a0))
                            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('borrow_mut_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let a0 = new String("hello");

        expect(() => object_table.borrow_mut([a0.$type, count_0.$type], table_0, a0))
                            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('remove_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let a0 = new String("hello");

        expect(() => object_table.remove([a0.$type, count_0.$type], table_0, a0))
                            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('destroy_non_empty', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = object_table.new_([String.$type(), object_table_tests.Counter.$type()], scenario.ctx);
        let table_0 = object_table.ObjectTable.bcs.parse(table_0_bcs);

        let [count_0] = object_table_tests.new_(scenario);

        let a0 = new String("hello");

        object_table.add([a0.$type, count_0.$type], table_0, a0, count_0);

        expect(() => object_table.destroy_empty([a0.$type, count_0.$type], table_0))
                            .toThrowError("VMError with status ABORTED with sub status " + 0);

        test_scenario.end(scenario);
    });
});