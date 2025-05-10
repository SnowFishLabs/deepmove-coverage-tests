import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { package_ as package_import } from '../wrappers/dependencies/Sui/package';
import { package_tests } from '../wrappers/dependencies/Sui/package_tests';
import { address } from '../wrappers/dependencies/Sui/address';
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

describe('package_tests', () => {
    it('test_from_package', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let otw = new package_tests.TEST_OTW(true);

        let [pub_0_bcs] = package_import.test_claim([otw.$type], otw, scenario.ctx);
        let pub_0 = package_import.Publisher.bcs.parse(pub_0_bcs);

        let [v_0_bcs] = package_import.from_package([package_tests.CustomType.$type()], pub_0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = package_import.from_package([test_scenario.Scenario.$type()], pub_0);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(true);

        let [v_2] = package_import.published_package(pub_0);
        expect(v_2).toEqual("0000000000000000000000000000000000000000000000000000000000000002");

        package_import.burn_publisher(pub_0);
        test_scenario.end(scenario);
    })

    it('test_from_module', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let otw = new package_tests.TEST_OTW(true);

        let [pub_0_bcs] = package_import.test_claim([otw.$type], otw, scenario.ctx);
        let pub_0 = package_import.Publisher.bcs.parse(pub_0_bcs);

        let [v_0_bcs] = package_import.from_module([package_tests.CustomType.$type()], pub_0);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [v_1_bcs] = package_import.from_module([test_scenario.Scenario.$type()], pub_0);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(false);

        let [v_2] = package_import.published_module(pub_0);
        expect(v_2).toEqual("package_tests");

        package_import.burn_publisher(pub_0);
        test_scenario.end(scenario);
    })

    it('test_restrict_upgrade_policy', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        let [v_0] = package_import.upgrade_policy(cap_0);
        let [v_1] = package_import.compatible_policy();

        expect(v_0).toEqual(v_1);

        package_import.only_additive_upgrades(cap_0);

        let [v_2] = package_import.upgrade_policy(cap_0);
        let [v_3] = package_import.additive_policy();

        expect(v_2).toEqual(v_3);

        package_import.only_dep_upgrades(cap_0);

        let [v_5] = package_import.upgrade_policy(cap_0);
        let [v_6] = package_import.dep_only_policy();

        expect(v_5).toEqual(v_6);

        package_import.make_immutable(cap_0);

        test_scenario.end(scenario);
    })

    it('test_upgrade_policy_reflected_in_ticket', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        let [p_0] = package_import.dep_only_policy();
        let [p_1] = package_import.compatible_policy();
        let [p_2] = package_import.additive_policy();

        let policies = [p_0, p_1, p_2];

        for (var i = 0; i < policies.length; i++) {
            let policy = policies[i];
            let [hash_0] = hash.blake2b256([policy]);

            let [ticket] = package_tests.check_ticket(cap_0, policy, hash_0);
            let [receipt] = package_import.test_upgrade(ticket);
            package_import.commit_upgrade(cap_0, receipt);
        }

        package_import.make_immutable(cap_0);
        test_scenario.end(scenario);
    })

    it('test_full_upgrade_flow', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        package_import.only_additive_upgrades(cap_0);

        let [version_0] = package_import.version(cap_0);
        expect(version_0).toEqual("1");

        let [p_0] = package_import.dep_only_policy();
        let [bytes_0] = string.as_bytes("package contents");
        let [hash_0] = hash.blake2b256(bytes_0);
        let [ticket_0] = package_import.authorize_upgrade(cap_0, p_0, hash_0);

        let [r_0] = package_import.ticket_policy(ticket_0);
        let [r_1] = package_import.dep_only_policy();

        expect(r_0).toEqual(r_1);

        let [receipt] = package_import.test_upgrade(ticket_0);
        package_import.commit_upgrade(cap_0, receipt);

        let [version_1] = package_import.version(cap_0);

        expect(version_1).toEqual("2");

        package_import.make_immutable(cap_0);
        test_scenario.end(scenario);
    });

    it('test_failure_to_widen_upgrade_policy', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        package_import.only_dep_upgrades(cap_0);

        let [p_0] = package_import.upgrade_policy(cap_0);
        let [p_1] = package_import.dep_only_policy();

        expect(p_0).toEqual(p_1);

        expect(() => package_import.only_additive_upgrades(cap_0))
                                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_failure_to_authorize_overly_permissive_upgrade', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        package_import.only_dep_upgrades(cap_0);

        let [p_0] = package_import.compatible_policy();
        let [bytes_0] = string.as_bytes("package contents");
        let [hash_0] = hash.blake2b256(bytes_0);

        expect(() => package_import.authorize_upgrade(cap_0, p_0, hash_0))
                                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_failure_to_authorize_multiple_upgrades', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let puber = "0x0000000000000000000000000000000000000000000000000000000000000042";

        let [id_0] = object.id_from_address(puber);

        let [scenario] = test_scenario.begin(caller);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);

        let [p_0] = package_import.compatible_policy();
        let [bytes_0] = string.as_bytes("package contents");
        let [hash_0] = hash.blake2b256(bytes_0);

        package_import.authorize_upgrade(cap_0, p_0, hash_0);

        expect(() => package_import.authorize_upgrade(cap_0, p_0, hash_0))
                                    .toThrowError("VMError with status ABORTED with sub status " + 2);

        test_scenario.end(scenario);
    });

    it('test_failure_to_commit_upgrade_to_wrong_cap', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let [scenario] = test_scenario.begin(caller);

        let puber_0 = "0x0000000000000000000000000000000000000000000000000000000000000042";
        let puber_1 = "0x0000000000000000000000000000000000000000000000000000000000000043";

        let [id_0] = object.id_from_address(puber_0);
        let [id_1] = object.id_from_address(puber_1);

        let [cap_0] = package_import.test_publish(id_0, scenario.ctx);
        let [cap_1] = package_import.test_publish(id_1, scenario.ctx);

        let [p_0] = package_import.dep_only_policy();
        let [bytes_0] = string.as_bytes("package contents 1");
        let [hash_0] = hash.blake2b256(bytes_0);

        let [ticket_0] = package_import.authorize_upgrade(cap_1, p_0, hash_0);

        let [p_1] = package_import.ticket_policy(ticket_0);
        let [p_2] = package_import.dep_only_policy();

        expect(p_1).toEqual(p_2);

        let [receipt1] = package_import.test_upgrade(ticket_0);

        expect(() => package_import.commit_upgrade(cap_0, receipt1))
                                    .toThrowError("VMError with status ABORTED with sub status " + 4);

        test_scenario.end(scenario);
    });
});