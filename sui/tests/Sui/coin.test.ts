import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { coin_tests } from '../wrappers/dependencies/Sui/coin_tests';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { ascii } from '../wrappers/dependencies/MoveStdlib/ascii';
import { deny_list } from '../wrappers/dependencies/Sui/deny_list';
import { balance } from '../wrappers/dependencies/Sui/balance';
import { object } from '../wrappers/dependencies/Sui/object';
import { coin } from '../wrappers/dependencies/Sui/coin';
import { url } from '../wrappers/dependencies/Sui/url';
import { pay } from '../wrappers/dependencies/Sui/pay';
import { transfer_ as transfer } from '../wrappers/dependencies/Sui/transfer';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('coin_test', () => {
    it('coin_tests_metadata', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let witness_0 = new coin_tests.COIN_TESTS(true);

        let [treasury_0_bcs, metadata_0_bcs] = coin.create_currency(
            [witness_0.$type], 
            witness_0, 
            6, 
            new String("COIN_TESTS").into_u8array(), 
            new String("coin_name").into_u8array(), 
            new String("description").into_u8array(), 
            new option.Option([new url.Url("icon_url")]), 
            scenario.ctx
        );

        let treasury_0 = coin.TreasuryCap.bcs.parse(treasury_0_bcs);
        let metadata_0 = coin.CoinMetadata.bcs.parse(metadata_0_bcs);

        let [decimals_0_bcs] = coin.get_decimals([witness_0.$type], metadata_0);
        let decimals_0 = bcs_import.u8().parse(decimals_0_bcs);

        let [symbol_0_bcs] = coin.get_symbol([witness_0.$type], metadata_0);
        let symbol_0 = bcs_import.string().parse(symbol_0_bcs);

        let [name_0_bcs] = coin.get_name([witness_0.$type], metadata_0);
        let name_0 = bcs_import.string().parse(name_0_bcs);

        let [description_0_bcs] = coin.get_description([witness_0.$type], metadata_0);
        let description_0 = bcs_import.string().parse(description_0_bcs);

        let [icon_url_0_bcs] = coin.get_icon_url([witness_0.$type], metadata_0);
        let icon_url = option.Option.bcs(url.Url.bcs).parse(icon_url_0_bcs);

        expect(decimals_0).toEqual(6)
        expect(symbol_0).toEqual("COIN_TESTS")
        expect(name_0).toEqual("coin_name")
        expect(description_0).toEqual("description")
        expect(icon_url.vec[0].url).toEqual("icon_url");

        coin.update_symbol([witness_0.$type], treasury_0, metadata_0, new Ascii("NEW_COIN_TESTS"));
        coin.update_name([witness_0.$type], treasury_0, metadata_0, new String("new_coin_name"));
        coin.update_description([witness_0.$type], treasury_0, metadata_0, new String("new_description"));
        coin.update_icon_url([witness_0.$type], treasury_0, metadata_0, new String("new_icon_url"));

        let [symbol_1_bcs] = coin.get_symbol([witness_0.$type], metadata_0);
        let symbol_1 = bcs_import.string().parse(symbol_1_bcs);

        let [name_1_bcs] = coin.get_name([witness_0.$type], metadata_0);
        let name_1 = bcs_import.string().parse(name_1_bcs);

        let [description_1_bcs] = coin.get_description([witness_0.$type], metadata_0);
        let description_1 = bcs_import.string().parse(description_1_bcs);

        let [icon_url_1_bcs] = coin.get_icon_url([witness_0.$type], metadata_0);
        let icon_url_1 = option.Option.bcs(url.Url.bcs).parse(icon_url_1_bcs);

        expect(symbol_1).toEqual("NEW_COIN_TESTS")
        expect(name_1).toEqual("new_coin_name")
        expect(description_1).toEqual("new_description")
        expect(icon_url_1.vec[0].url).toEqual("new_icon_url");

        test_scenario.end(scenario);
    })

    it('coin_tests_mint', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let witness_0 = new coin_tests.COIN_TESTS(true);

        let [treasury_0_bcs, metadata_0_bcs] = coin.create_currency(
            [witness_0.$type], 
            witness_0, 
            6, 
            new String("COIN_TESTS").into_u8array(), 
            new String("coin_name").into_u8array(), 
            new String("description").into_u8array(), 
            new option.Option([new url.Url("icon_url")]), 
            scenario.ctx
        );

        let treasury_0 = coin.TreasuryCap.bcs.parse(treasury_0_bcs);
        let metadata_0 = coin.CoinMetadata.bcs.parse(metadata_0_bcs);

        let [balance_0_bcs] = coin.mint_balance([witness_0.$type], treasury_0, 1000);
        let balance_0 = balance.Balance.bcs.parse(balance_0_bcs);

        let [coin_0_bcs] = coin.from_balance([witness_0.$type], balance_0, scenario.ctx);
        let coin_0 = coin.Coin.bcs.parse(coin_0_bcs);

        let [coin_value_0_bcs] = coin.value([witness_0.$type], coin_0);
        let coin_value_0 = bcs_import.u64().parse(coin_value_0_bcs);

        expect(coin_value_0).toEqual("1000")

        pay.keep([witness_0.$type], coin_0, scenario.ctx);

        coin.mint_and_transfer([witness_0.$type], treasury_0, 55, caller, scenario.ctx);

        test_scenario.next_epoch(scenario, caller);

        let [coin_1_bcs] = test_scenario.take_from_address(
            [coin.Coin.$type() + `<${witness_0.$type}>`],
            scenario,
            caller
        );

        let coin_1 = coin.Coin.bcs.parse(coin_1_bcs);
        let [coin_value_1_bcs] = coin.value([witness_0.$type], coin_1);
        let coin_value_1 = bcs_import.u64().parse(coin_value_1_bcs);

        expect(coin_value_1).toEqual("55")

        pay.keep([witness_0.$type], coin_1, scenario.ctx);

        transfer.public_freeze_object([coin.CoinMetadata.$type() + `<${witness_0.$type}>`], metadata_0);
        transfer.public_transfer([coin.TreasuryCap.$type() + `<${witness_0.$type}>`], treasury_0, caller);

        test_scenario.end(scenario);
    })

    it('deny_list_v1', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let addr100 = "0x0000000000000000000000000000000000000000000000000000000000000100";
        let addr200 = "0x0000000000000000000000000000000000000000000000000000000000000200";

        let [scenario] = test_scenario.begin(caller);

        deny_list.create_for_test(scenario.ctx);
        test_scenario.next_tx(scenario, caller);

        let witness_0 = new coin_tests.COIN_TESTS(true);

        let [treasury_0_bcs, deny_cap_0_bcs, metadata_0_bcs] = coin.create_regulated_currency(
            [witness_0.$type], 
            witness_0, 
            6, 
            new String("COIN_TESTS").into_u8array(), 
            new String("coin_name").into_u8array(), 
            new String("description").into_u8array(), 
            new option.Option([new url.Url("icon_url")]), 
            scenario.ctx
        );

        let treasury_0 = coin.TreasuryCap.bcs.parse(treasury_0_bcs);
        let deny_cap_0 = coin.DenyCap.bcs.parse(deny_cap_0_bcs);
        let metadata_0 = coin.CoinMetadata.bcs.parse(metadata_0_bcs);

        transfer.public_freeze_object([coin.CoinMetadata.$type() + `<${witness_0.$type}>`], metadata_0);
        transfer.public_freeze_object([coin.TreasuryCap.$type() + `<${witness_0.$type}>`], treasury_0);

        test_scenario.next_tx(scenario, caller);

        let [deny_list_0_bcs] = test_scenario.take_shared([deny_list.DenyList.$type()], scenario);
        let deny_list_0 = deny_list.DenyList.bcs.parse(deny_list_0_bcs);

        let [v_0_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr100);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);
        let [v_1_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr200);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(false);

        coin.deny_list_add([witness_0.$type], deny_list_0, deny_cap_0, addr200, scenario.ctx);
        let [v_2_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr200);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(true);

        test_scenario.return_shared([deny_list.DenyList.$type()], deny_list_0);

        test_scenario.next_tx(scenario, caller);

        coin.deny_list_remove([witness_0.$type], deny_list_0, deny_cap_0, addr200, scenario.ctx);

        let [deny_list_1_bcs] = test_scenario.take_shared([deny_list.DenyList.$type()], scenario);
        let deny_list_1 = deny_list.DenyList.bcs.parse(deny_list_1_bcs);
        let [v_3_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_1, addr100);
        expect(bcs_import.bool().parse(v_3_bcs)).toEqual(false);
        let [v_5_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_1, addr200);
        expect(bcs_import.bool().parse(v_5_bcs)).toEqual(false);

        coin.deny_list_add([witness_0.$type], deny_list_1, deny_cap_0, addr200, scenario.ctx);
        
        let [v_6_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_1, addr200);
        expect(bcs_import.bool().parse(v_6_bcs)).toEqual(true);

        coin.deny_list_remove([witness_0.$type], deny_list_1, deny_cap_0, addr200, scenario.ctx);

        test_scenario.return_shared([deny_list.DenyList.$type()], deny_list_1);

        test_scenario.next_tx(scenario, caller);

        let [deny_list_2_bcs] = test_scenario.take_shared([deny_list.DenyList.$type()], scenario);
        let deny_list_2 = deny_list.DenyList.bcs.parse(deny_list_2_bcs);

        let [v_7_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_2, addr200);
        expect(bcs_import.bool().parse(v_7_bcs)).toEqual(false);

        test_scenario.return_shared([deny_list.DenyList.$type()], deny_list_2);

        transfer.public_freeze_object([coin.DenyCap.$type() + `<${witness_0.$type}>`], deny_cap_0);

        test_scenario.end(scenario);
    });

    it('deny_list_v1_double_add', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let addr100 = "0x0000000000000000000000000000000000000000000000000000000000000100";
        let addr200 = "0x0000000000000000000000000000000000000000000000000000000000000200";

        let [scenario] = test_scenario.begin(caller);

        deny_list.create_for_test(scenario.ctx);
        test_scenario.next_tx(scenario, caller);

        let witness_0 = new coin_tests.COIN_TESTS(true);

        let [treasury_0_bcs, deny_cap_0_bcs, metadata_0_bcs] = coin.create_regulated_currency(
            [witness_0.$type], 
            witness_0, 
            6, 
            new String("COIN_TESTS").into_u8array(), 
            new String("coin_name").into_u8array(), 
            new String("description").into_u8array(), 
            new option.Option([new url.Url("icon_url")]), 
            scenario.ctx
        );

        let treasury_0 = coin.TreasuryCap.bcs.parse(treasury_0_bcs);
        let deny_cap_0 = coin.DenyCap.bcs.parse(deny_cap_0_bcs);
        let metadata_0 = coin.CoinMetadata.bcs.parse(metadata_0_bcs);

        transfer.public_freeze_object([coin.CoinMetadata.$type() + `<${witness_0.$type}>`], metadata_0);
        transfer.public_freeze_object([coin.TreasuryCap.$type() + `<${witness_0.$type}>`], treasury_0);

        test_scenario.next_tx(scenario, caller);

        let [deny_list_0_bcs] = test_scenario.take_shared([deny_list.DenyList.$type()], scenario);
        let deny_list_0 = deny_list.DenyList.bcs.parse(deny_list_0_bcs);

        let [v_0_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr100);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);

        coin.deny_list_add([witness_0.$type], deny_list_0, deny_cap_0, addr100, scenario.ctx);
        coin.deny_list_add([witness_0.$type], deny_list_0, deny_cap_0, addr100, scenario.ctx);

        let [v_1_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr100);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        coin.deny_list_remove([witness_0.$type], deny_list_0, deny_cap_0, addr100, scenario.ctx);

        let [v_2_bcs] = coin.deny_list_contains([witness_0.$type], deny_list_0, addr100);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        test_scenario.return_shared([deny_list.DenyList.$type()], deny_list_0);

        transfer.public_freeze_object([coin.DenyCap.$type() + `<${witness_0.$type}>`], deny_cap_0);
        test_scenario.end(scenario);
    });
})