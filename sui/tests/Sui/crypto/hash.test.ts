import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { hash_tests } from '../../wrappers/dependencies/Sui/hash_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('hash_tests', () => {
    it('test_keccak256_hash', () => {
        hash_tests.test_keccak256_hash();
        hash_tests.test_blake2b256_hash();
    })
});