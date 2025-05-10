import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { zklogin_verified_issuer_tests } from '../../wrappers/dependencies/Sui/zklogin_verified_issuer_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('zklogin_verified_issuer_tests', () => {
    it('test_check_zklogin_issuer', () => {
        zklogin_verified_issuer_tests.test_check_zklogin_issuer()
        zklogin_verified_issuer_tests.test_verified_issuer()

        expect(() => zklogin_verified_issuer_tests.test_invalid_verified_issuer())
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    })
});