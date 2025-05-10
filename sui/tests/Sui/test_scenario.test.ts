import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, Boolean, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { dynamic_object_field } from '../wrappers/dependencies/Sui/dynamic_object_field';
import { test_scenario_tests } from '../wrappers/dependencies/Sui/test_scenario_tests';
import { transfer_ as transfer } from '../wrappers/dependencies/Sui/transfer';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { event } from '../wrappers/dependencies/Sui/event';
import { object } from '../wrappers/dependencies/Sui/object';
import { bcs as bcs_import } from "@mysten/sui/bcs";
import { tx_context } from '../wrappers/dependencies/Sui/tx_context';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('test_scenario_tests', () => {
    it('test_wrap_unwrap', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.transfer([obj_0.$type], obj_0, caller);

        test_scenario.next_tx(scenario, caller);

        let [id_1] = test_scenario.new_object(scenario);
        let [child_bcs] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let child = obj_0.from_bcs_t(child_bcs);
        let wrapper_0 = new test_scenario_tests.Wrapper(id_1, child);
        transfer.transfer([wrapper_0.$type], wrapper_0, caller);

        test_scenario.next_tx(scenario, caller);

        let [v_0] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_0)).toEqual(false);

        let [v_1] = test_scenario.has_most_recent_for_sender([wrapper_0.$type], scenario);
        expect(bcs_import.bool().parse(v_1)).toEqual(true);

        test_scenario.end(scenario);
    })

    it('test_remove_then_return', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller);

        test_scenario.next_tx(scenario, caller);

        let [child_bcs] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let child = obj_0.from_bcs_t(child_bcs);

        test_scenario.return_to_sender([obj_0.$type], scenario, child);

        test_scenario.next_tx(scenario, caller);

        let [v_0] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_0)).toEqual(true);

        test_scenario.end(scenario);
    })

    it('test_return_and_update', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller);

        test_scenario.next_tx(scenario, caller);

        let [object_bcs_0] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_0 = obj_0.from_bcs_t(object_bcs_0);

        expect(object_0.value).toEqual("10");
        object_0.value = 100;

        test_scenario.return_to_sender([obj_0.$type], scenario, object_0);

        test_scenario.next_tx(scenario, caller);

        let [object_bcs_1] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_1 = obj_0.from_bcs_t(object_bcs_1);
        expect(object_1.value).toEqual("100");
        test_scenario.return_to_sender([obj_0.$type], scenario, object_1);

        test_scenario.end(scenario);
    })

    it('test_remove_during_tx', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller);

        let [v_0] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_0)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('test_double_remove', () => {
        refresh_vm();

        let caller = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let [scenario] = test_scenario.begin(caller);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller);

        test_scenario.next_tx(scenario, caller);

        let [object_bcs_0] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_0 = obj_0.from_bcs_t(object_bcs_0);
        test_scenario.return_to_sender([obj_0.$type], scenario, object_0);

        expect(() => {
            let [object_bcs_1] = test_scenario.take_from_sender([obj_0.$type], scenario);
            let object_1 = obj_0.from_bcs_t(object_bcs_1);
            test_scenario.return_to_sender([obj_0.$type], scenario, object_1);
        }).toThrowError("VMError with status ABORTED with sub status " + 3);

        test_scenario.end(scenario);
    })

    it('test_three_owners', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let caller2 = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let caller3 = "0x0000000000000000000000000000000000000000000000000000000000000002";

        let [scenario] = test_scenario.begin(caller1);

        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller1);

        // addr1 -> addr2
        test_scenario.next_tx(scenario, caller1);

        let [object_bcs_0] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_0 = obj_0.from_bcs_t(object_bcs_0);
        transfer.public_transfer([object_0.$type], object_0, caller2);

        // addr1 cannot access
        test_scenario.next_tx(scenario, caller1);

        let [v_0] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_0)).toEqual(false);

        // addr2 -> addr3
        test_scenario.next_tx(scenario, caller2);
        let [object_bcs_1] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_1 = obj_0.from_bcs_t(object_bcs_1);
        transfer.public_transfer([object_0.$type], object_1, caller3);

        // addr1 cannot access
        test_scenario.next_tx(scenario, caller1);
        let [v_1] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_1)).toEqual(false);

        // addr2 cannot access
        test_scenario.next_tx(scenario, caller2);
        let [v_2] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_2)).toEqual(false);

        // addr3 *can* access
        test_scenario.next_tx(scenario, caller3);
        let [v_3] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_3)).toEqual(true);

        test_scenario.end(scenario);
    })

    it('test_transfer_then_delete', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let caller2 = "0x0000000000000000000000000000000000000000000000000000000000000001";

        let [scenario] = test_scenario.begin(caller1);
        let [id_0] = test_scenario.new_object(scenario);
        let obj_0 = new test_scenario_tests.Object_(id_0, 10);
        transfer.public_transfer([obj_0.$type], obj_0, caller2);

        let [v_0] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_0)).toEqual(false);

        test_scenario.next_tx(scenario, caller2);
        let [v_1] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_1)).toEqual(true);

        let [object_bcs_0] = test_scenario.take_from_sender([obj_0.$type], scenario);
        let object_0 = obj_0.from_bcs_t(object_bcs_0);
        expect(object_0.id).toEqual(id_0);

        test_scenario.next_tx(scenario, caller2);
        let [v_2] = test_scenario.has_most_recent_for_sender([obj_0.$type], scenario);
        expect(bcs_import.bool().parse(v_2)).toEqual(false);

        test_scenario.end(scenario);
    })

    it('test_get_owned_obj_ids', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);
        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj1.$type], obj2, caller1);
        transfer.public_transfer([obj1.$type], obj3, caller1);

        test_scenario.next_tx(scenario, caller1);

        let [ids_bcs] = test_scenario.ids_for_sender([obj1.$type], scenario);
        let ids = bcs_import.vector(id1.get_bcs()).parse(ids_bcs);
        expect(ids).toEqual([id1, id2, id3]);

        test_scenario.end(scenario);
    })

    it('test_get_owned_obj_ids', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);
        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj1.$type], obj2, caller1);
        transfer.public_transfer([obj1.$type], obj3, caller1);

        test_scenario.next_tx(scenario, caller1);

        let [object_bcs_1] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        let [object_bcs_2] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id2);
        let object_2 = obj1.from_bcs_t(object_bcs_2);
        let [object_bcs_3] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id3);
        let object_3 = obj1.from_bcs_t(object_bcs_3);
        expect(object_1.value).toEqual("10");
        expect(object_2.value).toEqual("20");
        expect(object_3.value).toEqual("30");
        test_scenario.return_to_sender([obj1.$type], scenario, object_1)
        test_scenario.return_to_sender([obj1.$type], scenario, object_2)
        test_scenario.return_to_sender([obj1.$type], scenario, object_3)

        test_scenario.end(scenario);
    });

    it('test_get_last_created_object_id', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let [id1_addr] = object.uid_to_address(uid1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_transfer([obj1.$type], obj1, caller1);

        let [v_0] = tx_context.last_created_object_id(scenario.ctx);

        expect(id1_addr).toEqual(v_0);

        test_scenario.end(scenario);
    });

    it('test_take_shared_by_id', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);
        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_share_object([obj1.$type], obj1);
        transfer.public_share_object([obj1.$type], obj2);
        transfer.public_share_object([obj1.$type], obj3);

        test_scenario.next_tx(scenario, caller1);

        let [object_bcs_1] = test_scenario.take_shared_by_id([obj1.$type], scenario, id1);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        let [object_bcs_2] = test_scenario.take_shared_by_id([obj1.$type], scenario, id2);
        let object_2 = obj1.from_bcs_t(object_bcs_2);
        let [object_bcs_3] = test_scenario.take_shared_by_id([obj1.$type], scenario, id3);
        let object_3 = obj1.from_bcs_t(object_bcs_3);
        expect(object_1.value).toEqual("10");
        expect(object_2.value).toEqual("20");
        expect(object_3.value).toEqual("30");
        test_scenario.return_shared([obj1.$type], object_1)
        test_scenario.return_shared([obj1.$type], object_2)
        test_scenario.return_shared([obj1.$type], object_3)

        test_scenario.end(scenario);
    });

    it('test_take_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [v_1] = test_scenario.has_most_recent_shared([obj1.$type]);
        expect(bcs_import.bool().parse(v_1)).toEqual(true);

        let [object_bcs_1] = test_scenario.take_shared([obj1.$type], scenario);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        expect(object_1.value).toEqual("10");

        test_scenario.return_shared([obj1.$type], object_1);

        test_scenario.end(scenario);
    });

    it('test_delete_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [v_1] = test_scenario.has_most_recent_shared([obj1.$type]);
        expect(bcs_import.bool().parse(v_1)).toEqual(true);

        let [object_bcs_1] = test_scenario.take_shared([obj1.$type], scenario);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        expect(object_1.value).toEqual("10");

        test_scenario.return_shared([obj1.$type], object_1);

        test_scenario.end(scenario);
    });

    it('test_take_immutable_by_id', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);
        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_freeze_object([obj1.$type], obj1);
        transfer.public_freeze_object([obj1.$type], obj2);
        transfer.public_freeze_object([obj1.$type], obj3);

        test_scenario.next_tx(scenario, caller1);

        let [object_bcs_1] = test_scenario.take_immutable_by_id([obj1.$type], scenario, id1);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        let [object_bcs_2] = test_scenario.take_immutable_by_id([obj1.$type], scenario, id2);
        let object_2 = obj1.from_bcs_t(object_bcs_2);
        let [object_bcs_3] = test_scenario.take_immutable_by_id([obj1.$type], scenario, id3);
        let object_3 = obj1.from_bcs_t(object_bcs_3);
        expect(object_1.value).toEqual("10");
        expect(object_2.value).toEqual("20");
        expect(object_3.value).toEqual("30");
        test_scenario.return_immutable([obj1.$type], object_1)
        test_scenario.return_immutable([obj1.$type], object_2)
        test_scenario.return_immutable([obj1.$type], object_3)

        test_scenario.end(scenario);
    });

    it('test_take_immutable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_freeze_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [v_1] = test_scenario.has_most_recent_immutable([obj1.$type]);
        expect(bcs_import.bool().parse(v_1)).toEqual(true);

        let [object_bcs_1] = test_scenario.take_immutable([obj1.$type], scenario);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        expect(object_1.value).toEqual("10");

        test_scenario.return_immutable([obj1.$type], object_1);

        test_scenario.end(scenario);
    });

    it('test_receive_object', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);
        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj1.$type], obj2, id1_addr);
        transfer.public_transfer([obj1.$type], obj3, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        let [object_bcs_1] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
        let object_1 = obj1.from_bcs_t(object_bcs_1);
        let [ticket_2_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
        let ticket_2 = transfer.Receiving.bcs.parse(ticket_2_bcs);
        let [ticket_3_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id3);
        let ticket_3 = transfer.Receiving.bcs.parse(ticket_3_bcs);
        let [object_bcs_2] = transfer.receive([obj1.$type], object_1.id, ticket_2);
        let object_2 = obj1.from_bcs_t(object_bcs_2);
        let [object_bcs_3] = transfer.receive([obj1.$type], object_1.id, ticket_3);
        let object_3 = obj1.from_bcs_t(object_bcs_3);

        expect(object_1.value).toEqual("10");
        expect(object_2.value).toEqual("20");
        expect(object_3.value).toEqual("30");
        test_scenario.return_to_sender([obj1.$type], scenario, object_1);
        transfer.public_transfer([object_2.$type], object_2, id1_addr);
        transfer.public_transfer([object_3.$type], object_3, id1_addr);

        test_scenario.end(scenario);
    });

    it('test_receive_for_object', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
        let parent = obj1.from_bcs_t(parent_bcs);

        let [t2_bcs] = test_scenario.most_recent_receiving_ticket([obj1.$type], id1);
        let t2 = transfer.Receiving.bcs.parse(t2_bcs);

        let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
        let object_2 = obj1.from_bcs_t(object_bcs_2);

        expect(parent.value).toEqual("10");
        expect(object_2.value).toEqual("20");

        test_scenario.return_to_sender([obj1.$type], scenario, parent);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);

        test_scenario.end(scenario);
    });

    it('test_receive_object_multiple_in_row', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        {
            let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
            let parent = obj1.from_bcs_t(parent_bcs);

            let [t2_bcs] = test_scenario.most_recent_receiving_ticket([obj1.$type], id1);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
            let object_2 = obj1.from_bcs_t(object_bcs_2);

            expect(parent.value).toEqual("10");
            expect(object_2.value).toEqual("20");

            test_scenario.return_to_sender([obj1.$type], scenario, parent);
            transfer.public_transfer([obj2.$type], obj2, id1_addr);
        }

        test_scenario.next_tx(scenario, caller1);

        {
            let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
            let parent = obj1.from_bcs_t(parent_bcs);

            let [t2_bcs] = test_scenario.most_recent_receiving_ticket([obj1.$type], id1);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
            let object_2 = obj1.from_bcs_t(object_bcs_2);

            expect(parent.value).toEqual("10");
            expect(object_2.value).toEqual("20");

            test_scenario.return_to_sender([obj1.$type], scenario, parent);
            transfer.public_transfer([obj2.$type], obj2, id1_addr);
        }

        test_scenario.end(scenario);
    });

    it('test_no_receive_object_then_use_next_tx', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        {
            test_scenario.most_recent_receiving_ticket([obj1.$type], id1);
        }

        test_scenario.next_tx(scenario, caller1);

        {
            let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
            let parent = obj1.from_bcs_t(parent_bcs);

            let [t2_bcs] = test_scenario.most_recent_receiving_ticket([obj1.$type], id1);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
            let object_2 = obj1.from_bcs_t(object_bcs_2);

            expect(parent.value).toEqual("10");
            expect(object_2.value).toEqual("20");

            test_scenario.return_to_sender([obj1.$type], scenario, parent);
            transfer.public_transfer([obj2.$type], obj2, id1_addr);
        }

        test_scenario.end(scenario);
    });

    it('test_receive_object_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        expect(() => test_scenario.receiving_ticket_by_id([obj1.$type], id1))
            .toThrowError("VMError with status ABORTED with sub status " + 4);

        test_scenario.end(scenario);
    });

    it('test_receive_object_double_allocate_ticket', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 20);

        transfer.public_transfer([obj1.$type], obj1, caller1);

        test_scenario.next_tx(scenario, caller1);

        test_scenario.receiving_ticket_by_id([obj1.$type], id1)
        expect(() => test_scenario.receiving_ticket_by_id([obj1.$type], id1))
            .toThrowError("VMError with status ABORTED with sub status " + 6);

        test_scenario.end(scenario);
    });

    it('test_receive_double_allocate_ticket_return_between', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 20);

        transfer.public_transfer([obj1.$type], obj1, caller1);

        test_scenario.next_tx(scenario, caller1);

        let [t2_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id1)
        let t2 = transfer.Receiving.bcs.parse(t2_bcs);

        test_scenario.return_receiving_ticket([obj1.$type], t2);
        test_scenario.receiving_ticket_by_id([obj1.$type], id1);

        test_scenario.end(scenario);
    });

    it('test_receive_double_allocate_ticket_return_between_then_use', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);
        transfer.public_transfer([obj3.$type], obj3, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        {
            let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
            let parent = obj1.from_bcs_t(parent_bcs);

            let [t2_bcs_0] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
            let t2_0 = transfer.Receiving.bcs.parse(t2_bcs_0);
            test_scenario.return_receiving_ticket([obj1.$type], t2_0);

            let [t2_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [t3_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id3);
            let t3 = transfer.Receiving.bcs.parse(t3_bcs);

            let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
            let object_2 = obj1.from_bcs_t(object_bcs_2);

            let [object_bcs_3] = transfer.receive([obj1.$type], parent.id, t3);
            let object_3 = obj1.from_bcs_t(object_bcs_3);

            expect(parent.value).toEqual("10");
            expect(object_2.value).toEqual("20");
            expect(object_3.value).toEqual("30");

            test_scenario.return_to_sender([obj1.$type], scenario, parent);
            transfer.public_transfer([obj2.$type], obj2, id1_addr);
            transfer.public_transfer([obj3.$type], obj3, id1_addr);
        }

        test_scenario.end(scenario);
    });

    it('test_receive_double_allocate_ticket_return_between_then_use_then_check', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);
        transfer.public_transfer([obj3.$type], obj3, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        {
            let [parent_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1);
            let parent = obj1.from_bcs_t(parent_bcs);

            let [t2_bcs_0] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
            let t2_0 = transfer.Receiving.bcs.parse(t2_bcs_0);
            test_scenario.return_receiving_ticket([obj1.$type], t2_0);

            let [t2_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [t3_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id3);
            let t3 = transfer.Receiving.bcs.parse(t3_bcs);

            let [object_bcs_2] = transfer.receive([obj1.$type], parent.id, t2);
            let object_2 = obj1.from_bcs_t(object_bcs_2);

            let [object_bcs_3] = transfer.receive([obj1.$type], parent.id, t3);
            let object_3 = obj1.from_bcs_t(object_bcs_3);

            expect(parent.value).toEqual("10");
            expect(object_2.value).toEqual("20");
            expect(object_3.value).toEqual("30");
            obj2.value = 52;

            test_scenario.return_to_sender([obj1.$type], scenario, parent);
            transfer.public_transfer([obj2.$type], obj2, caller1);
            transfer.public_transfer([obj3.$type], obj3, caller1);
        }

        test_scenario.next_tx(scenario, caller1);

        {
            let [obj_bcs] = test_scenario.take_from_sender_by_id([obj1.$type], scenario, id2);
            let obj = obj1.from_bcs_t(obj_bcs);
            expect(obj.value).toEqual("52");
            test_scenario.return_to_sender([obj1.$type], scenario, obj);
        }

        test_scenario.end(scenario);
    });

    it('test_unused_receive_ticket', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);
        let id1 = uid1.id;
        let id2 = uid2.id;
        let id3 = uid3.id;
        let [id1_addr] = object.id_to_address(id1);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_transfer([obj1.$type], obj1, caller1);
        transfer.public_transfer([obj2.$type], obj2, id1_addr);
        transfer.public_transfer([obj3.$type], obj3, id1_addr);

        test_scenario.next_tx(scenario, caller1);

        {
            let [t2_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id2);
            let t2 = transfer.Receiving.bcs.parse(t2_bcs);

            let [t3_bcs] = test_scenario.receiving_ticket_by_id([obj1.$type], id3);
            let t3 = transfer.Receiving.bcs.parse(t3_bcs);
        }

        test_scenario.next_tx(scenario, caller1);

        test_scenario.end(scenario);
    });

    it('test_unreturned_objects', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let [uid2] = test_scenario.new_object(scenario);
        let [uid3] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let obj2 = new test_scenario_tests.Object_(uid2, 20);
        let obj3 = new test_scenario_tests.Object_(uid3, 30);

        transfer.public_share_object([obj1.$type], obj1);
        transfer.public_freeze_object([obj2.$type], obj2);
        transfer.public_transfer([obj3.$type], obj3, caller1);

        test_scenario.next_tx(scenario, caller1);

        let [shared_bcs] = test_scenario.take_shared([obj1.$type], scenario);
        let shared = obj1.from_bcs_t(shared_bcs);
        let [imm_bcs] = test_scenario.take_immutable([obj1.$type], scenario);
        let imm = obj1.from_bcs_t(imm_bcs);
        let [owned_bcs] = test_scenario.take_from_sender([obj1.$type], scenario);
        let owned = obj1.from_bcs_t(owned_bcs);

        test_scenario.next_tx(scenario, caller1);
        test_scenario.next_epoch(scenario, caller1);
        test_scenario.next_tx(scenario, caller1);
        test_scenario.next_epoch(scenario, caller1);
        test_scenario.end(scenario);

        transfer.public_share_object([obj1.$type], shared);
        transfer.public_freeze_object([obj2.$type], imm);
        transfer.public_transfer([obj3.$type], owned, caller1);
    });

    it('test_later_epoch', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [ts0] = tx_context.epoch_timestamp_ms(scenario.ctx);

        test_scenario.next_tx(scenario, caller1);

        let [ts1] = tx_context.epoch_timestamp_ms(scenario.ctx);

        expect(ts1).toEqual(ts0);

        test_scenario.next_epoch(scenario, caller1);

        let [ts2] = tx_context.epoch_timestamp_ms(scenario.ctx);

        expect(ts2).toEqual(ts1);

        test_scenario.later_epoch(scenario, 42, caller1);

        let [ts3] = tx_context.epoch_timestamp_ms(scenario.ctx);

        expect(BigInt(ts3)).toEqual(BigInt(ts2) + 42n);

        test_scenario.next_tx(scenario, caller1);

        let [ts5] = tx_context.epoch_timestamp_ms(scenario.ctx);

        expect(ts5).toEqual(ts3);

        test_scenario.next_epoch(scenario, caller1);

        let [ts6] = tx_context.epoch_timestamp_ms(scenario.ctx);

        expect(ts6).toEqual(ts5);

        test_scenario.end(scenario);
    });

    it('test_invalid_shared_usage', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [shared_bcs] = test_scenario.take_shared([obj1.$type], scenario);
        let shared = obj1.from_bcs_t(shared_bcs);

        transfer.public_freeze_object([obj1.$type], shared);

        expect(() => test_scenario.next_tx(scenario, caller1))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_immutable_usage', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_freeze_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [v0_bcs] = test_scenario.take_immutable([obj1.$type], scenario);
        let v_0 = obj1.from_bcs_t(v0_bcs);

        transfer.public_transfer([obj1.$type], v_0, caller1);

        expect(() => test_scenario.next_tx(scenario, caller1))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_modify_immutable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_freeze_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [v0_bcs] = test_scenario.take_immutable([obj1.$type], scenario);
        let v_0 = obj1.from_bcs_t(v0_bcs);
        v_0.value = 100;

        test_scenario.next_tx(scenario, caller1);

        test_scenario.return_immutable([obj1.$type], v_0);

        expect(() => test_scenario.next_tx(scenario, caller1))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_address_return', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.return_to_sender([obj1.$type], scenario, obj1))
            .toThrowError("VMError with status ABORTED with sub status " + 2);
    });

    it('test_invalid_shared_return', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.return_shared([obj1.$type], obj1))
            .toThrowError("VMError with status ABORTED with sub status " + 2);
    });

    it('test_invalid_immutable_return', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.return_immutable([obj1.$type], obj1))
            .toThrowError("VMError with status ABORTED with sub status " + 2);
    });

    it('test_empty_inventory', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_from_sender([obj1.$type], scenario))
            .toThrowError("VMError with status ABORTED with sub status " + 3);
    });

    it('test_empty_inventory_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_shared([obj1.$type], scenario))
            .toThrowError("VMError with status ABORTED with sub status " + 3);
    });

    it('test_empty_inventory_immutable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_immutable([obj1.$type], scenario))
            .toThrowError("VMError with status ABORTED with sub status " + 3);
    });

    it('test_object_not_found', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_from_sender_by_id([obj1.$type], scenario, id1))
            .toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_object_not_found_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_shared_by_id([obj1.$type], scenario, id1))
            .toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_object_not_found_immutable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        expect(() => test_scenario.take_immutable_by_id([obj1.$type], scenario, id1))
            .toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_wrong_object_type', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        transfer.public_transfer([obj1.$type], obj1, caller1);

        expect(() => {
            let [v0_bcs] = test_scenario.take_from_sender_by_id([test_scenario_tests.Wrapper.$type()], scenario, id1)
            let v0 = test_scenario_tests.Wrapper.bcs.parse(v0_bcs);

            test_scenario.return_to_sender([test_scenario_tests.Wrapper.$type()], scenario, v0)
        }).toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_wrong_object_type_shared', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        transfer.public_transfer([obj1.$type], obj1, caller1);

        expect(() => {
            let [v0_bcs] = test_scenario.take_shared_by_id([test_scenario_tests.Wrapper.$type()], scenario, id1)
            let v0 = test_scenario_tests.Wrapper.bcs.parse(v0_bcs);

            test_scenario.return_to_sender([test_scenario_tests.Wrapper.$type()], scenario, v0)
        }).toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_wrong_object_type_immutable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);
        let id1 = uid1.id;

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        transfer.public_freeze_object([obj1.$type], obj1);

        expect(() => {
            let [v0_bcs] = test_scenario.take_immutable_by_id([test_scenario_tests.Wrapper.$type()], scenario, id1)
            let v0 = test_scenario_tests.Wrapper.bcs.parse(v0_bcs);

            test_scenario.return_immutable([test_scenario_tests.Wrapper.$type()], scenario)
        }).toThrowError("VMError with status ABORTED with sub status " + 4);
    });

    it('test_dynamic_field_still_borrowed', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);
        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj1);

        let [obj2_bcs] = dynamic_object_field.borrow([a0.$type, obj1.$type], uid1, a0);
        let obj2 = obj1.from_bcs_t(obj2_bcs);

        expect(obj2.value).toEqual("10");
    });

    it('test_dynamic_object_field_not_retrievable', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_transfer([obj1.$type], obj1, caller1);

        test_scenario.next_tx(scenario, caller1);

        let [v_0_bcs] = test_scenario.has_most_recent_for_address([obj1.$type], caller1);
        expect(bcs_import.bool().parse(v_0_bcs)).toEqual(true);

        let [obj2_bcs] = test_scenario.take_from_sender([obj1.$type], scenario);
        let obj2 = obj1.from_bcs_t(obj2_bcs);
        expect(obj2.id).toEqual(uid1);

        let [v_1_bcs] = test_scenario.has_most_recent_for_address([obj1.$type], caller1);
        expect(bcs_import.bool().parse(v_1_bcs)).toEqual(false);

        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj2);

        test_scenario.next_tx(scenario, caller1);

        let [v_2_bcs] = test_scenario.has_most_recent_for_address([obj1.$type], caller1);
        expect(bcs_import.bool().parse(v_2_bcs)).toEqual(false);

        test_scenario.end(scenario);
    });

    it('test_dynamic_field_shared_misuse', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [obj2_bcs] = test_scenario.take_shared([obj1.$type], scenario);
        let obj2 = obj1.from_bcs_t(obj2_bcs);
        expect(obj2.id).toEqual(uid1);

        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj2);

        expect(() => test_scenario.next_tx(scenario, caller1))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_dynamic_field_immutable_misuse', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_freeze_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [obj2_bcs] = test_scenario.take_immutable([obj1.$type], scenario);
        let obj2 = obj1.from_bcs_t(obj2_bcs);
        expect(obj2.id).toEqual(uid1);

        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj2);
        
        expect(() => test_scenario.next_tx(scenario, caller1))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_dynamic_object_field_shared_misuse', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_share_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [obj2_bcs] = test_scenario.take_shared([obj1.$type], scenario);
        let obj2 = obj1.from_bcs_t(obj2_bcs);
        expect(obj2.id).toEqual(uid1);

        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj2);
        
        expect(() => test_scenario.next_tx(scenario, caller1))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_dynamic_object_field_immutable_misuse', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let [uid1] = test_scenario.new_object(scenario);

        let obj1 = new test_scenario_tests.Object_(uid1, 10);

        transfer.public_freeze_object([obj1.$type], obj1);

        test_scenario.next_tx(scenario, caller1);

        let [obj2_bcs] = test_scenario.take_immutable([obj1.$type], scenario);
        let obj2 = obj1.from_bcs_t(obj2_bcs);
        expect(obj2.id).toEqual(uid1);

        let a0 = new String("");
        dynamic_object_field.add([a0.$type, obj1.$type], uid1, a0, obj2);
        
        expect(() => test_scenario.next_tx(scenario, caller1))
                    .toThrowError("VMError with status ABORTED with sub status " + 1);

        test_scenario.end(scenario);
    });

    it('test_events', () => {
        refresh_vm();

        let caller1 = "0x0000000000000000000000000000000000000000000000000000000000000000";

        let [scenario] = test_scenario.begin(caller1);

        let e0 = new test_scenario_tests.E1("0");

        event.emit([e0.$type], e0);
        event.emit([e0.$type], e0);

        let [v_0] = event.num_events();
        expect(v_0).toEqual(2);

        let [effects] = test_scenario.next_tx(scenario, caller1);
        expect(effects.num_user_events).toEqual("2");
        
        let [v_1] = event.num_events();
        expect(v_1).toEqual(0);

        let e1 = new test_scenario_tests.E1("1");
        event.emit([e1.$type], e1);

        let [v_2] = event.num_events();
        expect(v_2).toEqual(1);

        let [v_3_bcs] = event.events_by_type([e1.$type]);
        let v_3 = e1.from_bcs_vector_t(v_3_bcs);
        expect(v_3[0]).toEqual(e1);

        let [effects_0] = test_scenario.end(scenario);
        expect(effects_0.num_user_events).toEqual("1");

        let [v_5] = event.num_events();
        expect(v_5).toEqual(0);
    });
});