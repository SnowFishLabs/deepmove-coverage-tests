import { afterAll, afterEach, beforeEach, describe, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { ecvrf_tests } from '../../wrappers/dependencies/Sui/ecvrf_tests';

let package_path = process.cwd()

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('ecvrf_tests', () => {
    it('test_ecvrf_verify', () => {
        ecvrf_tests.test_ecvrf_verify();
        ecvrf_tests.test_ecvrf_invalid();
    })
});