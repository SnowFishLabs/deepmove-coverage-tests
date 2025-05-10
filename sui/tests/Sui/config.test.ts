import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { config_tests } from '../wrappers/dependencies/Sui/config_tests';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { config } from '../wrappers/dependencies/Sui/config';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('config_test', () => {
    it('test_all', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let write_cap_0 = new config_tests.WriteCap(true);

        config_tests.config_create([config_tests.WriteCap.$type()], write_cap_0, scenario.ctx);

        test_scenario.next_tx(scenario, caller);

        let type_0 = config.Config.$type() + `<${config_tests.WriteCap.$type()}>`;
        let [option_id_0_bcs] = test_scenario.most_recent_id_shared([type_0]);

        let option_id_0 = option.Option.bcs(object.ID.bcs).parse(option_id_0_bcs);
        let id_0 = option_id_0.vec[0];

        let n1 = new String("hello");
        let n2 = new config_tests.Wrapped(new String("hello"));

        let [config_0_bcs] = test_scenario.take_shared_by_id([type_0], scenario, id_0);

        let config_0 = config.Config.bcs.parse(config_0_bcs);

        let [v_0_bcs] = config.exists_with_type([write_cap_0.$type, n1.$type, "u8"], config_0, n1);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(false);

        let [v_1_bcs] = config.exists_with_type_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, n1, scenario.ctx);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(false);

        let type_1 = config_tests.Wrapped.$type() + `<${String.$type()}>`;

        let [v_2_bcs] = config.exists_with_type([write_cap_0.$type, type_1, "u8"], config_0, n2);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        let [v_3_bcs] = config.exists_with_type_for_next_epoch([write_cap_0.$type, type_1, "u8"], config_0, n2, scenario.ctx);
        expect(bcs_import.bool().parse(v_3_bcs)).toEqual(false);

        let [r_0_bcs] = config.read_setting([n1.$type, "u8"], id_0, n1, scenario.ctx);
        let r_0 = option.Option.bcs(bcs_import.u8()).parse(r_0_bcs);
        expect(r_0.vec.length).toEqual(0);

        let [r_1_bcs] = config.read_setting([type_1, "u8"], id_0, n2, scenario.ctx);
        let r_1 = option.Option.bcs(bcs_import.u8()).parse(r_1_bcs);
        expect(r_1.vec.length).toEqual(0);

        // epoch0
        // n1 -- epoch0 --> 112
        config.add_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, write_cap_0, n1, new U8(112), scenario.ctx);

        let [a_0_bcs] = config.exists_with_type([write_cap_0.$type, n1.$type, "u8"], config_0, n1);
        expect(bcs_import.bool().parse(a_0_bcs)).toEqual(true);

        let [a_1_bcs] = config.exists_with_type_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, n1, scenario.ctx);
        expect(bcs_import.bool().parse(a_1_bcs)).toEqual(true);

        let [a_2_bcs] = config.exists_with_type([write_cap_0.$type, type_1, "u8"], config_0, n2);
        expect(bcs_import.bool().parse(a_2_bcs)).toEqual(false);

        let [a_3_bcs] = config.exists_with_type_for_next_epoch([write_cap_0.$type, type_1, "u8"], config_0, n2, scenario.ctx);
        expect(bcs_import.bool().parse(a_3_bcs)).toEqual(false);

        let [r_2_bcs] = config.borrow_for_next_epoch_mut([write_cap_0.$type, n1.$type, "u8"], config_0, write_cap_0, n1, scenario.ctx);
        let r_2 = bcs_import.u8().parse(r_2_bcs);
        expect(r_2).toEqual(112);

        let [r_3_bcs] = config.read_setting_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, n1);
        let r_3 = option.Option.bcs(bcs_import.u8()).parse(r_3_bcs);
        expect(r_3.vec[0]).toEqual(112);

        let [r_5_bcs] = config.read_setting([n1.$type, "u8"], id_0, n1, scenario.ctx);
        let r_5 = option.Option.bcs(bcs_import.u8()).parse(r_5_bcs);
        expect(r_5.vec.length).toEqual(0);

        let [r_6_bcs] = config.read_setting([type_1, "u8"], id_0, n2, scenario.ctx);
        let r_6 = option.Option.bcs(bcs_import.u8()).parse(r_6_bcs);
        expect(r_6.vec.length).toEqual(0);

        // epoch0
        // n1 -- epoch0 --> 224
        // config.add_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, write_cap_0, n1, new U8(224), scenario.ctx);
        // let [r_7_bcs] = config.borrow_for_next_epoch_mut([write_cap_0.$type, n1.$type, "u8"], config_0, write_cap_0, n1, scenario.ctx);
        // let r_7 = bcs_import.u8().parse(r_7_bcs);
        // expect(r_7).toEqual(224);

        // let [r_8_bcs] = config.read_setting_for_next_epoch([write_cap_0.$type, n1.$type, "u8"], config_0, n1);
        // let r_8 = option.Option.bcs(bcs_import.u8()).parse(r_8_bcs);
        // expect(r_8.vec[0]).toEqual(224);

        // let [r_9_bcs] = config.read_setting([n1.$type, "u8"], id_0, n1, scenario.ctx);
        // let r_9 = option.Option.bcs(bcs_import.u8()).parse(r_9_bcs);
        // expect(r_9.vec.length).toEqual(0);

        // let [r_10_bcs] = config.read_setting([type_1, "u8"], id_0, n2, scenario.ctx);
        // let r_10 = option.Option.bcs(bcs_import.u8()).parse(r_10_bcs);
        // expect(r_10.vec.length).toEqual(0);

        test_scenario.return_shared([type_0], config_0);
        test_scenario.end(scenario);
    })
});