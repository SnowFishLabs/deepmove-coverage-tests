import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { dynamic_object_field_tests } from '../wrappers/dependencies/Sui/dynamic_object_field_tests';
import { dynamic_object_field } from '../wrappers/dependencies/Sui/dynamic_object_field';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { display } from '../wrappers/dependencies/Sui/display';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('dynamic_object_field_tests', () => {
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

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [id_1_bcs] = object.id([counter_1.$type], counter_1)
        let id_1 = object.ID.bcs.parse(id_1_bcs);

        let [counter_2] = dynamic_object_field_tests.new_(scenario);
        let [id_2_bcs] = object.id([counter_2.$type], counter_2)
        let id_2 = object.ID.bcs.parse(id_2_bcs);

        let [counter_3] = dynamic_object_field_tests.new_(scenario);
        let [id_3_bcs] = object.id([counter_3.$type], counter_3)
        let id_3 = object.ID.bcs.parse(id_3_bcs);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);
        dynamic_object_field.add([a2.$type, counter_2.$type], id_0, a2, counter_2);
        dynamic_object_field.add([a5.$type, counter_3.$type], id_0, a5, counter_3);

        let [r_0_bcs] = dynamic_object_field.exists__([a0.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_0_bcs)).toEqual(true);

        let [r_1_bcs] = dynamic_object_field.exists__([a2.$type], id_0, a2);
        expect(bcs_import.bool().parse(r_1_bcs)).toEqual(true);

        let [r_2_bcs] = dynamic_object_field.exists__([a5.$type], id_0, a5);
        expect(bcs_import.bool().parse(r_2_bcs)).toEqual(true);

        let [id_5_bcs] = dynamic_object_field.id([a0.$type], id_0, a0);
        let option_id_5 = option.Option.bcs(object.ID.bcs).parse(id_5_bcs);
        expect(option_id_5.vec[0]).toEqual(id_1);

        let [id_6_bcs] = dynamic_object_field.id([a2.$type], id_0, a2);
        let option_id_6 = option.Option.bcs(object.ID.bcs).parse(id_6_bcs);
        expect(option_id_6.vec[0]).toEqual(id_2);

        let [id_7_bcs] = dynamic_object_field.id([a5.$type], id_0, a5);
        let option_id_7 = option.Option.bcs(object.ID.bcs).parse(id_7_bcs);
        expect(option_id_7.vec[0]).toEqual(id_3);

        let [count_0_bcs] = dynamic_object_field.borrow_mut([a0.$type, counter_1.$type], id_0, a0);
        let count_0 = dynamic_object_field_tests.Counter.bcs.parse(count_0_bcs);
        expect(count_0.count).toEqual("0");

        let [count_1_bcs] = dynamic_object_field.borrow_mut([a2.$type, counter_2.$type], id_0, a2);
        let count_1 = dynamic_object_field_tests.Counter.bcs.parse(count_1_bcs);
        expect(count_1.count).toEqual("0");

        let [count_2_bcs] = dynamic_object_field.borrow_mut([a5.$type, counter_3.$type], id_0, a5);
        let count_2 = dynamic_object_field_tests.Counter.bcs.parse(count_2_bcs);
        expect(count_2.count).toEqual("0");

        dynamic_object_field_tests.bump(count_0);
        dynamic_object_field_tests.bump(count_1);
        dynamic_object_field_tests.bump(count_1);
        dynamic_object_field_tests.bump(count_2);
        dynamic_object_field_tests.bump(count_2);
        dynamic_object_field_tests.bump(count_2);
        expect(count_0.count).toEqual("1");
        expect(count_1.count).toEqual("2");
        expect(count_2.count).toEqual("3");

        let [count_3_bcs] = dynamic_object_field.borrow([a0.$type, counter_1.$type], id_0, a0);
        let count_3 = dynamic_object_field_tests.Counter.bcs.parse(count_3_bcs);
        expect(count_3.count).toEqual("0");

        let [count_5_bcs] = dynamic_object_field.borrow([a2.$type, counter_2.$type], id_0, a2);
        let count_5 = dynamic_object_field_tests.Counter.bcs.parse(count_5_bcs);
        expect(count_5.count).toEqual("0");

        let [count_6_bcs] = dynamic_object_field.borrow([a5.$type, counter_3.$type], id_0, a5);
        let count_6 = dynamic_object_field_tests.Counter.bcs.parse(count_6_bcs);
        expect(count_6.count).toEqual("0");

        dynamic_object_field.remove([a0.$type, counter_1.$type], id_0, a0);
        dynamic_object_field.remove([a2.$type, counter_2.$type], id_0, a2);
        dynamic_object_field.remove([a5.$type, counter_3.$type], id_0, a5);

        let [r_3_bcs] = dynamic_object_field.exists__([a0.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_3_bcs)).toEqual(false);

        let [r_5_bcs] = dynamic_object_field.exists__([a2.$type], id_0, a2);
        expect(bcs_import.bool().parse(r_5_bcs)).toEqual(false);

        let [r_6_bcs] = dynamic_object_field.exists__([a5.$type], id_0, a5);
        expect(bcs_import.bool().parse(r_6_bcs)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('add_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [counter_2] = dynamic_object_field_tests.new_(scenario);
        let [id_1_bcs] = object.id([counter_1.$type], counter_1)
        let id_1 = object.ID.bcs.parse(id_1_bcs);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        expect(() => dynamic_object_field.add([a0.$type, counter_2.$type], id_0, a0, counter_2))
                    .toThrowError("VMError with status ABORTED with sub status 0")

        test_scenario.end(scenario);
    });

    it('add_duplicate_mismatched_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [fake_id_0] = test_scenario.new_object(scenario);
        let fake_0 = new dynamic_object_field_tests.Fake(fake_id_0);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        expect(() => dynamic_object_field.add([a0.$type, fake_0.$type], id_0, a0, fake_0))
                    .toThrowError("VMError with status ABORTED with sub status 0")

        test_scenario.end(scenario);
    });

    it('borrow_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);

        expect(() => dynamic_object_field.borrow([a0.$type, counter_1.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 1")

        test_scenario.end(scenario);
    });

    it('borrow_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [fake_id_0] = test_scenario.new_object(scenario);
        let fake_0 = new dynamic_object_field_tests.Fake(fake_id_0);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        expect(() => dynamic_object_field.borrow([a0.$type, fake_0.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 2")

        test_scenario.end(scenario);
    });

    it('borrow_mut_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);

        expect(() => dynamic_object_field.borrow_mut([a0.$type, counter_1.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 1")

        test_scenario.end(scenario);
    });

    it('borrow_mut_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [fake_id_0] = test_scenario.new_object(scenario);
        let fake_0 = new dynamic_object_field_tests.Fake(fake_id_0);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        expect(() => dynamic_object_field.borrow_mut([a0.$type, fake_0.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 2")

        test_scenario.end(scenario);
    });

    it('remove_missing', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);

        expect(() => dynamic_object_field.remove([a0.$type, counter_1.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 1")

        test_scenario.end(scenario);
    });

    it('remove_wrong_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [fake_id_0] = test_scenario.new_object(scenario);
        let fake_0 = new dynamic_object_field_tests.Fake(fake_id_0);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        expect(() => dynamic_object_field.remove([a0.$type, fake_0.$type], id_0, a0))
                    .toThrowError("VMError with status ABORTED with sub status 2")

        test_scenario.end(scenario);
    });

    it('sanity_check_exists', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);

        let [r_0_bcs] = dynamic_object_field.exists__([a0.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_0_bcs)).toEqual(false);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        let [r_1_bcs] = dynamic_object_field.exists__([a0.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_1_bcs)).toEqual(true);

        let [r_2_bcs] = dynamic_object_field.exists__([a1.$type], id_0, a1);
        expect(bcs_import.bool().parse(r_2_bcs)).toEqual(false);

        test_scenario.end(scenario);
    });

    it('sanity_check_exists_with_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);

        let a0 = new U64(0);
        let a1 = new U8(0);

        let [counter_1] = dynamic_object_field_tests.new_(scenario);
        let [fake_id_0] = test_scenario.new_object(scenario);
        let fake_0 = new dynamic_object_field_tests.Fake(fake_id_0);

        let [r_0_bcs] = dynamic_object_field.exists_with_type([a0.$type, counter_1.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_0_bcs)).toEqual(false);

        let [r_1_bcs] = dynamic_object_field.exists_with_type([a0.$type, fake_0.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_1_bcs)).toEqual(false);

        dynamic_object_field.add([a0.$type, counter_1.$type], id_0, a0, counter_1);

        let [r_2_bcs] = dynamic_object_field.exists_with_type([a0.$type, counter_1.$type], id_0, a0);
        expect(bcs_import.bool().parse(r_2_bcs)).toEqual(true);

        let [r_3_bcs] = dynamic_object_field.exists_with_type([a1.$type, counter_1.$type], id_0, a1);
        expect(bcs_import.bool().parse(r_3_bcs)).toEqual(false);

        let [r_5_bcs] = dynamic_object_field.exists_with_type([a1.$type, fake_0.$type], id_0, a1);
        expect(bcs_import.bool().parse(r_5_bcs)).toEqual(false);

        test_scenario.end(scenario);
    });
});