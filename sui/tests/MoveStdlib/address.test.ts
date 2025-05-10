import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { address } from '../wrappers/dependencies/MoveStdlib/address';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('address_test', () => {
    it('test length', () => {
        let [length] = address.length();
        expect(length).toEqual('32');
    });
})