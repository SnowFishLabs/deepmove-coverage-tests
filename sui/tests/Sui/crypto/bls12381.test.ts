import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setup, hexToNumArray, beforeTest, afterTest, afterTestAll, get_wasm } from '@deepmove/sui';
import { bls12381 } from '../../wrappers/dependencies/Sui/bls12381';
import { bls12381_tests } from '../../wrappers/dependencies/Sui/bls12381_tests';
import { group_ops } from '../../wrappers/dependencies/Sui/group_ops';
import { random } from '../../wrappers/dependencies/Sui/random';
import { string } from '../../wrappers/dependencies/MoveStdlib/string';
import { bcs as bcs_import } from "@mysten/sui/bcs";

let package_path = process.cwd();

setup(get_wasm(), package_path);

beforeEach(beforeTest)
afterEach(afterTest)
afterAll(afterTestAll);

const ORDER_BYTES = hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001");
const ORDER_MINUS_ONE_BYTES = hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000");
const LONG_SCALAR_BYTES = hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff0000000000");
const SHORT_SCALAR_BYTES = hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff0000");
const LONG_G1_BYTES = hexToNumArray("97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bbbbbb");
const SHORT_G1_BYTES = hexToNumArray("97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb");
const LONG_G2_BYTES = hexToNumArray("93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb811");
const SHORT_G2_BYTES = hexToNumArray("93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121");

describe('bls12381_tests', () => {
    it('test', () => {
        bls12381_tests.test_bls12381_min_sig_valid_sig();
        bls12381_tests.test_bls12381_min_sig_invalid_sig();
        bls12381_tests.test_bls12381_min_sig_invalid_signature_key_length();
        bls12381_tests.test_bls12381_min_sig_invalid_public_key_length();
        bls12381_tests.test_bls12381_min_pk_valid_and_invalid_sig();
        bls12381_tests.test_bls12381_min_pk_invalid_signature_key_length();
        bls12381_tests.test_bls12381_min_pk_invalid_public_key_length();
        bls12381_tests.test_scalar_ops();
        bls12381_tests.test_scalar_more_ops();
        bls12381_tests.test_scalar_to_bytes_regression();
        bls12381_tests.test_valid_scalar_from_bytes();
        // bls12381_tests.test_invalid_scalar_order();
        // bls12381_tests.test_invalid_scalar_empty();
        // bls12381_tests.test_invalid_scalar_too_short();
        // bls12381_tests.test_invalid_scalar_too_long();
        // bls12381_tests.test_invalid_scalar_div();
        // bls12381_tests.test_invalid_scalar_inv();
        bls12381_tests.test_g1_ops();
        bls12381_tests.test_g1_to_bytes_regression();
        bls12381_tests.test_valid_g1_from_bytes();
        // bls12381_tests.test_invalid_g1_too_short();
    });

    it('test_bls12381_min_sig_valid_sig', () => {
        let msg = hexToNumArray("0101010101");
        let pk = hexToNumArray("8df101606f91f3cad7f54b8aff0f0f64c41c482d9b9f9fe81d2b607bc5f611bdfa8017cf04b47b44b222c356ef555fbd11058c52c077f5a7ec6a15ccfd639fdc9bd47d005a111dd6cdb8c02fe49608df55a3c9822986ad0b86bdea3abfdfe464");
        let sig = hexToNumArray("908e345f2e2803cd941ae88c218c96194233c9053fa1bca52124787d3cca141c36429d7652435a820c72992d5eee6317")

        let [v0] = bls12381.bls12381_min_sig_verify(sig, pk, msg);

        expect(v0).toEqual(true);
    });

    it('test_bls12381_min_sig_invalid_sig', () => {
        let msg = hexToNumArray("0201010101");
        let pk = hexToNumArray("8df101606f91f3cad7f54b8aff0f0f64c41c482d9b9f9fe81d2b607bc5f611bdfa8017cf04b47b44b222c356ef555fbd11058c52c077f5a7ec6a15ccfd639fdc9bd47d005a111dd6cdb8c02fe49608df55a3c9822986ad0b86bdea3abfdfe464");
        let sig = hexToNumArray("908e345f2e2803cd941ae88c218c96194233c9053fa1bca52124787d3cca141c36429d7652435a820c72992d5eee6317")

        let [v0] = bls12381.bls12381_min_sig_verify(sig, pk, msg);

        expect(v0).toEqual(false);
    });

    it('test_bls12381_min_pk_valid_and_invalid_sig', () => {
        let pk = hexToNumArray("868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31");
        let sig = hexToNumArray("a2cd8577944b84484ef557a7f92f0d5092779497cc470b1b97680b8f7c807d97250d310b801c7c2185c7c8a21032d45403b97530ca87bd8f05d0cf4ffceb4bcb9bf7184fb604967db7e9e6ea555bc51b25a9e41fbd51181f712aa73aaec749fe")
        let prev_sig = hexToNumArray("a96aace596906562dc525dba4dff734642d71b334d51324f9c9bcb5a3d6caf14b05cde91d6507bf4615cb4285e5b4efd1358ebc46b80b51e338f9dc46cca17cf2e046765ba857c04101a560887fa81aef101a5bb3b2350884558bd3adc72be37");
        let round = 2373935;

        let [v0] = bls12381_tests.verify_drand_round(pk, sig, prev_sig, round);
        expect(v0).toEqual(true);

        let invalid_sig = hexToNumArray("11118577944b84484ef557a7f92f0d5092779497cc470b1b97680b8f7c807d97250d310b801c7c2185c7c8a21032d45403b97530ca87bd8f05d0cf4ffceb4bcb9bf7184fb604967db7e9e6ea555bc51b25a9e41fbd51181f712aa73aaec749fe");

        let [v1] = bls12381_tests.verify_drand_round(pk, invalid_sig, prev_sig, round);
        expect(v1).toEqual(false);

        let [v2] = bls12381_tests.verify_drand_round(pk, sig, prev_sig, round + 1);
        expect(v2).toEqual(false);
    });

    it('test_bls12381_min_pk_invalid_signature_key_length', () => {
        let pk = hexToNumArray("868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31");
        let sig = hexToNumArray("cd8577944b84484ef557a7f92f0d5092779497cc470b1b97680b8f7c807d97250d310b801c7c2185c7c8a21032d45403b97530ca87bd8f05d0cf4ffceb4bcb9bf7184fb604967db7e9e6ea555bc51b25a9e41fbd51181f712aa73aaec749fe")
        let prev_sig = hexToNumArray("a96aace596906562dc525dba4dff734642d71b334d51324f9c9bcb5a3d6caf14b05cde91d6507bf4615cb4285e5b4efd1358ebc46b80b51e338f9dc46cca17cf2e046765ba857c04101a560887fa81aef101a5bb3b2350884558bd3adc72be37");
        let round = 2373935;

        let [v0] = bls12381_tests.verify_drand_round(pk, sig, prev_sig, round);
        expect(v0).toEqual(false);
    });

    it('test_bls12381_min_pk_invalid_public_key_length', () => {
        let pk = hexToNumArray("8f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31");
        let sig = hexToNumArray("a2cd8577944b84484ef557a7f92f0d5092779497cc470b1b97680b8f7c807d97250d310b801c7c2185c7c8a21032d45403b97530ca87bd8f05d0cf4ffceb4bcb9bf7184fb604967db7e9e6ea555bc51b25a9e41fbd51181f712aa73aaec749fe")
        let prev_sig = hexToNumArray("a96aace596906562dc525dba4dff734642d71b334d51324f9c9bcb5a3d6caf14b05cde91d6507bf4615cb4285e5b4efd1358ebc46b80b51e338f9dc46cca17cf2e046765ba857c04101a560887fa81aef101a5bb3b2350884558bd3adc72be37");
        let round = 2373935;

        let [v0] = bls12381_tests.verify_drand_round(pk, sig, prev_sig, round);
        expect(v0).toEqual(false);
    });

    it('test_scalar_ops', () => {
        let [zero] = bls12381.scalar_from_u64(0);
        let [one] = bls12381.scalar_from_u64(1);

        let [s0] = bls12381.scalar_zero();
        let [s1] = bls12381.scalar_one();

        let type0 = [bls12381.Scalar.$type()];
        {
            let [v0] = group_ops.equal(type0, zero, s0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
            let [v1] = group_ops.equal(type0, one, s1);
            expect(bcs_import.bool().parse(v1)).toEqual(true);
            let [v2] = group_ops.equal(type0, zero, s1);
            expect(bcs_import.bool().parse(v2)).toEqual(false);
        }

        {
            let [zero0] = bls12381.scalar_mul(zero, one);
            let [v0] = group_ops.equal(type0, zero0, zero);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [two] = bls12381.scalar_add(one, one);
        let [four] = bls12381.scalar_add(two, two);

        {
            let [a0] = bls12381.scalar_from_u64(4)
            let [v0] = group_ops.equal(type0, four, a0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [eight] = bls12381.scalar_mul(four, two);

        {
            let [a0] = bls12381.scalar_from_u64(8)
            let [v0] = group_ops.equal(type0, eight, a0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        {
            let [zero0] = bls12381.scalar_mul(zero, eight);
            let [v0] = group_ops.equal(type0, zero0, zero);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [eight2] = bls12381.scalar_mul(eight, one);
        {
            let [a0] = bls12381.scalar_from_u64(8)
            let [v0] = group_ops.equal(type0, eight2, a0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [six] = bls12381.scalar_sub(eight, two);
        {
            let [a0] = bls12381.scalar_from_u64(6)
            let [v0] = group_ops.equal(type0, six, a0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [minus_six] = bls12381.scalar_sub(two, eight);
        {
            let [a0] = bls12381.scalar_from_u64(9)
            let [three] = bls12381.scalar_add(minus_six, a0)
            let [a1] = bls12381.scalar_from_u64(3)
            let [v0] = group_ops.equal(type0, three, a1);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [three] = bls12381.scalar_div(two, six);
        {
            let [a0] = bls12381.scalar_from_u64(3)
            let [v0] = group_ops.equal(type0, three, a0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [minus_three] = bls12381.scalar_neg(three);
        {
            let [a0] = bls12381.scalar_add(minus_three, six);
            let [a1] = bls12381.scalar_from_u64(3);
            let [v0] = group_ops.equal(type0, a0, a1);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [minus_zero] = bls12381.scalar_neg(zero);
        {
            let [v0] = group_ops.equal(type0, minus_zero, zero);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [inv_three] = bls12381.scalar_inv(three);
        {
            let [a0] = bls12381.scalar_mul(six, inv_three);
            let [a1] = bls12381.scalar_from_u64(2);
            let [v0] = group_ops.equal(type0, a0, a1);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        let [order_minus_one] = bls12381.scalar_from_bytes(ORDER_MINUS_ONE_BYTES);
        bls12381.scalar_add(order_minus_one, order_minus_one);
        bls12381.scalar_mul(order_minus_one, order_minus_one);
    });

    it('test_scalar_more_ops', () => {
        let [gen] = random.new_generator_for_testing();
        let [x0] = random.generate_u32(gen);
        let x = BigInt(x0);
        let [x_scalar] = bls12381.scalar_from_u64(x);
        let [y0] = random.generate_u32(gen);
        let y = BigInt(y0);
        let [y_scalar] = bls12381.scalar_from_u64(y);


        let type0 = [bls12381.Scalar.$type()];
        {
            let [v0] = bls12381.scalar_from_u64(x + y);
            let [v1] = bls12381.scalar_add(x_scalar, y_scalar);
            let [v2] = group_ops.equal(type0, v0, v1);
            expect(bcs_import.bool().parse(v2)).toEqual(true);
        }

        {
            let [z_scalar] = bls12381.scalar_sub(x_scalar, y_scalar);
            {
                let [v0] = bls12381.scalar_from_u64(x);
                let [v1] = bls12381.scalar_add(z_scalar, y_scalar);
                let [v2] = group_ops.equal(type0, v0, v1);
                expect(bcs_import.bool().parse(v2)).toEqual(true);
            }
            {
                let [v0] = bls12381.scalar_from_u64(x * y);
                let [v1] = bls12381.scalar_mul(x_scalar, y_scalar);
                let [v2] = group_ops.equal(type0, v0, v1);
                expect(bcs_import.bool().parse(v2)).toEqual(true);
            }
        }

        {
            let [z_scalar] = bls12381.scalar_div(x_scalar, y_scalar);
            {
                let [v0] = bls12381.scalar_from_u64(y);
                let [v1] = bls12381.scalar_mul(z_scalar, x_scalar);
                let [v2] = group_ops.equal(type0, v0, v1);
                expect(bcs_import.bool().parse(v2)).toEqual(true);
            }
        }

        {
            let [z_scalar] = bls12381.scalar_neg(x_scalar);
            {
                let [v0] = bls12381.scalar_zero();
                let [v1] = bls12381.scalar_add(x_scalar, z_scalar);
                let [v2] = group_ops.equal(type0, v0, v1);
                expect(bcs_import.bool().parse(v2)).toEqual(true);
            }
        }

        {
            let [z_scalar] = bls12381.scalar_inv(x_scalar);
            {
                let [v0] = bls12381.scalar_one();
                let [v1] = bls12381.scalar_mul(x_scalar, z_scalar);
                let [v2] = group_ops.equal(type0, v0, v1);
                expect(bcs_import.bool().parse(v2)).toEqual(true);
            }
        }

        let [z] = bls12381.scalar_add(x_scalar, y_scalar);

        for (var i = 0; i < 20; i++) {
            let [new_z] = bls12381.scalar_mul(z, x_scalar);
            let [new_z_0] = bls12381.scalar_add(new_z, y_scalar);

            let [rev] = bls12381.scalar_sub(new_z_0, y_scalar);
            let [rev_0] = bls12381.scalar_div(x_scalar, rev);

            let [v0] = group_ops.equal(type0, z, rev_0);
            expect(bcs_import.bool().parse(v0)).toEqual(true);

            let [rev_as_bytes_bcs] = group_ops.bytes(type0, rev);
            let rev_as_bytes = bcs_import.vector(bcs_import.u8()).parse(rev_as_bytes_bcs);

            let [rev_scalar2] = bls12381.scalar_from_bytes(rev_as_bytes);
            let [v1] = group_ops.equal(type0, rev_scalar2, rev);
            expect(bcs_import.bool().parse(v1)).toEqual(true);

            z = new_z;
        }
    });

    it('test_scalar_to_bytes_regression', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [zero] = bls12381.scalar_from_u64(0);
        let [zero_bytes_bcs] = group_ops.bytes(type0, zero);
        let zero_bytes = bcs_import.vector(bcs_import.u8()).parse(zero_bytes_bcs);
        expect(zero_bytes).toEqual(hexToNumArray("0000000000000000000000000000000000000000000000000000000000000000"));

        let [eight] = bls12381.scalar_from_u64(8);
        let [eight_bytes_bcs] = group_ops.bytes(type0, eight);
        let eight_bytes = bcs_import.vector(bcs_import.u8()).parse(eight_bytes_bcs);
        expect(eight_bytes).toEqual(hexToNumArray("0000000000000000000000000000000000000000000000000000000000000008"));

        let [one] = bls12381.scalar_from_u64(1);
        let [minus_one] = bls12381.scalar_sub(zero, one);
        let [minus_one_bytes_bcs] = group_ops.bytes(type0, minus_one);
        let minus_one_bytes = bcs_import.vector(bcs_import.u8()).parse(minus_one_bytes_bcs);
        expect(minus_one_bytes).toEqual(hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000"));

        let [minus_eight] = bls12381.scalar_sub(zero, eight);
        let [minus_eight_bytes_bcs] = group_ops.bytes(type0, minus_eight);
        let minus_eight_bytes = bcs_import.vector(bcs_import.u8()).parse(minus_eight_bytes_bcs);
        expect(minus_eight_bytes).toEqual(hexToNumArray("73eda753299d7d483339d80809a1d80553bda402fffe5bfefffffffefffffff9"));
    });

    it('test_valid_scalar_from_bytes', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [eight] = bls12381.scalar_from_u64(8);
        let [eight_bytes_bcs] = group_ops.bytes(type0, eight);
        let eight_bytes = bcs_import.vector(bcs_import.u8()).parse(eight_bytes_bcs);

        let [eight_from_bytes] = bls12381.scalar_from_bytes(eight_bytes);
        expect(eight).toEqual(eight_from_bytes);

        let [zero] = bls12381.scalar_zero();
        let [zero_bytes_bcs] = group_ops.bytes(type0, zero);
        let zero_bytes = bcs_import.vector(bcs_import.u8()).parse(zero_bytes_bcs);
        let [zero_from_bytes] = bls12381.scalar_from_bytes(zero_bytes);
        expect(zero).toEqual(zero_from_bytes);
    });

    it('test_invalid_scalar_order', () => {
        expect(() => bls12381.scalar_from_bytes(ORDER_BYTES))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_scalar_empty', () => {
        expect(() => bls12381.scalar_from_bytes([]))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_scalar_too_short', () => {
        expect(() => bls12381.scalar_from_bytes(SHORT_SCALAR_BYTES))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_scalar_too_long', () => {
        expect(() => bls12381.scalar_from_bytes(LONG_SCALAR_BYTES))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_scalar_div', () => {
        let [a] = bls12381.scalar_from_u64(0);
        let [b] = bls12381.scalar_from_u64(10);

        expect(() => bls12381.scalar_div(a, b))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_scalar_inv', () => {
        let [a] = bls12381.scalar_from_u64(0);

        expect(() => bls12381.scalar_inv(a))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_g1_ops', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [id] = bls12381.g1_identity();
        let [g] = bls12381.g1_generator();

        let [a0] = bls12381.g1_sub(g, g);
        let [a1] = bls12381.g1_sub(id, id);
        let [a2] = bls12381.g1_add(id, g);
        let [a3] = bls12381.g1_add(g, id);

        let [v0] = group_ops.equal(type0, id, a0);
        expect(bcs_import.bool().parse(v0)).toEqual(true);

        let [v1] = group_ops.equal(type0, id, a1);
        expect(bcs_import.bool().parse(v1)).toEqual(true);

        let [v2] = group_ops.equal(type0, g, a2);
        expect(bcs_import.bool().parse(v2)).toEqual(true);

        let [v3] = group_ops.equal(type0, g, a3);
        expect(bcs_import.bool().parse(v3)).toEqual(true);

        let [two_g] = bls12381.g1_add(g, g);
        let [four_g] = bls12381.g1_add(two_g, two_g);

        {
            let [another_four_g] = bls12381.g1_add(id, four_g);
            {
                let [v0] = group_ops.equal(type0, four_g, another_four_g);
                expect(bcs_import.bool().parse(v0)).toEqual(true);
            }
        }

        {
            let [v0] = bls12381.scalar_from_u64(4);

            let [another_four_g] = bls12381.g1_mul(v0, g);
            {
                let [v0] = group_ops.equal(type0, four_g, another_four_g);
                expect(bcs_import.bool().parse(v0)).toEqual(true);
            }
        }

        {
            let [v0] = bls12381.scalar_from_u64(0);
            let [another_id] = bls12381.g1_mul(v0, g);

            let [v1] = group_ops.equal(type0, id, another_id);
            expect(bcs_import.bool().parse(v1)).toEqual(true);
        }

        {
            let [another_two_g] = bls12381.g1_sub(four_g, two_g);
            let [v0] = group_ops.equal(type0, two_g, another_two_g);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }

        {
            let [v0] = bls12381.scalar_from_u64(2);
            let [another_two_g] = bls12381.g1_div(v0, four_g);
            let [v1] = group_ops.equal(type0, two_g, another_two_g);
            expect(bcs_import.bool().parse(v1)).toEqual(true);
        }

        {
            let [minus_two_g] = bls12381.g1_neg(two_g);
            let [another_two_g] = bls12381.g1_add(minus_two_g, four_g);
            let [v1] = group_ops.equal(type0, two_g, another_two_g);
            expect(bcs_import.bool().parse(v1)).toEqual(true);
        }

        {
            let [order_minus_one] = bls12381.scalar_from_bytes(ORDER_MINUS_ONE_BYTES);
            bls12381.g1_mul(order_minus_one, g);

            let [msg1] = string.bytes("123");
            let [msg2] = string.bytes("321");
            let [hash1] = bls12381.hash_to_g1(msg1);
            let [hash2] = bls12381.hash_to_g1(msg2);
            let [hash3] = bls12381.hash_to_g1(msg1);
            let [v1] = group_ops.equal(type0, hash1, hash2);
            expect(bcs_import.bool().parse(v1)).toEqual(false);
            let [v2] = group_ops.equal(type0, hash1, hash3);
            expect(bcs_import.bool().parse(v2)).toEqual(true);
        }
    });

    it('test_g1_to_bytes_regression', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [id] = bls12381.g1_identity();
        let [id_bytes_bcs] = group_ops.bytes(type0, id);
        let id_bytes = bcs_import.vector(bcs_import.u8()).parse(id_bytes_bcs);
        expect(id_bytes).toEqual(hexToNumArray("c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"));;

        let [g] = bls12381.g1_generator();
        let [g_bytes_bcs] = group_ops.bytes(type0, g);
        let g_bytes = bcs_import.vector(bcs_import.u8()).parse(g_bytes_bcs);
        expect(g_bytes).toEqual(hexToNumArray("97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"));;

        let [v0] = bls12381.scalar_from_u64(54321);
        let [h] = bls12381.g1_mul(v0, g);
        let [h_bytes_bcs] = group_ops.bytes(type0, h);
        let h_bytes = bcs_import.vector(bcs_import.u8()).parse(h_bytes_bcs);
        expect(h_bytes).toEqual(hexToNumArray("821285b97f9c0420a2d37951edbda3d7c3ebac40c6f194faa0256f6e569eba49829cd69c27f1dd9df2dd83bac1f5aa49"));;
    });

    it('test_valid_g1_from_bytes', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [g] = bls12381.g1_generator();
        let [g_bytes_bcs] = group_ops.bytes(type0, g);
        let g_bytes = bcs_import.vector(bcs_import.u8()).parse(g_bytes_bcs);
        let [g_from_bytes] = bls12381.g1_from_bytes(g_bytes);
        expect(g).toEqual(g_from_bytes);

        let [id] = bls12381.g1_identity();
        let [id_bytes_bcs] = group_ops.bytes(type0, id);
        let id_bytes = bcs_import.vector(bcs_import.u8()).parse(id_bytes_bcs);
        let [id_from_bytes] = bls12381.g1_from_bytes(id_bytes);
        expect(id).toEqual(id_from_bytes);
    });

    it('test_invalid_g1_too_short', () => {
        expect(() => bls12381.g1_from_bytes(SHORT_G1_BYTES))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_g1_empty', () => {
        expect(() => bls12381.g1_from_bytes([]))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_g1_too_long', () => {
        expect(() => bls12381.g1_from_bytes(LONG_G1_BYTES))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_g1_div', () => {
        let [a] = bls12381.scalar_from_u64(0);
        let [b] = bls12381.g1_generator();

        expect(() => bls12381.g1_div(a, b))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_invalid_g1_empty_msg', () => {
        expect(() => bls12381.hash_to_g1([]))
            .toThrowError("VMError with status ABORTED with sub status " + 1);
    });

    it('test_uncompressed_g1_sum', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [sum] = bls12381.uncompressed_g1_sum([]);
        let [g] = bls12381.g1_identity();
        let [v0] = bls12381.g1_to_uncompressed_g1(g);

        let [v1] = group_ops.equal(type0, v0, sum);

        expect(bcs_import.bool().parse(v1)).toEqual(true);

        let [gen] = random.new_generator_for_testing();

        let elements = [];

        let [expected_result] = bls12381.g1_identity();

        for (var i = 0; i < 100; i++) {
            let [g0] = random.generate_u64(gen);
            let [scalar] = bls12381.scalar_from_u64(g0);
            let [g1] = bls12381.g1_generator();
            let [element] = bls12381.g1_mul(scalar, g1);
            let [expected_result_0] = bls12381.g1_add(expected_result, element);
            expected_result = expected_result_0;
            let [uncompressed_element] = bls12381.g1_to_uncompressed_g1(element);
            elements.push(uncompressed_element);
            let [actual_result] = bls12381.uncompressed_g1_sum(elements);
            let [g2] = bls12381.g1_to_uncompressed_g1(expected_result);
            let [v0] = group_ops.equal(type0, g2, actual_result);
            expect(bcs_import.bool().parse(v0)).toEqual(true);
        }
    });

    it('test_uncompressed_g1_sum_too_long', () => {
        let type0 = [bls12381.Scalar.$type()];

        let [gen] = random.new_generator_for_testing();

        let elements = [];
        for (var i = 0; i < 2001; i++) {
            let [g0] = random.generate_u64(gen);
            let [scalar] = bls12381.scalar_from_u64(g0);
            let [g1] = bls12381.g1_generator();
            let [element] = bls12381.g1_mul(scalar, g1);
            let [uncompressed_element] = bls12381.g1_to_uncompressed_g1(element);
            elements.push(uncompressed_element);
        }

        // console.log(elements.length)
        expect(() => bls12381.uncompressed_g1_sum(elements))
            .toThrowError("VMError with status ABORTED with sub status " + 2);
    });
});