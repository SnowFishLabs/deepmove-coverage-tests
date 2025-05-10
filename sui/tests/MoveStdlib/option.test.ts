import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, U8, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('option_test', () => {
    it('test fun none', () => {
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        expect(b0.vec.length).toEqual(0);
    });

    it('test fun some', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        expect(b0.vec.length).toEqual(1);
        expect(b0.vec[0]).toEqual(a0);
    });

    it('test fun is_none', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.is_none([U8.$type()], b0);
        expect(bcs_import.bool().parse(r1)).toEqual(false);

        let [r2] = option.none([U8.$type()]);

        let b1 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r2));
        b1.T0_bcs = U8.bcs;
        let [r3] = option.is_none([U8.$type()], b1);
        expect(bcs_import.bool().parse(r3)).toEqual(true);
    });

    it('test fun is_some', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.is_some([U8.$type()], b0);
        expect(bcs_import.bool().parse(r1)).toEqual(true);

        let [r2] = option.none([U8.$type()]);

        let b1 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r2));
        b1.T0_bcs = U8.bcs;
        let [r3] = option.is_some([U8.$type()], b1);
        expect(bcs_import.bool().parse(r3)).toEqual(false);
    });

    it('test fun contains', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.contains([U8.$type()], b0, a0);
        expect(bcs_import.bool().parse(r1)).toEqual(true);
    });

    it('test fun borrow', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.borrow([U8.$type()], b0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun borrow_with_default', () => {
        let a0 = new U8(12);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        let [r1] = option.borrow_with_default([U8.$type()], b0, a0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun get_with_default', () => {
        let a0 = new U8(12);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        let [r1] = option.get_with_default([U8.$type()], b0, a0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun fill', () => {
        let a0 = new U8(12);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        option.fill([U8.$type()], b0, a0);

        expect(b0.vec[0]).toEqual(a0);
    });

    it('test fun extract', () => {
        let a0 = new U8(12);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        option.fill([U8.$type()], b0, a0);

        let [r1] = option.extract([U8.$type()], b0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun borrow_mut', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.borrow_mut([U8.$type()], b0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun swap', () => {
        let a0 = new U8(12);
        let a1 = new U8(120);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.swap([U8.$type()], b0, a1);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun swap_or_fill', () => {
        let a0 = new U8(12);
        let a1 = new U8(120);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.swap_or_fill([U8.$type()], b0, a1);
        expect(b0.from_bcs_t(new Uint8Array(r1)).vec[0]).toEqual(a0);
    });

    it('test fun destroy_with_default_some', () => {
        let a0 = new U8(12);
        let a1 = new U8(120);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.destroy_with_default([U8.$type()], b0, a1);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun destroy_with_default_none', () => {
        let a1 = new U8(120);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        let [r1] = option.destroy_with_default([U8.$type()], b0, a1);
        expect(a1.from_bcs_t(new Uint8Array(r1))).toEqual(a1);
    });

    it('test fun destroy_some', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.destroy_some([U8.$type()], b0);
        expect(a0.from_bcs_t(new Uint8Array(r1))).toEqual(a0);
    });

    it('test fun destroy_none', () => {
        let a1 = new U8(120);
        let [r0] = option.none([U8.$type()]);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));
        b0.T0_bcs = U8.bcs;

        option.destroy_none([U8.$type()], b0);
    });

    it('test fun to_vec', () => {
        let a0 = new U8(12);
        let [r0] = option.some([U8.$type()], a0);

        let b0 = option.Option.from_bcs<U8>(option.Option.bcs(U8.bcs).parse(r0));

        let [r1] = option.to_vec([U8.$type()], b0);
        expect(a0.from_bcs_vector_t(new Uint8Array(r1))).toEqual([a0]);
    });
})