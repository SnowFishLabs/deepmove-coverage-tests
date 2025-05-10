import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { bag } from '../wrappers/dependencies/Sui/bag';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('bag_test', () => {
    it('simple_all_functions', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);
        
        let a0 = new String("hello");
        let a1 = new U64(0);
        let a2 = new U64(1);
        let a3 = new U8(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);
        bag.add([a2.$type, a3.$type], bag_0, a2, a3);

        let [r0] = bag.contains_with_type([a0.$type, a1.$type], bag_0, a0);
        let [r1] = bag.contains_with_type([a2.$type, a3.$type], bag_0, a2);

        expect(bcs_import.bool().parse(r0)).toEqual(true);
        expect(bcs_import.bool().parse(r1)).toEqual(true);

        let [r2] = bag.borrow([a0.$type, a1.$type], bag_0, a0);
        let [r3] = bag.borrow([a2.$type, a3.$type], bag_0, a2);

        expect(a1.from_bcs_t(r2)).toEqual(a1);
        expect(a3.from_bcs_t(r3)).toEqual(a3);

        let [r5] = bag.remove([a0.$type, a1.$type], bag_0, a0);
        let [r6] = bag.remove([a2.$type, a3.$type], bag_0, a2);
        expect(a1.from_bcs_t(r5)).toEqual(a1);
        expect(a3.from_bcs_t(r6)).toEqual(a3);

        let [r7] = bag.contains_with_type([a0.$type, a1.$type], bag_0, a0);
        let [r8] = bag.contains_with_type([a2.$type, a3.$type], bag_0, a2);

        expect(bcs_import.bool().parse(r7)).toEqual(false);
        expect(bcs_import.bool().parse(r8)).toEqual(false);

        test_scenario.end(scenario);
        bag.destroy_empty(bag_0);
    });

    it('add_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);
        let a2 = new String("hello");
        let a3 = new U64(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);
        expect(() => bag.add([a2.$type, a3.$type], bag_0, a2, a3)).toThrowError("VMError with status ABORTED with sub status 0")
        test_scenario.end(scenario);
    });

    it('add_duplicate_mismatched_type', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);
        let a2 = new String("hello");
        let a3 = new U8(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);
        expect(() => bag.add([a2.$type, a3.$type], bag_0, a2, a3)).toThrowError("VMError with status ABORTED with sub status 0")
        test_scenario.end(scenario);
    });

    it('borrow_missing', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);

        expect(() => bag.borrow([a0.$type, a1.$type], bag_0, a0)).toThrowError("VMError with status ABORTED with sub status 1")
        test_scenario.end(scenario);
    });

    it('borrow_wrong_type', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);
        let a2 = new String("hello");
        let a3 = new U8(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);
        expect(() => bag.borrow([a2.$type, a3.$type], bag_0, a2)).toThrowError("VMError with status ABORTED with sub status 2")
        test_scenario.end(scenario);
    });

    it('remove_missing', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);

        expect(() => bag.remove([a0.$type, a1.$type], bag_0, a0)).toThrowError("VMError with status ABORTED with sub status 1")
        test_scenario.end(scenario);
    });

    it('remove_wrong_type', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);
        let a2 = new String("hello");
        let a3 = new U8(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);

        expect(() => bag.remove([a2.$type, a3.$type], bag_0, a2)).toThrowError("VMError with status ABORTED with sub status 2")
        test_scenario.end(scenario);
    });

    it('destroy_non_empty', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new String("hello");
        let a1 = new U64(0);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);

        expect(() => bag.destroy_empty(bag_0)).toThrowError("VMError with status ABORTED with sub status 0")
        test_scenario.end(scenario);
    });

    it('sanity_check_contains', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let a0 = new U64(0);
        let a1 = new U64(0);
        let a2 = new U64(1);
        let a3 = new U8(1);

        let [r0] = bag.contains_with_type([a0.$type, a1.$type], bag_0, a0);
        expect(bcs_import.bool().parse(r0)).toEqual(false);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);

        let [r1] = bag.contains_with_type([a0.$type, a1.$type], bag_0, a0);
        expect(bcs_import.bool().parse(r1)).toEqual(true);

        let [r2] = bag.contains_with_type([a2.$type, a1.$type], bag_0, a2);
        expect(bcs_import.bool().parse(r2)).toEqual(false);

        bag.remove([a0.$type, a1.$type], bag_0, a0);

        bag.destroy_empty(bag_0);
        test_scenario.end(scenario);
    });

    it('sanity_check_size', () => {
        refresh_vm();
        
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [bag_0] = bag.new_(scenario.ctx);

        let [r0] = bag.is_empty(bag_0);
        let [r1] = bag.length(bag_0);
        expect(r0).toEqual(true);
        expect(r1).toEqual("0");

        let a0 = new U64(0);
        let a1 = new U64(0);
        let a2 = new U64(1);
        let a3 = new U8(1);

        bag.add([a0.$type, a1.$type], bag_0, a0, a1);
        let [r2] = bag.is_empty(bag_0);
        let [r3] = bag.length(bag_0);
        expect(r2).toEqual(false);
        expect(r3).toEqual("1");

        bag.add([a2.$type, a3.$type], bag_0, a2, a3);
        let [r5] = bag.is_empty(bag_0);
        let [r6] = bag.length(bag_0);
        expect(r5).toEqual(false);
        expect(r6).toEqual("2");

        bag.remove([a0.$type, a1.$type], bag_0, a0);
        bag.remove([a2.$type, a3.$type], bag_0, a2);

        bag.destroy_empty(bag_0);
        test_scenario.end(scenario);
    });
})