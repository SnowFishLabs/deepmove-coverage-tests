import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { clock } from '../wrappers/dependencies/Sui/clock';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('clock_test', () => {
    it('creating_a_clock_and_incrementing_it', () => {
        let [ctx] = tx_context.dummy();
        
        let [clock_0] = clock.create_for_testing(ctx);

        clock.increment_for_testing(clock_0, 42);

        let [time_ms_0] = clock.timestamp_ms(clock_0);
        expect(time_ms_0).toEqual("42");

        clock.set_for_testing(clock_0, 50);

        let [time_ms_1] = clock.timestamp_ms(clock_0);
        expect(time_ms_1).toEqual("50");

        clock.destroy_for_testing(clock_0);
    })
})