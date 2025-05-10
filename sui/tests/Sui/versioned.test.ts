import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { versioned } from '../wrappers/dependencies/Sui/versioned';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('versioned_tests', () => {
    it('test_upgrade', () => {
        let [ctx] = tx_context.dummy();
        let a1 = new U64(1000);
        let a2 = new U64(2000);
        let type0 = [U64.$type()];

        let [wrapper0_bcs] = versioned.create(type0, 1, a1, ctx);
        let wrappers0 = versioned.Versioned.bcs.parse(wrapper0_bcs);
        expect(wrappers0.version).toEqual("1");

        let [v0_bcs] = versioned.load_value(type0, wrappers0);
        let v0 = a1.from_bcs_t(v0_bcs);
        expect(v0).toEqual(a1);

        let [v1_bcs, v2_bcs] = versioned.remove_value_for_upgrade(type0, wrappers0);
        let v1 = a1.from_bcs_t(v1_bcs);
        expect(v1).toEqual(a1);
        let cap = versioned.VersionChangeCap.bcs.parse(v2_bcs);

        versioned.upgrade(type0, wrappers0, 2, a2, cap);
        let [v3] = versioned.version(wrappers0);
        expect(v3).toEqual("2");

        let [v5_bcs] = versioned.load_value(type0, wrappers0);
        let v5 = a1.from_bcs_t(v5_bcs);
        expect(v5).toEqual(a2);

        let [v6_bcs] = versioned.destroy(type0, wrappers0);
        let v6 = a1.from_bcs_t(v6_bcs);
        expect(v6).toEqual(a2);
    })
})