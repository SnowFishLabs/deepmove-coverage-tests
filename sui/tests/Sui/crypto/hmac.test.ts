import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, afterTestAll, afterTest, beforeTest, get_wasm } from '@deepmove/sui';
import { hmac_tests } from '../../wrappers/dependencies/Sui/hmac_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('hmac_tests', () => {
    it('test_hmac_sha3_256', () => {
        hmac_tests.test_hmac_sha3_256();
    })
});