import {
    get_package_address,
    get_wasm
} from "@deepmove/sui";

let PACKAGE_NAME: string = "Sui";
let PACKAGE_ADDRESS: string = "0x0000000000000000000000000000000000000000000000000000000000000002";
let MODULE_NAME: string = "ecdsa_r1_tests";

function do_get_package_address() {
    let package_address: string = get_package_address(PACKAGE_NAME);
    if (package_address) {
        return package_address;
    } else {
        return PACKAGE_ADDRESS;
    }
}

function unit_test_poison() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "unit_test_poison", [], args);

}

function test_ecrecover_pubkey() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "test_ecrecover_pubkey", [], args);

}

function test_ecrecover_pubkey_invalid_sig() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "test_ecrecover_pubkey_invalid_sig", [], args);

}

function test_secp256r1_verify_fails_with_recoverable_sig() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "test_secp256r1_verify_fails_with_recoverable_sig", [], args);

}

function test_secp256r1_verify_success_with_nonrecoverable_sig() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "test_secp256r1_verify_success_with_nonrecoverable_sig", [], args);

}

function test_secp256r1_invalid_public_key_length() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "test_secp256r1_invalid_public_key_length", [], args);

}

export const ecdsa_r1_tests = {
    unit_test_poison,
    test_ecrecover_pubkey,
    test_ecrecover_pubkey_invalid_sig,
    test_secp256r1_verify_fails_with_recoverable_sig,
    test_secp256r1_verify_success_with_nonrecoverable_sig,
    test_secp256r1_invalid_public_key_length
}