import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { poseidon_tests } from '../../wrappers/dependencies/Sui/poseidon_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('poseidon_tests', () => {
    it('test_poseidon_bn254_hash', () => {
        poseidon_tests.test_poseidon_bn254_hash();
        poseidon_tests.test_poseidon_bn254_canonical_input();
    })
});