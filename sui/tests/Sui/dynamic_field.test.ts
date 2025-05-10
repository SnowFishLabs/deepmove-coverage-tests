import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { dynamic_field } from '../wrappers/dependencies/Sui/dynamic_field';
import { transfer_ as transfer } from '../wrappers/dependencies/Sui/transfer';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { display } from '../wrappers/dependencies/Sui/display';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('dynamic_field_tests', () => {
    it('simple_all_functions', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U64(0);
        let a2 = new String("");
        let a3 = new U64(1);
        let a5 = new Boolean(false);
        let a6 = new U64(2);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a1);
        dynamic_field.add([String.$type(), U64.$type()], id_0, a2, a3);
        dynamic_field.add([Boolean.$type(), U64.$type()], id_0, a5, a6);

        let [r_0_bcs] = dynamic_field.exists_with_type([U64.$type(), U64.$type()], id_0, a0);
        expect(bcs_import.bool().parse(r_0_bcs)).toEqual(true);

        let [r_1_bcs] = dynamic_field.exists_with_type([String.$type(), U64.$type()], id_0, a2);
        expect(bcs_import.bool().parse(r_1_bcs)).toEqual(true);
        
        let [r_2_bcs] = dynamic_field.exists_with_type([Boolean.$type(), U64.$type()], id_0, a5);
        expect(bcs_import.bool().parse(r_2_bcs)).toEqual(true);

        let [r_5_bcs] = dynamic_field.borrow([U64.$type(), U64.$type()], id_0, a0);
        let r_5 = U64.bcs.parse(r_5_bcs);
        expect(r_5).toEqual(a1);

        let [r_6_bcs] = dynamic_field.borrow([String.$type(), U64.$type()], id_0, a2);
        let r_6 = U64.bcs.parse(r_6_bcs);
        expect(r_6).toEqual(a3);

        let [r_7_bcs] = dynamic_field.borrow([Boolean.$type(), U64.$type()], id_0, a5);
        let r_7 = U64.bcs.parse(r_7_bcs);
        expect(r_7).toEqual(a6);

        let [r_8_bcs] = dynamic_field.remove([U64.$type(), U64.$type()], id_0, a0);
        let r_8 = U64.bcs.parse(r_8_bcs);
        expect(r_8).toEqual(a1);

        let [r_9_bcs] = dynamic_field.remove([String.$type(), U64.$type()], id_0, a2);
        let r_9 = U64.bcs.parse(r_9_bcs);
        expect(r_9).toEqual(a3);

        let [r_10_bcs] = dynamic_field.remove([Boolean.$type(), U64.$type()], id_0, a5);
        let r_10 = U64.bcs.parse(r_10_bcs);
        expect(r_10).toEqual(a6);

        let [r_11_bcs] = dynamic_field.exists_with_type([U64.$type(), U64.$type()], id_0, a0);
        expect(bcs_import.bool().parse(r_11_bcs)).toEqual(false);

        let [r_12_bcs] = dynamic_field.exists_with_type([String.$type(), U64.$type()], id_0, a2);
        expect(bcs_import.bool().parse(r_12_bcs)).toEqual(false);
        
        let [r_13_bcs] = dynamic_field.exists_with_type([Boolean.$type(), U64.$type()], id_0, a5);
        expect(bcs_import.bool().parse(r_13_bcs)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('add_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U64(1);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);
        expect(() => dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a1))
            .toThrowError("VMError with status ABORTED with sub status 0")

        test_scenario.end(scenario);
    })

    it('add_duplicate_mismatched_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(1);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);
        expect(() => dynamic_field.add([U64.$type(), U8.$type()], id_0, a0, a1))
            .toThrowError("VMError with status ABORTED with sub status 0")

        test_scenario.end(scenario);
    })

    it('borrow_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        expect(() => dynamic_field.borrow([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 1")
    })

    it('borrow_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(1);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);

        expect(() => dynamic_field.borrow([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 2")
    })

    it('borrow_mut_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        expect(() => dynamic_field.borrow_mut([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 1")
    })

    it('borrow_mut_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(1);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);

        expect(() => dynamic_field.borrow_mut([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 2")
    })

    it('remove_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        expect(() => dynamic_field.remove([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 1")
    })

    it('remove_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(1);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);

        expect(() => dynamic_field.remove([U64.$type(), U8.$type()], id_0, a0))
            .toThrowError("VMError with status ABORTED with sub status 2")
    })

    it('sanity_check_exists', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);
        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(1);

        let [r_0_bcs] = dynamic_field.exists_with_type([U64.$type(), U64.$type()], id_0, a0);
        expect(bcs_import.bool().parse(r_0_bcs)).toEqual(false);

        dynamic_field.add([U64.$type(), U64.$type()], id_0, a0, a0);

        let [r_1_bcs] = dynamic_field.exists_with_type([U64.$type(), U64.$type()], id_0, a0);
        expect(bcs_import.bool().parse(r_1_bcs)).toEqual(true);

        let [r_2_bcs] = dynamic_field.exists_with_type([U64.$type(), U8.$type()], id_0, a0);
        expect(bcs_import.bool().parse(r_2_bcs)).toEqual(false);

        test_scenario.end(scenario);
    })
});