import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { coin } from '../wrappers/dependencies/Sui/coin';
import { sui } from '../wrappers/dependencies/Sui/sui';
import { pay } from '../wrappers/dependencies/Sui/pay';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { hash } from '../wrappers/dependencies/Sui/hash';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { fromHex, toHex } from '@mysten/bcs';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('pay_tests', () => {
    it('test_coin_split_n', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        pay.divide_and_keep([sui.SUI.$type()], coin_0, 3, scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let type_0 = coin.Coin.$type() + `<${sui.SUI.$type()}>`;
        let [coin_1_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);

        test_scenario.next_tx(scenario, caller);

        let [coin_2_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_2 = coin.Coin.bcs.parse(coin_2_bcs);

        test_scenario.next_tx(scenario, caller);

        expect(coin_1.balance.value).toEqual("3");
        expect(coin_2.balance.value).toEqual("3");
        expect(coin_0.balance.value).toEqual("4");

        let [v_0_bcs] = test_scenario.has_most_recent_for_sender([type_0], scenario);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('test_coin_split_n_to_vec', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        let [coins_0_bcs] = coin.divide_into_n([sui.SUI.$type()], coin_0, 3, scenario.ctx);

        let split_coins = bcs_import.vector(coin.Coin.bcs).parse(coins_0_bcs);

        expect(split_coins.length).toEqual(2);

        expect(split_coins[0].balance.value).toEqual("3");
        expect(split_coins[1].balance.value).toEqual("3");
        expect(coin_0.balance.value).toEqual("4");

        test_scenario.end(scenario);
    })

    it('test_split_vec', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        pay.split_vec([sui.SUI.$type()], coin_0, [new U64(1), new U64(4)], scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let type_0 = coin.Coin.$type() + `<${sui.SUI.$type()}>`;

        let [coin_1_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);

        test_scenario.next_tx(scenario, caller);

        let [coin_2_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_2 = coin.Coin.bcs.parse(coin_2_bcs);

        expect(coin_1.balance.value).toEqual("4");
        expect(coin_2.balance.value).toEqual("1");
        expect(coin_0.balance.value).toEqual("5");

        test_scenario.end(scenario);
    })

    it('test_split_and_transfer', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        pay.split_and_transfer([sui.SUI.$type()], coin_0, 3, caller, scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let type_0 = coin.Coin.$type() + `<${sui.SUI.$type()}>`;

        let [coin_1_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);

        expect(coin_1.balance.value).toEqual("3");
        expect(coin_0.balance.value).toEqual("7");

        test_scenario.end(scenario);
    })

    it('test_split_and_transfer_fail', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        expect(() => pay.split_and_transfer([sui.SUI.$type()], coin_0, 20, caller, scenario.ctx))
                                    .toThrowError("VMError with status ABORTED with sub status " + 2);

        // test_scenario.next_tx(scenario, caller);

        // let type_0 = coin.Coin.$type() + `<${sui.SUI.$type()}>`;

        // let [coin_1_bcs] = test_scenario.take_from_sender([type_0], scenario);
        // let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);

        // expect(coin_1.balance.value).toEqual("7");

        test_scenario.end(scenario);
    })

    it('test_join_vec_and_transfer', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000051";
        let [scenario] = test_scenario.begin(caller);

        let [coin_0_bcs] = coin.mint_for_testing([sui.SUI.$type()], 10, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        test_scenario.next_tx(scenario, caller);

        let [coin_vector_0_bcs] = coin.divide_into_n([sui.SUI.$type()], coin_0, 4, scenario.ctx);

        let coin_vector_0 = bcs_import.vector(coin.Coin.bcs).parse(coin_vector_0_bcs);

        pay.join_vec_and_transfer([sui.SUI.$type()], coin_vector_0, caller);

        test_scenario.next_tx(scenario, caller);

        // expect(() => pay.split_and_transfer([sui.SUI.$type()], coin_0, 20, caller, scenario.ctx))
        //                             .toThrowError("VMError with status ABORTED with sub status " + 2);

        let type_0 = coin.Coin.$type() + `<${sui.SUI.$type()}>`;

        let [coin_1_bcs] = test_scenario.take_from_sender([type_0], scenario);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);

        expect(coin_1.balance.value).toEqual("6");
        expect(coin_0.balance.value).toEqual("4");

        test_scenario.end(scenario);
    })
});