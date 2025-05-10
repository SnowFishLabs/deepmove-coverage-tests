import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, U8, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { vector } from '../wrappers/dependencies/MoveStdlib/vector';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('vector_test', () => {
    it('test fun singleton', () => {
        let a0 = new U8(1);
        let [r0] = vector.singleton([U8.$type()], a0);

        expect(a0.from_bcs_vector_t(new Uint8Array(r0))).toEqual([a0]);
    });

    it('test fun reverse', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1]
        vector.reverse([U8.$type()], a2);
        expect(a2).toEqual([a1, a0]);
    });

    it('test fun append', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1]
        let a3 = new U8(255);
        vector.append([U8.$type()], a2, [a3]);
        expect(a2).toEqual([a0, a1, a3]);
    });

    it('test fun is_empty', () => {
        let a0 = new U8(1);
        let [r0] = vector.is_empty([U8.$type()], []);
        expect(bcs_import.bool().parse(r0)).toEqual(true);

        let [r1] = vector.is_empty([U8.$type()], [a0]);
        expect(bcs_import.bool().parse(r1)).toEqual(false);
    });

    it('test fun contains', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1];
        let a3 = new U8(200);
        let [r0] = vector.contains([U8.$type()], a2, a1);
        expect(bcs_import.bool().parse(r0)).toEqual(true);

        let [r1] = vector.contains([U8.$type()], a2, a3);
        expect(bcs_import.bool().parse(r1)).toEqual(false);
    });

    it('test fun index_of', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1];
        let [r0, r1] = vector.index_of([U8.$type()], a2, a1);
        expect(bcs_import.bool().parse(r0)).toEqual(true);
        expect(bcs_import.u64().parse(r1)).toEqual('1');
    });

    it('test fun remove', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1];
        let [r0] = vector.remove([U8.$type()], a2, 1);
        expect(a0.from_bcs_t(new Uint8Array(r0))).toEqual(a1);
    });

    it('test fun insert', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = [a0, a1];
        let a3 = new U8(200);
        vector.insert([U8.$type()], a2, a3, 1);
        expect(a2).toEqual([a0, a3, a1]);
    });

    it('test fun swap_remove', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a3 = new U8(200);
        let a2 = [a0, a1, a3];
        let [r0] = vector.swap_remove([U8.$type()], a2, 1);
        expect(a0.from_bcs_t(new Uint8Array(r0))).toEqual(a1);
    });

    it('test fun flatten', () => {
        let a0 = new U8(1);
        let a1 = new U8(100);
        let a2 = new U8(20);
        let a3 = new U8(200);
        let a5 = [[a0, a1], [a2, a3]];
        let [r0] = vector.flatten([U8.$type()], a5);
        expect(bcs_import.vector(U8.bcs).parse(new Uint8Array(r0))).toEqual([a0, a1, a2, a3]);
    });
});