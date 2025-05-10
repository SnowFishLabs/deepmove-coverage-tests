import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { ecdsa_k1_tests } from '../../wrappers/dependencies/Sui/ecdsa_k1_tests';
import { fromHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('ecdsa_k1_tests', () => {
    it('test_ecrecover_pubkey', () => {
        ecdsa_k1_tests.test_ecrecover_pubkey();
        ecdsa_k1_tests.test_secp256k1_verify_fails_with_recoverable_sig();
        ecdsa_k1_tests.test_secp256k1_verify_success_with_nonrecoverable_sig();
        ecdsa_k1_tests.test_secp256k1_invalid();
        ecdsa_k1_tests.test_ecrecover_eth_address();
        ecdsa_k1_tests.test_sign();
        ecdsa_k1_tests.test_sign_recoverable();
        ecdsa_k1_tests.test_generate_keypair();
    })
});