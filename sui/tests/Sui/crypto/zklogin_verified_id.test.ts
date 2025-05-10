import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { zklogin_verified_id_tests } from '../../wrappers/dependencies/Sui/zklogin_verified_id_tests';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('zklogin_verified_id_tests', () => {
    it('test_check_zklogin_id', () => {
        expect(() => zklogin_verified_id_tests.test_check_zklogin_id())
            .toThrowError("VMError with status ABORTED with sub status " + 0);

        expect(() => zklogin_verified_id_tests.test_verified_id())
            .toThrowError("VMError with status ABORTED with sub status " + 0);
    })
});