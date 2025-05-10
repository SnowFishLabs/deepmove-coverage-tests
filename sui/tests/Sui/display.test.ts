import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Address, setup, String, U16, U64, U8, new_wasm, refresh_vm, into_arr_value, Ascii, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { package_ as package_import } from '../wrappers/dependencies/Sui/package';
import { transfer_ as transfer } from '../wrappers/dependencies/Sui/transfer';
import { display_tests } from '../wrappers/dependencies/Sui/display_tests';
import { test_scenario } from '../wrappers/dependencies/Sui/test_scenario';
import { display } from '../wrappers/dependencies/Sui/display';

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

describe('display_test', () => {
    it('capy_init', () => {
        let caller = "0x0000000000000000000000000000000000000000000000000000000000000002";
        let [scenario] = test_scenario.begin(caller);

        let capy_0 = new display_tests.CAPY(true);

        let [pub_0_bcs] = package_import.test_claim([capy_0.$type], capy_0, scenario.ctx);

        let pub_0 = package_import.Publisher.bcs.parse(pub_0_bcs);

        let [display_0_bcs] = display.new_([display_tests.Capy.$type()], pub_0, scenario.ctx);

        let display_0 = display.Display.bcs.parse(display_0_bcs);

        display.add([display_tests.Capy.$type()], display_0, new String("name"), new String("Capy {name}"));
        display.add([display_tests.Capy.$type()], display_0, new String("link"), new String("https://capy.art/capy/{id}"));
        display.add([display_tests.Capy.$type()], display_0, new String("image"), new String("https://api.capy.art/capy/{id}/svg"));
        display.add([display_tests.Capy.$type()], display_0, new String("description"), new String("A Lovely Capy"));
        
        package_import.burn_publisher(pub_0);
        transfer.public_transfer([display_0.$type + `<${display_tests.Capy.$type()}>`], display_0, caller);
        test_scenario.end(scenario);
    })
});