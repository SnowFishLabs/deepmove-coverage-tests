import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { ed25519_tests } from '../../wrappers/dependencies/Sui/ed25519_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('ed25519_tests', () => {
    it('test_ed25519_valid_sig', () => {
        ed25519_tests.test_ed25519_valid_sig();
        ed25519_tests.test_ed25519_invalid_sig();
        ed25519_tests.test_ed25519_invalid_pubkey();
    })
});