import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { verifier_tests } from '../wrappers/dependencies/Sui/verifier_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('verifier_tests', () => {
    it('test_init', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let otw = new verifier_tests.VERIFIER_TESTS(true);

        verifier_tests.init(otw, scenario.ctx);

        test_scenario.end(scenario);
    })

    it('test_otw', () => {
        let otw = new verifier_tests.VERIFIER_TESTS(true);

        let [v0] = verifier_tests.is_otw(otw);
        expect(v0).toEqual(true);
    })
})