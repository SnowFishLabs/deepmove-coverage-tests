import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { balance } from '../wrappers/dependencies/Sui/balance';
import { sui } from '../wrappers/dependencies/Sui/sui';
import { coin } from '../wrappers/dependencies/Sui/coin';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('balance_test', () => {
    it('type_morphing', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let [balance_0_bcs] = balance.zero([sui.SUI.$type()]);
        let balance_0 = balance.Balance.bcs.parse(balance_0_bcs);
        let [coin_0_bcs] = coin.from_balance([sui.SUI.$type()], balance_0, scenario.ctx);

        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        let [balance_1_bcs] = coin.into_balance([sui.SUI.$type()], coin_0);
        let balance_1 = balance.Balance.bcs.parse(balance_1_bcs);

        balance.destroy_zero([sui.SUI.$type()], balance_1);

        let [coin_1_bcs] = coin.mint_for_testing([sui.SUI.$type()], 100, scenario.ctx);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);
        let [balance_2_bcs]  = coin.balance_mut([sui.SUI.$type()], coin_1);
        let balance_2 = balance.Balance.bcs.parse(balance_2_bcs);
        let [balance_3_bcs] = balance.split([sui.SUI.$type()], balance_2, 50);
        let balance_3 = balance.Balance.bcs.parse(balance_3_bcs);

        let [value_1_bcs] = balance.value([sui.SUI.$type()], balance_3);
        let value_1 = bcs_import.u64().parse(value_1_bcs);
        expect(value_1).toEqual("50");

        let [value_2_bcs] = balance.value([sui.SUI.$type()], balance_2)
        let value_2 = bcs_import.u64().parse(value_2_bcs);
        expect(value_2).toEqual("50");

        balance.join([sui.SUI.$type()], balance_2, balance_3);

        let [value_3_bcs] = balance.value([sui.SUI.$type()], balance_2);
        let value_3 = bcs_import.u64().parse(value_3_bcs);
        expect(value_3).toEqual("100");

        test_scenario.end(scenario);
    })

    it('test_balance', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let [balance_0_bcs] = balance.zero([sui.SUI.$type()]);
        let balance_0 = balance.Balance.bcs.parse(balance_0_bcs);

        let [coin_1_bcs] = coin.mint_for_testing([sui.SUI.$type()], 1000, scenario.ctx);
        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);
        let [balance_2_bcs]  = coin.balance_mut([sui.SUI.$type()], coin_1);
        let balance_2 = balance.Balance.bcs.parse(balance_2_bcs);

        balance.join([sui.SUI.$type()], balance_0, balance_2);
        let [value_1_bcs] = balance.value([sui.SUI.$type()], balance_0);
        let value_1 = bcs_import.u64().parse(value_1_bcs);
        expect(value_1).toEqual("1000");

        let [value_3_bcs] = balance.split([sui.SUI.$type()], balance_0, 333);
        let [value_5_bcs] = balance.split([sui.SUI.$type()], balance_0, 333);
        let [value_6_bcs] = balance.split([sui.SUI.$type()], balance_0, 334);
        let balance_3 = balance.Balance.bcs.parse(value_3_bcs);
        let balance_5 = balance.Balance.bcs.parse(value_5_bcs);
        let balance_6 = balance.Balance.bcs.parse(value_6_bcs);

        balance.destroy_zero([sui.SUI.$type()], balance_0);

        let [value_7_bcs] = balance.value([sui.SUI.$type()], balance_3);
        let [value_8_bcs] = balance.value([sui.SUI.$type()], balance_5);
        let [value_9_bcs] = balance.value([sui.SUI.$type()], balance_6);

        expect(bcs_import.u64().parse(value_7_bcs)).toEqual("333");
        expect(bcs_import.u64().parse(value_8_bcs)).toEqual("333");
        expect(bcs_import.u64().parse(value_9_bcs)).toEqual("334");

        test_scenario.end(scenario);
    });
});