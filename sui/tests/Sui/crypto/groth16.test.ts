import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { groth16_tests } from '../../wrappers/dependencies/Sui/groth16_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('groth16_tests', () => {
    it('test_prepare_verifying_key_bls12381', () => {
        groth16_tests.test_prepare_verifying_key_bls12381();
        groth16_tests.test_verify_groth_16_proof_bls12381();
        groth16_tests.test_prepare_verifying_key_bn254();
        groth16_tests.test_verify_groth_16_proof_bn254();
    })
});