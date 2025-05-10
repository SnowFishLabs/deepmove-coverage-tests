import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { vdf_tests } from '../../wrappers/dependencies/Sui/vdf_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('vdf_tests', () => {
    it('test_hash_to_input', () => {
        vdf_tests.test_hash_to_input();
        vdf_tests.test_vdf_verify();
    })
});