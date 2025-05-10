import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, u64, refresh_vm, afterTestAll, afterTest, beforeTest, get_wasm } from '@deepmove/sui';
import { authenticator_state } from '../wrappers/dependencies/Sui/authenticator_state';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

function create_active_jwk(iss: string, kid: string, kty: string, epoch: u64) {
    let jwk_id = new authenticator_state.JwkId(iss, kid);
    let jwk = new authenticator_state.JWK(kty, "AQAB", "test", "RS256");

    return new authenticator_state.ActiveJwk(jwk_id, jwk, epoch);
}

describe('authenticator_state_test', () => {
    it('authenticator_state_tests_basic', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        authenticator_state.create(scenario.ctx);
        let [effects] = test_scenario.next_tx(scenario, caller);

        let [r1_bcs] = test_scenario.take_shared([authenticator_state.AuthenticatorState.$type()], scenario);
        let auth_state = authenticator_state.AuthenticatorState.bcs.parse(r1_bcs);

        let jwk1 = create_active_jwk("iss1", "key1", "key1_payload", "1");
        let jwk2 = create_active_jwk("iss1", "key2", "key2_payload", "1");
        let jwk3 = create_active_jwk("iss1", "key3", "key3_payload", "1");

        authenticator_state.update_authenticator_state(auth_state, [jwk1, jwk3], scenario.ctx);

        let [recorded_jwks_1] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_1[0]).toEqual(jwk1);
        expect(recorded_jwks_1[1]).toEqual(jwk3);

        authenticator_state.update_authenticator_state(auth_state, [jwk2], scenario.ctx);
        let [recorded_jwks_2] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_2[0]).toEqual(jwk1);
        expect(recorded_jwks_2[1]).toEqual(jwk2);
        expect(recorded_jwks_2[2]).toEqual(jwk3);

        authenticator_state.expire_jwks(auth_state, "1", scenario.ctx);
        let [recorded_jwks_3] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_3.length).toEqual(3);

        let jwk5 = create_active_jwk("iss1", "key1", "key1_payload", "2");
        authenticator_state.update_authenticator_state(auth_state, [jwk5], scenario.ctx);
        let [recorded_jwks_5] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_5.length).toEqual(3);
        expect(recorded_jwks_5[0]).toEqual(jwk5);

        authenticator_state.expire_jwks(auth_state, "2", scenario.ctx);
        let [recorded_jwks_6] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_6.length).toEqual(1);
        expect(recorded_jwks_6[0]).toEqual(jwk5);

        test_scenario.return_shared([authenticator_state.AuthenticatorState.$type()], auth_state);
        test_scenario.end(scenario);
    });

    it('authenticator_state_tests_deduplication', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        authenticator_state.create(scenario.ctx);
        let [effects] = test_scenario.next_tx(scenario, caller);

        let [r1_bcs] = test_scenario.take_shared([authenticator_state.AuthenticatorState.$type()], scenario);
        let auth_state = authenticator_state.AuthenticatorState.bcs.parse(r1_bcs);

        let jwk1 = create_active_jwk("https://accounts.google.com", "kid2", "k1", '0');
        authenticator_state.update_authenticator_state(auth_state, [jwk1], scenario.ctx);

        let [recorded_jwks_1] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_1.length).toEqual(1);
        expect(recorded_jwks_1[0]).toEqual(jwk1);

        let jwk2 = create_active_jwk("https://www.facebook.com", "kid1", "k2", '0');
        let jwk3 = create_active_jwk("https://accounts.google.com", "kid2", "k3", '0');
        authenticator_state.update_authenticator_state(auth_state, [jwk2, jwk3], scenario.ctx);

        let [recorded_jwks_2] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_2.length).toEqual(2);
        expect(recorded_jwks_2[0]).toEqual(jwk2);
        expect(recorded_jwks_2[1]).toEqual(jwk1);

        let jwk4 = create_active_jwk("https://accounts.google.com", "kid4", "k4", '0');
        authenticator_state.update_authenticator_state(auth_state, [jwk4], scenario.ctx);

        let [recorded_jwks_3] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_3.length).toEqual(3);
        expect(recorded_jwks_3[0]).toEqual(jwk2);
        expect(recorded_jwks_3[1]).toEqual(jwk1);
        expect(recorded_jwks_3[2]).toEqual(jwk4);

        test_scenario.return_shared([authenticator_state.AuthenticatorState.$type()], auth_state);
        test_scenario.end(scenario);
    })

    it('authenticator_state_tests_expiry_edge_cases', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        authenticator_state.create(scenario.ctx);
        let [effects] = test_scenario.next_tx(scenario, caller);

        let [r1_bcs] = test_scenario.take_shared([authenticator_state.AuthenticatorState.$type()], scenario);
        let auth_state = authenticator_state.AuthenticatorState.bcs.parse(r1_bcs);

        authenticator_state.expire_jwks(auth_state, "1", scenario.ctx);

        let jwk1 = create_active_jwk("iss1", "key1", "key1_payload", "1");
        let jwk2 = create_active_jwk("iss2", "key2", "key2_payload", "1");
        let jwk3 = create_active_jwk("iss3", "key3", "key3_payload", "1");

        authenticator_state.expire_jwks(auth_state, "2", scenario.ctx);

        authenticator_state.update_authenticator_state(auth_state, [jwk1, jwk2, jwk3], scenario.ctx);

        let [recorded_jwks_1] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_1.length).toEqual(3);

        let jwk4 = create_active_jwk("iss1", "key4", "key4_payload", "2");
        authenticator_state.update_authenticator_state(auth_state, [jwk4], scenario.ctx);

        let [recorded_jwks_2] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_2.length).toEqual(4);

        authenticator_state.expire_jwks(auth_state, "2", scenario.ctx);

        let [recorded_jwks_3] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_3.length).toEqual(3);
        expect(recorded_jwks_3[0]).toEqual(jwk4);
        expect(recorded_jwks_3[1]).toEqual(jwk2);
        expect(recorded_jwks_3[2]).toEqual(jwk3);

        let jwk5 = create_active_jwk("iss2", "key5", "key5_payload", "3");
        let jwk6 = create_active_jwk("iss3", "key6", "key6_payload", "3");

        authenticator_state.update_authenticator_state(auth_state, [jwk5, jwk6], scenario.ctx);

        let [recorded_jwks_5] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_5.length).toEqual(5);
        expect(recorded_jwks_5[2]).toEqual(jwk5);
        expect(recorded_jwks_5[4]).toEqual(jwk6);

        authenticator_state.expire_jwks(auth_state, "3", scenario.ctx);

        let [recorded_jwks_6] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_6.length).toEqual(3);
        expect(recorded_jwks_6[0]).toEqual(jwk4);
        expect(recorded_jwks_6[1]).toEqual(jwk5);
        expect(recorded_jwks_6[2]).toEqual(jwk6);
        
        authenticator_state.expire_jwks(auth_state, "3", scenario.ctx);
        let [recorded_jwks_7] = authenticator_state.get_active_jwks(auth_state, scenario.ctx);
        expect(recorded_jwks_7.length).toEqual(3);
        expect(recorded_jwks_7[0]).toEqual(jwk4);
        expect(recorded_jwks_7[1]).toEqual(jwk5);
        expect(recorded_jwks_7[2]).toEqual(jwk6);

        test_scenario.return_shared([authenticator_state.AuthenticatorState.$type()], auth_state);
        test_scenario.end(scenario);
    });
});