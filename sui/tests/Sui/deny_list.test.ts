import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, afterTest, beforeTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { deny_list_tests } from '../wrappers/dependencies/Sui/deny_list_tests';
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';
import { type_name } from '../wrappers/dependencies/MoveStdlib/type_name';
import { string } from '../wrappers/dependencies/MoveStdlib/string';
import { config } from '../wrappers/dependencies/Sui/config';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { deny_list } from '../wrappers/dependencies/Sui/deny_list';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('deny_list_test', () => {
    it('add_zero', () => {
        refresh_vm();

        let [ctx] = tx_context.dummy();
        let [deny_list_0] = deny_list.new_for_testing(ctx);

        let [ty_0_bcs] = type_name.get_with_original_ids([deny_list_tests.X.$type()]);
        let ty_name = type_name.TypeName.bcs.parse(ty_0_bcs);

        let [ty_1] = type_name.into_string(ty_name);

        let [ty_1_bytes] = string.into_bytes(ty_1);

        let [reserved_addr] = deny_list.reserved_addresses();

        expect(() => deny_list.v1_add(deny_list_0, 1, ty_1_bytes, reserved_addr[0]))
            .toThrowError("VMError with status ABORTED with sub status 1");
    })

    it('remove_zero', () => {
        refresh_vm();

        let [ctx] = tx_context.dummy();
        let [deny_list_0] = deny_list.new_for_testing(ctx);

        let [ty_0_bcs] = type_name.get_with_original_ids([deny_list_tests.X.$type()]);
        let ty_name = type_name.TypeName.bcs.parse(ty_0_bcs);

        let [ty_1] = type_name.into_string(ty_name);

        let [ty_1_bytes] = string.into_bytes(ty_1);

        let [reserved_addr] = deny_list.reserved_addresses();

        expect(() => deny_list.v1_add(deny_list_0, 1, ty_1_bytes, reserved_addr[1]))
            .toThrowError("VMError with status ABORTED with sub status 1");
    })

    it('contains_zero', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        deny_list.create_for_test(scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let [deny_list_0_bcs] = test_scenario.take_shared([deny_list.DenyList.$type()], scenario);

        let deny_list_0 = deny_list.DenyList.bcs.parse(deny_list_0_bcs);

        let [ty_0_bcs] = type_name.get_with_original_ids([deny_list_tests.X.$type()]);
        let ty_name = type_name.TypeName.bcs.parse(ty_0_bcs);

        let [ty_1] = type_name.into_string(ty_name);

        let [ty_1_bytes] = string.into_bytes(ty_1);

        let [reserved_addr] = deny_list.reserved_addresses();

        for (var i = 0; i < reserved_addr.length; i++) {
            let [v_0] = deny_list.v1_contains(deny_list_0, 1, ty_1_bytes, reserved_addr[i]);
            expect(v_0).toEqual(false);
        }

        test_scenario.return_shared([deny_list.DenyList.$type()], deny_list_0);
        test_scenario.end(scenario)
    })
});