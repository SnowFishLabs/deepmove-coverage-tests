import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, afterTestAll, afterTest, beforeTest, get_wasm } from '@deepmove/sui';
import { borrow_ as borrow } from '../wrappers/dependencies/Sui/borrow';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('borrow_test', () => {
    it('test_borrow', () => {
        let [ctx] = tx_context.dummy();
        let [uid] = object.new_(ctx);
        let test_0 = new borrow.Test(uid);

        let [ref_bcs] = borrow.new_([test_0.$type], test_0, ctx);

        let ref = borrow.Referent.bcs(test_0.get_bcs()).parse(ref_bcs);

        // Option<T0> need to set value_bcs to T0
        ref.T0_bcs = test_0.get_bcs();

        let [value_0_bcs, borrow_0_bcs] = borrow.borrow([test_0.$type], ref);

        let value_0 = test_0.from_bcs_t(value_0_bcs);
        let borrow_0 = borrow.Borrow.bcs.parse(borrow_0_bcs);

        borrow.put_back([test_0.$type], ref, value_0, borrow_0);

        let [test_1_bcs] = borrow.destroy([test_0.$type], ref);
        let test_1 = test_0.from_bcs_t(test_1_bcs);

        expect(test_0).toEqual(test_1);
    })

    it('test_object_swap', () => {
        let [ctx] = tx_context.dummy();
        let [uid_0] = object.new_(ctx);
        let test_0 = new borrow.Test(uid_0);
        let [ref_bcs_0] = borrow.new_([test_0.$type], test_0, ctx);
        let ref_0 = borrow.Referent.bcs(test_0.get_bcs()).parse(ref_bcs_0);
        // Option<T0> need to set value_bcs to T0
        ref_0.T0_bcs = test_0.get_bcs();

        let [uid_1] = object.new_(ctx);
        let test_1 = new borrow.Test(uid_1);
        let [ref_bcs_1] = borrow.new_([test_1.$type], test_1, ctx);
        let ref_1 = borrow.Referent.bcs(test_1.get_bcs()).parse(ref_bcs_1);
        ref_1.T0_bcs = test_1.get_bcs(); 

        let [value_0_bcs, borrow_0_bcs] = borrow.borrow([test_0.$type], ref_0);

        let value_0 = test_0.from_bcs_t(value_0_bcs);
        let borrow_0 = borrow.Borrow.bcs.parse(borrow_0_bcs);

        let [value_1_bcs, borrow_1_bcs] = borrow.borrow([test_1.$type], ref_1);

        let value_1 = test_0.from_bcs_t(value_1_bcs);
        let borrow_1 = borrow.Borrow.bcs.parse(borrow_1_bcs);

        expect(() => borrow.put_back([test_0.$type], ref_0, value_1, borrow_0)).toThrowError("VMError with status ABORTED with sub status 1")
        expect(() => borrow.put_back([test_1.$type], ref_1, value_0, borrow_1)).toThrowError("VMError with status ABORTED with sub status 1")
      
        expect(() => borrow.destroy([test_0.$type], ref_0)).toThrowError("VMError with status ABORTED with sub status " + 0x40001);
        expect(() => borrow.destroy([test_1.$type], ref_1)).toThrowError("VMError with status ABORTED with sub status " + 0x40001);
    })

    it('test_borrow_fail', () => {
        let [ctx] = tx_context.dummy();
        let [uid_0] = object.new_(ctx);
        let test_0 = new borrow.Test(uid_0);
        let [ref_bcs_0] = borrow.new_([test_0.$type], test_0, ctx);
        let ref_0 = borrow.Referent.bcs(test_0.get_bcs()).parse(ref_bcs_0);
        // Option<T0> need to set value_bcs to T0
        ref_0.T0_bcs = test_0.get_bcs();

        let [uid_1] = object.new_(ctx);
        let test_1 = new borrow.Test(uid_1);
        let [ref_bcs_1] = borrow.new_([test_1.$type], test_1, ctx);
        let ref_1 = borrow.Referent.bcs(test_1.get_bcs()).parse(ref_bcs_1);
        ref_1.T0_bcs = test_1.get_bcs(); 

        let [value_0_bcs, borrow_0_bcs] = borrow.borrow([test_0.$type], ref_0);

        let value_0 = test_0.from_bcs_t(value_0_bcs);
        let borrow_0 = borrow.Borrow.bcs.parse(borrow_0_bcs);

        let [value_1_bcs, borrow_1_bcs] = borrow.borrow([test_1.$type], ref_1);

        let value_1 = test_0.from_bcs_t(value_1_bcs);
        let borrow_1 = borrow.Borrow.bcs.parse(borrow_1_bcs);

        expect(() => borrow.put_back([test_0.$type], ref_0, value_1, borrow_1)).toThrowError("VMError with status ABORTED with sub status 0")
        expect(() => borrow.put_back([test_1.$type], ref_1, value_0, borrow_0)).toThrowError("VMError with status ABORTED with sub status 0")
      
        expect(() => borrow.destroy([test_0.$type], ref_0))
            .toThrowError("VMError with status ABORTED with sub status " + 0x40001);
        expect(() => borrow.destroy([test_1.$type], ref_1)).toThrowError("VMError with status ABORTED with sub status " + 0x40001);
    })
});