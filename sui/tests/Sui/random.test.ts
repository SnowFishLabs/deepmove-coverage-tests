import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { random } from '../wrappers/dependencies/Sui/random';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd()

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('random_tests', () => {
    it('random_test_basic_flow', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        let hex_0 = fromHex("1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F");

        let num_0: number[] = Array.from(hex_0);

        random.update_randomness_state_for_testing(random_state_0, 0, num_0, scenario.ctx);

        let [gen_0] = random.new_generator(random_state_0, scenario.ctx);

        let [random_0] = random.generate_u256(gen_0);

        test_scenario.return_shared([random.Random.$type()], random_state_0);

        test_scenario.end(scenario);
    })

    it('test_new_generator', () => {
        refresh_vm();

        let global_random1 = Array.from(fromHex("1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F"));
        let global_random2 = Array.from(fromHex("2F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1A"));

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario_0] = test_scenario.begin(caller);

        // Create Random
        random.create_for_testing(scenario_0.ctx);
        test_scenario.end(scenario_0);

        // Set random to global_random1
        let [scenario_1] = test_scenario.begin(caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario_1);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        random.update_randomness_state_for_testing(random_state_0, 0, global_random1, scenario_1.ctx);

        test_scenario.next_tx(scenario_1, caller);

        let [gen_0] = random.new_generator(random_state_0, scenario_1.ctx);
        test_scenario.return_shared([random.Random.$type()], random_state_0);

        test_scenario.end(scenario_1);

        // Set random again to global_random1
        let [scenario_2] = test_scenario.begin(caller);

        let [random_state_1_bcs] = test_scenario.take_shared([random.Random.$type()], scenario_2);
        let random_state_1 = random.Random.bcs.parse(random_state_1_bcs);

        random.update_randomness_state_for_testing(random_state_1, 1, global_random1, scenario_2.ctx);

        test_scenario.next_tx(scenario_2, caller);

        let [gen_1] = random.new_generator(random_state_1, scenario_2.ctx);
        test_scenario.return_shared([random.Random.$type()], random_state_1);

        test_scenario.end(scenario_2);

        // Set random to global_random2
        let [scenario_3] = test_scenario.begin(caller);

        let [random_state_2_bcs] = test_scenario.take_shared([random.Random.$type()], scenario_3);
        let random_state_2 = random.Random.bcs.parse(random_state_2_bcs);

        random.update_randomness_state_for_testing(random_state_2, 2, global_random2, scenario_3.ctx);

        test_scenario.next_tx(scenario_3, caller);

        let [gen_2] = random.new_generator(random_state_1, scenario_3.ctx);
        let [gen_3] = random.new_generator(random_state_1, scenario_3.ctx);

        test_scenario.return_shared([random.Random.$type()], random_state_2);

        test_scenario.end(scenario_3);

        let [v_0] = random.generator_counter(gen_0);
        expect(v_0).toEqual(0);

        let [v_1] = random.generator_buffer(gen_0);
        expect(v_1.length).toEqual(0);

        let [v_2] = random.generator_seed(gen_0);
        let [v_3] = random.generator_seed(gen_1);
        expect(v_2).toEqual(v_3);

        let [v_5] = random.generator_seed(gen_2);
        let [v_6] = random.generator_seed(gen_3);
        expect(v_1).not.toEqual(v_5);
        expect(v_5).not.toEqual(v_6);
    })

    it('random_tests_regression', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        let num_0 = Array.from(fromHex("1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F"));

        random.update_randomness_state_for_testing(random_state_0, 0, num_0, scenario.ctx);

        let [gen_0] = random.new_generator(random_state_0, scenario.ctx);

        let [o256] = random.generate_u256(gen_0);
        expect(o256).toEqual("85985798878417437391783029796051418802193098452099584085821130568389745847195");

        let [o128] = random.generate_u128(gen_0);
        expect(o128).toEqual("332057125240408555349883177059479920214");

        let [o64] = random.generate_u64(gen_0);
        expect(o64).toEqual("13202990749492462163");

        let [o32] = random.generate_u32(gen_0);
        expect(o32).toEqual(3316307786);

        let [o16] = random.generate_u16(gen_0);
        expect(o16).toEqual(5961);

        let [o8] = random.generate_u8(gen_0);
        expect(o8).toEqual(222);

        let [v0] = random.generate_u128_in_range(gen_0, 51, 123456789);
        expect(v0).toEqual("99859235");

        let [v1] = random.generate_u64_in_range(gen_0, 51, 123456789);
        expect(v1).toEqual("87557915");

        let [v2] = random.generate_u32_in_range(gen_0, 51, 123456789);
        expect(v2).toEqual(57096277);

        let [v3] = random.generate_u16_in_range(gen_0, 51, 1234);
        expect(v3).toEqual(349);

        let [v5] = random.generate_u8_in_range(gen_0, 51, 123);
        expect(v5).toEqual(60);

        let [v6] = random.generate_bytes(gen_0, 11);
        expect(v6).toEqual(Array.from(fromHex("252cfdbb59205fcc509c9e")));

        let [v7] = random.generate_bool(gen_0);
        expect(v7).toEqual(true);

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    })

    it('random_tests_regression', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        let num_0 = Array.from(fromHex("1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F"));

        random.update_randomness_state_for_testing(random_state_0, 0, num_0, scenario.ctx);

        let [gen_0] = random.new_generator(random_state_0, scenario.ctx);

        let [v_0] = random.generator_buffer(gen_0);
        expect(v_0.length).toEqual(0);

        let [v_1] = random.generate_bytes(gen_0, 1);
        expect(v_1.length).toEqual(1);
        let [v_2] = random.generator_counter(gen_0);
        expect(v_2).toEqual(1);
        let [v_3] = random.generator_buffer(gen_0);
        expect(v_3.length).toEqual(31);

        let [v_5] = random.generate_bytes(gen_0, 2);
        expect(v_5.length).toEqual(2);
        let [v_6] = random.generator_counter(gen_0);
        expect(v_6).toEqual(1);
        let [v_7] = random.generator_buffer(gen_0);
        expect(v_7.length).toEqual(29);

        let [v_8] = random.generate_bytes(gen_0, 29);
        expect(v_8.length).toEqual(29);
        let [v_9] = random.generator_counter(gen_0);
        expect(v_9).toEqual(1);
        let [v_10] = random.generator_buffer(gen_0);
        expect(v_10.length).toEqual(0);

        let [v_11] = random.generate_bytes(gen_0, 11);
        expect(v_11.length).toEqual(11);
        let [v_12] = random.generator_counter(gen_0);
        expect(v_12).toEqual(2);
        let [v_13] = random.generator_buffer(gen_0);
        expect(v_13.length).toEqual(21);

        let [v_15] = random.generate_bytes(gen_0, 64);
        expect(v_15.length).toEqual(64);
        let [v_16] = random.generator_counter(gen_0);
        expect(v_16).toEqual(4);
        let [v_17] = random.generator_buffer(gen_0);
        expect(v_17.length).toEqual(21);

        let [v_18] = random.generate_bytes(gen_0, 32 * 5 + 5);
        expect(v_18.length).toEqual(32 * 5 + 5);
        let [v_19] = random.generator_counter(gen_0);
        expect(v_19).toEqual(9);
        let [v_20] = random.generator_buffer(gen_0);
        expect(v_20.length).toEqual(16);

        let [r_0] = random.generate_bytes(gen_0, 10);

        let i = 0;
        while (true) {
            if (r_0[i]) break;
            i = i + 1;
        };

        let [r_1] = random.generate_bytes(gen_0, 10);
        let [r_2] = random.generate_bytes(gen_0, 10);
        i = 0;
        while (true) {
            if (r_1[i] != r_2[i]) break;
            i = i + 1;
        };

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    });

    it('random_tests_regression', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        let num_0 = Array.from(fromHex("1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F1F"));

        random.update_randomness_state_for_testing(random_state_0, 0, num_0, scenario.ctx);

        let [gen_0] = random.new_generator(random_state_0, scenario.ctx);

        expect(() => random.generate_u128_in_range(gen_0, 511, 500))
                            .toThrowError("VMError with status ABORTED with sub status " + 3);

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    });

    it('random_tests_update_after_epoch_change', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        random.update_randomness_state_for_testing(random_state_0, 0, [0, 1, 2, 3], scenario.ctx);
        random.update_randomness_state_for_testing(random_state_0, 1, [4, 5, 6, 7], scenario.ctx);

        test_scenario.next_epoch(scenario, caller);

        random.update_randomness_state_for_testing(random_state_0, 0, [8, 9, 10, 11], scenario.ctx);

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    });

    it('random_tests_duplicate', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        random.update_randomness_state_for_testing(random_state_0, 0, [0, 1, 2, 3], scenario.ctx);

        expect(() => random.update_randomness_state_for_testing(random_state_0, 0, [0, 1, 2, 3], scenario.ctx))
                            .toThrowError("VMError with status ABORTED with sub status " + 2);

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    });

    it('random_tests_out_of_order', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        random.create_for_testing(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [random_state_0_bcs] = test_scenario.take_shared([random.Random.$type()], scenario);
        let random_state_0 = random.Random.bcs.parse(random_state_0_bcs);

        random.update_randomness_state_for_testing(random_state_0, 0, [0, 1, 2, 3], scenario.ctx);

        expect(() => random.update_randomness_state_for_testing(random_state_0, 3, [0, 1, 2, 3], scenario.ctx))
                            .toThrowError("VMError with status ABORTED with sub status " + 2);

        test_scenario.return_shared([random.Random.$type()], random_state_0);
        test_scenario.end(scenario);
    });
});