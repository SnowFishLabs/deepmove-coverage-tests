import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { vec_map } from '../wrappers/dependencies/Sui/vec_map';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('vec_map_tests', () => {
    it('duplicate_key_abort', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.insert(type0, m0, a0, a2))
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    })

    it('nonexistent_key_get', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(2);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.get(type0, m0, a2))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    })

    it('nonexistent_key_get_idx_or_abort', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(2);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.get_idx(type0, m0, a2))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    })

    it('out_of_bounds_get_entry_by_idx', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U64(1);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.get_entry_by_idx(type0, m0, 1))
            .toThrowError("VMError with status ABORTED with sub status " + 3);
    })

    it('out_of_bounds_remove_entry_by_idx', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U64(1);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.remove_entry_by_idx(type0, m0, 1))
            .toThrowError("VMError with status ABORTED with sub status " + 3);
    })

    it('remove_entry_by_idx', () => {
        let a0 = new U8(5);
        let a1 = new U8(50);
        let a2 = new U8(6);
        let a3 = new U8(60);
        let a5 = new U8(7);
        let a6 = new U8(70);

        let m0 = new vec_map.VecMap<U8, U8>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = U8.bcs;

        let type0 = [U8.$type(), U8.$type()];

        vec_map.insert(type0, m0, a0, a1);
        vec_map.insert(type0, m0, a2, a3);
        vec_map.insert(type0, m0, a5, a6);

        let [v_0_bcs, v_1_bcs] = vec_map.remove_entry_by_idx(type0, m0, 0);
        let v_0 = a0.from_bcs_t(v_0_bcs);
        let v_1 = a1.from_bcs_t(v_1_bcs);

        let [v_2_bcs] = vec_map.size(type0, m0);
        let v_2 = bcs_import.u64().parse(v_2_bcs);

        expect(v_0).toEqual(a0);
        expect(v_1).toEqual(a1);
        expect(v_2).toEqual("2");

        let [a_0_bcs, a_1_bcs] = vec_map.remove_entry_by_idx(type0, m0, 1);
        let v_5 = a0.from_bcs_t(a_0_bcs);
        let v_6 = a1.from_bcs_t(a_1_bcs);

        let [a_2_bcs] = vec_map.size(type0, m0);
        let v_7 = bcs_import.u64().parse(a_2_bcs);

        expect(v_5).toEqual(a5);
        expect(v_6).toEqual(a6);
        expect(v_7).toEqual("1");
    })

    it('destroy_non_empty', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);

        expect(() => vec_map.destroy_empty(type0, m0))
            .toThrowError("VMError with status ABORTED with sub status " + 2);
    })

    it('destroy_empty', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        let [v_0_bcs] = vec_map.is_empty(type0, m0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        vec_map.destroy_empty(type0, m0);
    })

    it('smoke', () => {
        let type0 = [U8.$type(), U8.$type()];

        let m0 = new vec_map.VecMap<U8, U8>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = U8.bcs;

        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            let v = i + 5;

            vec_map.insert(type0, m0, new U8(k), new U8(v));
        }

        let [v_0_bcs] = vec_map.is_empty(type0, m0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);

        let [v_1_bcs] = vec_map.size(type0, m0);
        expect(bcs_import.u64().parse(v_1_bcs)).toEqual("10");

        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            let v = i + 5;

            let a0 = new U8(k);
            let [v_2_bcs] = vec_map.contains(type0, m0, a0);
            expect(bcs_import.bool().parse(v_2_bcs)).toEqual(true);

            let [v_3_bcs] = vec_map.get(type0, m0, a0);
            let a1 = a0.from_bcs_t(v_3_bcs);
            expect(a1).toEqual(new U8(v));

            let [v_5_bcs] = vec_map.get_idx(type0, m0, a0);
            expect(BigInt(bcs_import.u64().parse(v_5_bcs))).toEqual(BigInt(i));

            let [v_6_bcs, v_7_bcs] = vec_map.get_entry_by_idx(type0, m0, i);
            expect(a0.from_bcs_t(v_6_bcs)).toEqual(new U8(k));
            expect(a0.from_bcs_t(v_7_bcs)).toEqual(new U8(v));
        }

        let [v_8_bcs, v_9_bcs] = vec_map.into_keys_values(type0, m0);
        let keys0 = bcs_import.vector(U8.bcs).parse(v_8_bcs);
        let value0 = bcs_import.vector(U8.bcs).parse(v_9_bcs);

        for (var i = 0; i < 10; i++) {
            let k = i + 2;
            let v = i + 5;
            let a0 = new U8(k);
            let a1 = new U8(v);
            let [v_10_bcs, v_11_bcs] = vec_map.remove(type0, m0, a0);
            expect(a0.from_bcs_t(v_10_bcs)).toEqual(a0);
            expect(a0.from_bcs_t(v_11_bcs)).toEqual(a1);
            expect(keys0[i]).toEqual(a0);
            expect(value0[i]).toEqual(a1);
        }
    })

    it('return_list_of_keys', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(5);
        let a3 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        let m0 = new vec_map.VecMap<U8, Boolean>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = Boolean.bcs;

        vec_map.insert(type0, m0, a0, a1);
        vec_map.insert(type0, m0, a2, a3);

        let [v_0_bcs] = vec_map.keys(type0, m0);
        let keys0 = bcs_import.vector(U8.bcs).parse(v_0_bcs);

        expect(keys0).toEqual([a0, a2]);
    })

    it('round_trip', () => {
        let a0 = new U8(1);
        let a1 = new String("x");

        let type0 = [U8.$type(), String.$type()];

        let m0 = new vec_map.VecMap<U8, String>([]);
        m0.T0_bcs = U8.bcs;
        m0.T1_bcs = String.bcs;

        let [m1_bcs] = vec_map.from_keys_values(type0, [], []);
        let m1 = m0.from_bcs_t(m1_bcs);

        expect(m0.contents).toEqual(m1.contents);

        for (var i = 0; i < 50; i++) {
            let k = i + 2;
            vec_map.insert(type0, m0, new U8(k), a1);

            let [v_0_bcs, v_1_bcs] = vec_map.into_keys_values(type0, m0);
            let keys0 = bcs_import.vector(U8.bcs).parse(v_0_bcs);
            let value0 = bcs_import.vector(String.bcs).parse(v_1_bcs);
            let [m2_bcs] = vec_map.from_keys_values(type0, keys0, value0);
            let m2 = m0.from_bcs_t(m2_bcs);
            expect(m0.contents).toEqual(m2.contents);
        }
    })

    it('mismatched_key_values_1', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(5);
        let a3 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        expect(() => vec_map.from_keys_values(type0, [a0], []))
                    .toThrowError("VMError with status ABORTED with sub status " + 5)
    })

    it('mismatched_key_values_2', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(5);
        let a3 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        expect(() => vec_map.from_keys_values(type0, [], [a1]))
                    .toThrowError("VMError with status ABORTED with sub status " + 5)
    })

    it('mismatched_key_values_3', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(5);
        let a3 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        expect(() => vec_map.from_keys_values(type0, [a0, a0], [a1]))
                    .toThrowError("VMError with status ABORTED with sub status " + 5)
    })

    it('from_keys_values_duplicate_key_abort', () => {
        let a0 = new U8(1);
        let a1 = new Boolean(true);
        let a2 = new U8(5);
        let a3 = new Boolean(false);

        let type0 = [U8.$type(), Boolean.$type()];

        expect(() => vec_map.from_keys_values(type0, [a0, a0], [a1, a1]))
                    .toThrowError("VMError with status ABORTED with sub status " + 0)
    })
});