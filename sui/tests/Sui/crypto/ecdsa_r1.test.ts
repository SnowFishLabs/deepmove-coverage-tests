import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { ecdsa_r1_tests } from '../../wrappers/dependencies/Sui/ecdsa_r1_tests';

let package_path = "E:/projects/wasm_test/"

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('ecdsa_r1_tests', () => {
    it('test_ecrecover_pubkey', () => {
        ecdsa_r1_tests.test_ecrecover_pubkey();
        ecdsa_r1_tests.test_secp256r1_verify_fails_with_recoverable_sig();
        ecdsa_r1_tests.test_secp256r1_verify_success_with_nonrecoverable_sig();
        ecdsa_r1_tests.test_secp256r1_invalid_public_key_length();
    })
});