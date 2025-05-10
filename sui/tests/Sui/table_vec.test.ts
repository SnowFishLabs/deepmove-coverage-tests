import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { table_vec } from '../wrappers/dependencies/Sui/table_vec';
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

        let a0 = new U64(0);
        let a1 = new U64(7);
        let a2 = new U64(5);

        let [table_vec_0_bcs] = table_vec.empty([a0.$type], scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        let [v_0_bcs] = table_vec.length([a0.$type], table_vec_0);

        expect(bcs_import.u64().parse(v_0_bcs)).toEqual("0");

        table_vec.push_back([a0.$type], table_vec_0, a1);

        let [v_1_bcs] = table_vec.borrow([a0.$type], table_vec_0, 0);
        expect(a1.from_bcs_t(v_1_bcs)).toEqual(a1);

        table_vec.push_back([a0.$type], table_vec_0, a2);
        table_vec.swap([a0.$type], table_vec_0, 0, 1);

        let [v_2_bcs] = table_vec.swap_remove([a0.$type], table_vec_0, 0);
        expect(a2.from_bcs_t(v_2_bcs)).toEqual(a2);

        let [v_3_bcs] = table_vec.pop_back([a0.$type], table_vec_0);
        expect(a1.from_bcs_t(v_3_bcs)).toEqual(a1);

        table_vec.destroy_empty([a0.$type], table_vec_0);
        test_scenario.end(scenario);
    })

    it('destroy_non_empty_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.destroy_empty([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('pop_back_empty_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.empty([a0.$type], scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.pop_back([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        table_vec.destroy_empty([a0.$type], table_vec_0)

        test_scenario.end(scenario);
    });

    it('borrow_out_of_bounds_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.borrow([a0.$type], table_vec_0, 77))
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        expect(() => table_vec.destroy_empty([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('borrow_mut_out_of_bounds_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.borrow_mut([a0.$type], table_vec_0, 77))
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        expect(() => table_vec.destroy_empty([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('swap_out_of_bounds_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.swap([a0.$type], table_vec_0, 0, 77))
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        expect(() => table_vec.destroy_empty([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('swap_same_index_succeeds', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        table_vec.swap([a0.$type], table_vec_0, 0, 0)

        table_vec.pop_back([a0.$type], table_vec_0)
        
        table_vec.destroy_empty([a0.$type], table_vec_0)

        test_scenario.end(scenario);
    });

    it('swap_same_index_out_of_bounds_aborts', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let a0 = new U64(1);

        let [table_vec_0_bcs] = table_vec.singleton([a0.$type], a0, scenario.ctx);
        let table_vec_0 = table_vec.TableVec.bcs.parse(table_vec_0_bcs);

        expect(() => table_vec.swap([a0.$type], table_vec_0, 77, 77))
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        expect(() => table_vec.destroy_empty([a0.$type], table_vec_0))
            .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });
});