import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { vec_set } from '../wrappers/dependencies/Sui/vec_set';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('vec_set_tests', () => {
    it('duplicate_key_abort', () => {
        let a0 = new U8(1);

        let type0 = [U8.$type()];

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;

        vec_set.insert(type0, m0, a0);

        expect(() => vec_set.insert(type0, m0, a0))
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    })

    it('nonexistent_key_remove', () => {
        let a0 = new U8(1);
        let a1 = new U8(2);

        let type0 = [U8.$type()];

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;

        vec_set.insert(type0, m0, a0);

        expect(() => vec_set.remove(type0, m0, a1))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    })

    it('smoke', () => {
        let a0 = new U8(1);
        let a1 = new U8(2);

        let type0 = [U8.$type()];

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;

        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            vec_set.insert(type0, m0, new U8(k));
        }

        let [v0_bcs] = vec_set.size(type0, m0);
        expect(bcs_import.u64().parse(v0_bcs)).toEqual("10");

        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            let [v1_bcs] = vec_set.contains(type0, m0, new U8(k));
            expect(bcs_import.bool().parse(v1_bcs)).toEqual(true);
        }

        let [keys_bcs] = vec_set.into_keys(type0, m0);
        let keys = bcs_import.vector(U8.bcs).parse(keys_bcs);
        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            vec_set.remove(type0, m0, new U8(k));
            expect(keys[i]).toEqual(new U8(k));
        }
    })

    it('test_keys', () => {
        let a0 = new U8(1);
        let a1 = new U8(2);
        let a2 = new U8(3);

        let type0 = [U8.$type()];

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;

        vec_set.insert(type0, m0, a0);
        vec_set.insert(type0, m0, a1);
        vec_set.insert(type0, m0, a2);

        let [v0_bcs] = vec_set.size(type0, m0);
        expect(bcs_import.u64().parse(v0_bcs)).toEqual("3");

        let [keys_bcs] = vec_set.keys(type0, m0);
        let keys = bcs_import.vector(U8.bcs).parse(keys_bcs);

        expect(keys).toEqual([a0, a1, a2]);
    })

    it('round_trip', () => {
        let type0 = [U8.$type()];

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;

        for (var i = 0; i < 50; i++) {
            let k = i + 2;
            let a0 = new U8(k);
            vec_set.insert(type0, m0, a0);

            let [keys_bcs] = vec_set.into_keys(type0, m0);
            let keys = bcs_import.vector(U8.bcs).parse(keys_bcs);
            let [v0_bcs] = vec_set.from_keys(type0, keys);
            let s2 = m0.from_bcs_t(v0_bcs);
            expect(s2.contents).toEqual(m0.contents);
        }
    })

    it('from_keys_values_duplicate_key_abort', () => {
        let type0 = [U8.$type()];
        let a0 = new U8(1);
        let a1 = new U8(0);

        let m0 = new vec_set.VecSet<U8>([]);
        m0.T0_bcs = U8.bcs;
        
        expect(() => vec_set.from_keys(type0, [a0, a1, a0]))
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    })
});