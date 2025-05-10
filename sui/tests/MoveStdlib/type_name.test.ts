import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { type_name } from '../wrappers/dependencies/MoveStdlib/type_name';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('type_name_test', () => {
    it('test fun utf8', () => {
        let [r0] = type_name.is_primitive(new type_name.TypeName("bool"));
        expect(r0).toEqual(true);

        let [r1] = type_name.is_primitive(new type_name.TypeName("string"));
        expect(r1).toEqual(false);
    });

    it('test fun borrow_string', () => {
        let [r0] = type_name.borrow_string(new type_name.TypeName("bool"));
        expect(r0).toEqual("bool");

        let [r1] = type_name.borrow_string(new type_name.TypeName("string"));
        expect(r1).toEqual("string");
    });

    it('test fun get_address', () => {
        let [r0] = type_name.get_address(new type_name.TypeName("0000000000000000000000000000000000000000000000000000000000000002::object::UID"));
        expect(r0).toEqual("0000000000000000000000000000000000000000000000000000000000000002");
    });

    it('test fun get_module', () => {
        let [r0] = type_name.get_module(new type_name.TypeName("0000000000000000000000000000000000000000000000000000000000000002::object::UID"));
        expect(r0).toEqual("object");
    });

    it('test fun into_string', () => {
        let [r0] = type_name.into_string(new type_name.TypeName("000000000000000000000000000000000000000000000000000000000000000a::type_name_tests::TestMultiGenerics<bool,u64,u128>"));
        expect(r0).toEqual("000000000000000000000000000000000000000000000000000000000000000a::type_name_tests::TestMultiGenerics<bool,u64,u128>");
    });
});