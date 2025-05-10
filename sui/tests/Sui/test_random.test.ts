import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { test_random } from '../wrappers/dependencies/Sui/test_random';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { string } from '../wrappers/dependencies/MoveStdlib/string';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('test_random_tests', () => {
    it('test_next_bytes', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let lengths = [1, 31, 32, 33, 63, 64, 65];

        for (var i = 0; i < lengths.length; i++) {
            let length = lengths[i];

            let [r_0] = string.as_bytes("seed");
            let [random0] = test_random.new_(r_0);
            let [bytes0] = test_random.next_bytes(random0, length);

            expect(bytes0.length).toEqual(length);

            let [r_1] = string.as_bytes("seed 1");
            let [random1] = test_random.new_(r_1);
            let [r_2] = string.as_bytes("seed 2");
            let [random2] = test_random.new_(r_2);

            let [bytes1] = test_random.next_bytes(random1, length);
            let [bytes2] = test_random.next_bytes(random2, length);
            expect(bytes1).not.toEqual(bytes2);

            let [r_3] = string.as_bytes("seed");
            let [random3] = test_random.new_(r_3);
            let [r_5] = string.as_bytes("seed");
            let [random5] = test_random.new_(r_5);

            let [bytes3] = test_random.next_bytes(random3, length);
            let [bytes5] = test_random.next_bytes(random5, length);
            expect(bytes3).toEqual(bytes5);
        }

        test_scenario.end(scenario);
    })

    it('test_next_bool', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_bool(random0);
        expect(v_0).toEqual(false);
        let [v_1] = test_random.next_bool(random0);
        expect(v_1).toEqual(false);
        let [v_2] = test_random.next_bool(random0);
        expect(v_2).toEqual(true);
        let [v_3] = test_random.next_bool(random0);
        expect(v_3).toEqual(false);
        let [v_5] = test_random.next_bool(random0);
        expect(v_5).toEqual(false);
        let [v_6] = test_random.next_bool(random0);
        expect(v_6).toEqual(true);
        let [v_7] = test_random.next_bool(random0);
        expect(v_7).toEqual(true);
        let [v_8] = test_random.next_bool(random0);
        expect(v_8).toEqual(true);

        test_scenario.end(scenario);
    });

    it('test_next_u8', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u8(random0);
        expect(v_0).toEqual(228);
        let [v_1] = test_random.next_u8(random0);
        expect(v_1).toEqual(182);
        let [v_2] = test_random.next_u8(random0);
        expect(v_2).toEqual(229);
        let [v_3] = test_random.next_u8(random0);
        expect(v_3).toEqual(184);
        let [v_5] = test_random.next_u8(random0);
        expect(v_5).toEqual(40);
        let [v_6] = test_random.next_u8(random0);
        expect(v_6).toEqual(199);
        let [v_7] = test_random.next_u8(random0);
        expect(v_7).toEqual(63);
        let [v_8] = test_random.next_u8(random0);
        expect(v_8).toEqual(51);

        test_scenario.end(scenario);
    });

    it('test_next_u8_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u8_in_range(random0, upper_bound);
                expect(v_0).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });

    it('test_next_u16', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u16(random0);
        expect(v_0).toEqual(23524);
        let [v_1] = test_random.next_u16(random0);
        expect(v_1).toEqual(30390);
        let [v_2] = test_random.next_u16(random0);
        expect(v_2).toEqual(60645);
        let [v_3] = test_random.next_u16(random0);
        expect(v_3).toEqual(2488);
        let [v_5] = test_random.next_u16(random0);
        expect(v_5).toEqual(5672);
        let [v_6] = test_random.next_u16(random0);
        expect(v_6).toEqual(36807);
        let [v_7] = test_random.next_u16(random0);
        expect(v_7).toEqual(54591);
        let [v_8] = test_random.next_u16(random0);
        expect(v_8).toEqual(41523);

        test_scenario.end(scenario);
    });

    it('test_next_u16_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u16_in_range(random0, upper_bound);
                expect(v_0).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });

    it('test_next_u32', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u32(random0);
        expect(v_0).toEqual(2356042724);
        let [v_1] = test_random.next_u32(random0);
        expect(v_1).toEqual(2194372278);
        let [v_2] = test_random.next_u32(random0);
        expect(v_2).toEqual(1943727333);
        let [v_3] = test_random.next_u32(random0);
        expect(v_3).toEqual(3674540472);
        let [v_5] = test_random.next_u32(random0);
        expect(v_5).toEqual(560141864);
        let [v_6] = test_random.next_u32(random0);
        expect(v_6).toEqual(2309459911);
        let [v_7] = test_random.next_u32(random0);
        expect(v_7).toEqual(2130498879);
        let [v_8] = test_random.next_u32(random0);
        expect(v_8).toEqual(2063835699);

        test_scenario.end(scenario);
    });

    it('test_next_u32_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u32_in_range(random0, upper_bound);
                expect(v_0).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });

    it('test_next_u64', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u64(random0);
        expect(v_0).toEqual("5845420307181886436");
        let [v_1] = test_random.next_u64(random0);
        expect(v_1).toEqual("7169586959492019894");
        let [v_2] = test_random.next_u64(random0);
        expect(v_2).toEqual("8821413273700855013");
        let [v_3] = test_random.next_u64(random0);
        expect(v_3).toEqual("17006289909767801272");
        let [v_5] = test_random.next_u64(random0);
        expect(v_5).toEqual("8349531451798263336");
        let [v_6] = test_random.next_u64(random0);
        expect(v_6).toEqual("1662646395949518791");
        let [v_7] = test_random.next_u64(random0);
        expect(v_7).toEqual("17661794895045383487");
        let [v_8] = test_random.next_u64(random0);
        expect(v_8).toEqual("12177043863244087859");

        test_scenario.end(scenario);
    });

    it('test_next_u64_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u64_in_range(random0, upper_bound);
                expect(BigInt(v_0)).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });

    it('test_next_u128', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u128(random0);
        expect(v_0).toEqual("69353424864165392191432166318042668004");
        let [v_1] = test_random.next_u128(random0);
        expect(v_1).toEqual("12194030816161474852776228502914168502");
        let [v_2] = test_random.next_u128(random0);
        expect(v_2).toEqual("206987904376642456854249538403010538725");
        let [v_3] = test_random.next_u128(random0);
        expect(v_3).toEqual("197466311403128565716545068165788666296");
        let [v_5] = test_random.next_u128(random0);
        expect(v_5).toEqual("15530841291297409371230861184202905128");
        let [v_6] = test_random.next_u128(random0);
        expect(v_6).toEqual("165552967413296855339223280683074424775");
        let [v_7] = test_random.next_u128(random0);
        expect(v_7).toEqual("8783412497932783467700075003507430719");
        let [v_8] = test_random.next_u128(random0);
        expect(v_8).toEqual("253037866491608363794848265776744604211");

        test_scenario.end(scenario);
    });

    it('test_next_u128_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u128_in_range(random0, upper_bound);
                expect(BigInt(v_0)).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });

    it('test_next_u256', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let [v_0] = test_random.next_u256(random0);
        expect(v_0).toEqual("86613847811709056614394817717810651756872989141966064397767345384420144995300");
        let [v_1] = test_random.next_u256(random0);
        expect(v_1).toEqual("77800816446193124932998172029673839405392227151477062245771844997605157992118");
        let [v_2] = test_random.next_u256(random0);
        expect(v_2).toEqual("45725748659421166954417450578509602234536262489471512215816310423253128244453");
        let [v_3] = test_random.next_u256(random0);
        expect(v_3).toEqual("19696026105199390416727112585766461108620822978182620644600554326664686143928");
        let [v_5] = test_random.next_u256(random0);
        expect(v_5).toEqual("4837202928086718576193880638295431461498764555598430221157283092238776342056");
        let [v_6] = test_random.next_u256(random0);
        expect(v_6).toEqual("64381219501514114493056586541507267846517000509074341237350219945295894515655");
        let [v_7] = test_random.next_u256(random0);
        expect(v_7).toEqual("112652690078173752677112416039396981893266964593788132944794761758835606345023");
        let [v_8] = test_random.next_u256(random0);
        expect(v_8).toEqual("64098809897132458178637712714755106201123339790293900115362940842770040070707");

        test_scenario.end(scenario);
    });

    it('test_next_u256_in_range', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [r_0] = string.as_bytes("seed");
        let [random0] = test_random.new_(r_0);
        let bounds = [1, 7, 8, 9, 15, 16, 17];

        let tests = 10;
        for (var i = 0; i < bounds.length; i++) {
            let upper_bound = bounds[i];
            let j = 0;
            while (j < tests) {
                let [v_0] = test_random.next_u256_in_range(random0, upper_bound);
                expect(BigInt(v_0)).toBeLessThan(upper_bound);
                j = j + 1;
            }
        }

        test_scenario.end(scenario);
    });
});