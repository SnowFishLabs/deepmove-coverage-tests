import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { linked_table_tests } from '../wrappers/dependencies/Sui/linked_table_tests';
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

describe('linked_table_tests', () => {
    it('simple_all_functions', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0]);

        let a2 = new String("goodbye");
        let a3 = new U8(1);
        linked_table.push_back([String.$type(), U8.$type()], table_0, a2, a3);

        let [v_0_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a2);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        let [v_2_bcs] = linked_table.is_empty([String.$type(), U8.$type()], table_0);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        let [v_3_bcs] = linked_table.borrow([String.$type(), U8.$type()], table_0, a0);
        expect(a1.from_bcs_t(v_3_bcs)).toEqual(a1);

        let [v_5_bcs] = linked_table.borrow([String.$type(), U8.$type()], table_0, a2);
        expect(a3.from_bcs_t(v_5_bcs)).toEqual(a3);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0, a2]);

        let a5 = new String("!!!");
        let a6 = new U8(2);
        linked_table.push_front([String.$type(), U8.$type()], table_0, a5, a6);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a5, a0, a2]);

        let a7 = new String("?");
        let a8 = new U8(3);
        linked_table.push_back([String.$type(), U8.$type()], table_0, a7, a8);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a5, a0, a2, a7]);

        let [r_0_bcs, r_1_bcs] = linked_table.pop_front([String.$type(), U8.$type()], table_0);
        let r_0 = a5.from_bcs_t(r_0_bcs);
        let r_1 = a6.from_bcs_t(r_1_bcs);
        expect(r_0).toEqual(a5);
        expect(r_1).toEqual(a6);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0, a2, a7]);

        let [r_2_bcs] = linked_table.remove([String.$type(), U8.$type()], table_0, a2);
        expect(a3.from_bcs_t(r_2_bcs)).toEqual(a3);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0, a7]);

        let [r_3_bcs, r_5_bcs] = linked_table.pop_back([String.$type(), U8.$type()], table_0);
        let r_2 = a7.from_bcs_t(r_3_bcs);
        let r_3 = a8.from_bcs_t(r_5_bcs);
        expect(r_2).toEqual(a7);
        expect(r_3).toEqual(a8);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0]);

        let [r_6_bcs] = linked_table.remove([String.$type(), U8.$type()], table_0, a0);
        expect(a1.from_bcs_t(r_6_bcs)).toEqual(a1);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let [v_7_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a0);
        expect(bcs_import.bool().parse(v_7_bcs)).toEqual(false);

        let [v_8_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a2);
        expect(bcs_import.bool().parse(v_8_bcs)).toEqual(false);

        let [v_9_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a5);
        expect(bcs_import.bool().parse(v_9_bcs)).toEqual(false);

        let [v_10_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a7);
        expect(bcs_import.bool().parse(v_10_bcs)).toEqual(false);

        let [v_11_bcs] = linked_table.is_empty([String.$type(), U8.$type()], table_0);
        expect(bcs_import.bool().parse(v_11_bcs)).toEqual(true);

        test_scenario.end(scenario);
    })

    it('front_back_empty', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([U64.$type(), U64.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(U64.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let [v_0_bcs] = linked_table.front([U64.$type(), U64.$type()], table_0);
        let v_0 = option.Option.bcs(U64.bcs).parse(v_0_bcs);

        expect(v_0.vec.length).toEqual(0);

        let [v_1_bcs] = linked_table.back([U64.$type(), U64.$type()], table_0);
        let v_1 = option.Option.bcs(U64.bcs).parse(v_1_bcs);

        expect(v_1.vec.length).toEqual(0);

        test_scenario.end(scenario);
    })

    it('push_front_singleton', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_front([String.$type(), U8.$type()], table_0, a0, a1);

        let [v_0_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0]);

        test_scenario.end(scenario);
    })

    it('push_back_singleton', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;
        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1);

        let [v_0_bcs] = linked_table.contains([String.$type(), U8.$type()], table_0, a0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, [a0]);

        test_scenario.end(scenario);
    })

    it('push_front_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;
        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_front([String.$type(), U8.$type()], table_0, a0, a1);

        expect(() => linked_table.push_front([String.$type(), U8.$type()], table_0, a0, a1))
                    .toThrowError("VMError with status ABORTED with sub status " + 0);
                    
        test_scenario.end(scenario);
    })

    it('push_back_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;
        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1);

        expect(() => linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1))
                    .toThrowError("VMError with status ABORTED with sub status " + 0);
                    
        test_scenario.end(scenario);
    })

    it('push_mixed_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;
        linked_table_tests.check_ordering([String.$type(), U8.$type()], table_0, []);

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1);

        expect(() => linked_table.push_front([String.$type(), U8.$type()], table_0, a0, a1))
                    .toThrowError("VMError with status ABORTED with sub status " + 0);
                    
        test_scenario.end(scenario);
    })

    it('borrow_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        expect(() => linked_table.borrow([String.$type(), U8.$type()], table_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    })

    it('borrow_mut_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        expect(() => linked_table.borrow_mut([String.$type(), U8.$type()], table_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);
                    
        test_scenario.end(scenario);
    })

    it('remove_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        expect(() => linked_table.remove([String.$type(), U8.$type()], table_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);
                    
        test_scenario.end(scenario);
    })

    it('pop_front_empty', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        expect(() => linked_table.pop_front([String.$type(), U8.$type()], table_0))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);
                    
        test_scenario.end(scenario);
    })

    it('pop_back_empty', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        expect(() => linked_table.pop_back([String.$type(), U8.$type()], table_0))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);
                    
        test_scenario.end(scenario);
    })

    it('destroy_non_empty', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [table_0_bcs] = linked_table.new_([String.$type(), U8.$type()], scenario.ctx);

        let table_0 = linked_table.LinkedTable.bcs(String.bcs).parse(table_0_bcs);
        table_0.T0_bcs = String.bcs;

        let a0 = new String("hello");
        let a1 = new U8(0);

        linked_table.push_back([String.$type(), U8.$type()], table_0, a0, a1);

        expect(() => linked_table.destroy_empty([String.$type(), U8.$type()], table_0))
                    .toThrowError("VMError with status ABORTED with sub status " + 0);
                    
        test_scenario.end(scenario);
    })
});