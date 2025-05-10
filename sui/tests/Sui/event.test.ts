import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { event } from '../wrappers/dependencies/Sui/event';
import { event_tests } from '../wrappers/dependencies/Sui/event_tests';
import { dynamic_object_field } from '../wrappers/dependencies/Sui/dynamic_object_field';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { option } from '../wrappers/dependencies/MoveStdlib/option';
import { display } from '../wrappers/dependencies/Sui/display';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('event_tests', () => {
    it('test_no_emit', () => {
        let [events_0_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s1 = bcs_import.vector(event_tests.S1.bcs).parse(events_0_bcs);
        expect(events_s1.length).toEqual(0);

        let [events_1] = event.num_events();
        expect(events_1).toEqual(0);
    })

    it('test_emit_homogenous', () => {
        refresh_vm();

        let s0 = new event_tests.S1("0");
        event.emit([s0.$type], s0);

        let [events_0_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s0 = bcs_import.vector(event_tests.S1.bcs).parse(events_0_bcs);
        expect(events_s0[0]).toEqual(s0);

        let [events_1_bcs] = event.events_by_type([event_tests.S2.$type()]);

        let events_s1 = bcs_import.vector(event_tests.S2.bcs).parse(events_1_bcs);
        expect(events_s1.length).toEqual(0);

        let [events_1] = event.num_events();
        expect(events_1).toEqual(1);

        let s1 = new event_tests.S1("1");
        event.emit([s1.$type], s1);

        let [events_2_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s2 = bcs_import.vector(event_tests.S1.bcs).parse(events_2_bcs);
        expect(events_s2[0]).toEqual(s0);
        expect(events_s2[1]).toEqual(s1);
        
        let [events_2] = event.num_events();
        expect(events_2).toEqual(2);
    })

    it('test_emit_duplicate', () => {
        refresh_vm();

        let s0 = new event_tests.S1("0");
        event.emit([s0.$type], s0);
        event.emit([s0.$type], s0);

        let [events_0] = event.num_events();
        expect(events_0).toEqual(2);

        let [events_0_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s0 = bcs_import.vector(event_tests.S1.bcs).parse(events_0_bcs);
        expect(events_s0.length).toEqual(2);
    });

    it('test_emit_heterogenous', () => {
        refresh_vm();

        let s0 = new event_tests.S1("0");
        let s1 = new event_tests.S2("1");

        event.emit([s0.$type], s0);
        event.emit([s1.$type], s1);

        let [events_0_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s0 = bcs_import.vector(event_tests.S1.bcs).parse(events_0_bcs);
        expect(events_s0[0]).toEqual(s0);

        let [events_1_bcs] = event.events_by_type([event_tests.S2.$type()]);

        let events_s1 = bcs_import.vector(event_tests.S2.bcs).parse(events_1_bcs);
        expect(events_s1[0]).toEqual(s1);

        let [events_0] = event.num_events();
        expect(events_0).toEqual(2);

        let s2 = new event_tests.S2("2");
        let s3 = new event_tests.S1("3");

        event.emit([s2.$type], s2);
        event.emit([s3.$type], s3);

        let [events_2_bcs] = event.events_by_type([event_tests.S2.$type()]);

        let events_s2 = bcs_import.vector(event_tests.S2.bcs).parse(events_2_bcs);
        expect(events_s2[1]).toEqual(s2);

        let [events_3_bcs] = event.events_by_type([event_tests.S1.$type()]);

        let events_s3 = bcs_import.vector(event_tests.S1.bcs).parse(events_3_bcs);
        expect(events_s3[1]).toEqual(s3);

        let [events_1] = event.num_events();
        expect(events_1).toEqual(4);
    });
});