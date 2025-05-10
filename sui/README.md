# Coverage Tests

`Deepmove` wasm vm runtime coverage test for `move_stdlib_natives`, `sui_framework_natives` and `crypto natives`

# Test Steps

* clone [https://github.com/SnowFishLabs/deepmove-coverage-tests](https://github.com/SnowFishLabs/deepmove-coverage-tests) this repo
* open terminal and cd to sui directory
* `npm install` to install dependencies
* enter `deepmove` interactive client
* type `move build --test` to build move projects
* type `test` command to start coverage tests

```shell
sui@deepmove>test

 RUN  v3.1.3 E:/snowfish-projects/deepmove-coverage-tests/sui

 ✓ tests/Sui/authenticator_state.test.ts (3 tests) 451ms
   ✓ authenticator_state_test > authenticator_state_tests_basic  372ms
 ✓ tests/Sui/bag.test.ts (10 tests) 548ms
   ✓ bag_test > simple_all_functions  327ms
 ✓ tests/Sui/object_table.test.ts (6 tests) 597ms
   ✓ object_table_tests > simple_all_functions  322ms
 ✓ tests/Sui/package.test.ts (9 tests) 840ms
   ✓ package_tests > test_from_package  424ms
 ✓ tests/Sui/test_random.test.ts (14 tests) 880ms
 ✓ tests/Sui/table.test.ts (9 tests) 904ms
   ✓ table_tests > simple_all_functions  422ms
 ✓ tests/Sui/pay.test.ts (6 tests) 841ms
   ✓ pay_tests > test_coin_split_n  542ms
 ✓ tests/Sui/coin.test.ts (4 tests) 863ms
   ✓ coin_test > coin_tests_metadata  400ms
 ✓ tests/Sui/linked_table.test.ts (13 tests) 1104ms
   ✓ linked_table_tests > simple_all_functions  514ms
 ✓ tests/Sui/random.test.ts (8 tests) 1124ms
   ✓ random_tests > random_test_basic_flow  609ms
 ✓ tests/Sui/dynamic_field.test.ts (10 tests) 1087ms
   ✓ dynamic_field_tests > simple_all_functions  330ms
 ✓ tests/Sui/dynamic_object_field.test.ts (11 tests) 1098ms
   ✓ dynamic_object_field_tests > simple_all_functions  486ms
 ✓ tests/Sui/vec_map.test.ts (15 tests) 1170ms
   ✓ vec_map_tests > duplicate_key_abort  306ms
   ✓ vec_map_tests > round_trip  528ms
 ✓ tests/Sui/test_scenario.test.ts (49 tests) 2072ms
   ✓ test_scenario_tests > test_wrap_unwrap  496ms
 ✓ tests/Sui/config.test.ts (1 test) 222ms
 ✓ tests/MoveStdlib/option.test.ts (18 tests) 179ms
 ✓ tests/Sui/object_bag.test.ts (6 tests) 405ms
 ✓ tests/Sui/event.test.ts (4 tests) 257ms
 ✓ tests/Sui/table_vec.test.ts (8 tests) 367ms
 ✓ tests/MoveStdlib/uq64_64.test.ts (15 tests) 121ms
 ✓ tests/MoveStdlib/vector.test.ts (10 tests) 130ms
 ✓ tests/Sui/balance.test.ts (2 tests) 211ms
 ✓ tests/MoveStdlib/ascii.test.ts (21 tests) 235ms
 ✓ tests/Sui/borrow.test.ts (3 tests) 293ms
 ✓ tests/Sui/vec_set.test.ts (6 tests) 447ms
 ✓ tests/Sui/hex.test.ts (8 tests) 282ms
 ✓ tests/Sui/deny_list.test.ts (3 tests) 336ms
 ✓ tests/MoveStdlib/uq32_32.test.ts (15 tests) 97ms
 ✓ tests/Sui/crypto/bls12381.test.ts (26 tests) 6476ms
   ✓ bls12381_tests > test  843ms
   ✓ bls12381_tests > test_uncompressed_g1_sum  686ms
   ✓ bls12381_tests > test_uncompressed_g1_sum_too_long  4693ms
 ✓ tests/MoveStdlib/bit_vector.test.ts (6 tests) 127ms
 ✓ tests/MoveStdlib/string.test.ts (13 tests) 107ms
 ✓ tests/Sui/address.test.ts (7 tests) 137ms
 ✓ tests/MoveStdlib/u128.test.ts (12 tests) 113ms
 ✓ tests/MoveStdlib/u64.test.ts (11 tests) 118ms
 ✓ tests/MoveStdlib/u256.test.ts (11 tests) 171ms
 ✓ tests/Sui/display.test.ts (1 test) 209ms
 ✓ tests/Sui/math.test.ts (6 tests) 452ms
   ✓ math_tests > test_perfect_sqrt  347ms
 ✓ tests/MoveStdlib/u16.test.ts (9 tests) 159ms
 ✓ tests/MoveStdlib/type_name.test.ts (5 tests) 214ms
 ✓ tests/Sui/object.test.ts (1 test) 204ms
 ✓ tests/Sui/versioned.test.ts (1 test) 197ms
 ✓ tests/MoveStdlib/u32.test.ts (10 tests) 108ms
 ✓ tests/MoveStdlib/u8.test.ts (8 tests) 126ms
 ✓ tests/MoveStdlib/fixed_point32.test.ts (5 tests) 74ms
 ✓ tests/Sui/clock.test.ts (1 test) 112ms
 ✓ tests/Sui/verifier.test.ts (2 tests) 117ms
 ✓ tests/Sui/crypto/ecdsa_k1.test.ts (1 test) 92ms
 ✓ tests/Sui/bcs.test.ts (2 tests) 125ms
 ✓ tests/Sui/url.test.ts (1 test) 92ms
 ✓ tests/Sui/tx_context.test.ts (1 test) 142ms
 ✓ tests/Sui/crypto/zklogin_verified_issuer.test.ts (1 test) 202ms
 ✓ tests/Sui/crypto/ed25519.test.ts (1 test) 56ms
 ✓ tests/Sui/crypto/groth16.test.ts (1 test) 189ms
 ✓ tests/Sui/crypto/zklogin_verified_id.test.ts (1 test) 128ms
 ✓ tests/Sui/crypto/hash.test.ts (1 test) 66ms
 ✓ tests/Sui/crypto/ecvrf.test.ts (1 test) 72ms
 ✓ tests/Sui/crypto/ecdsa_r1.test.ts (1 test) 51ms
 ✓ tests/MoveStdlib/address.test.ts (1 test) 43ms
 ✓ tests/Sui/crypto/hmac.test.ts (1 test) 31ms
 ✓ tests/Sui/crypto/poseidon.test.ts (1 test) 1845ms
   ✓ poseidon_tests > test_poseidon_bn254_hash  1840ms
 ✓ tests/Sui/crypto/vdf.test.ts (1 test) 1023ms
   ✓ vdf_tests > test_hash_to_input  1019ms

 Test Files  61 passed (61)
      Tests  438 passed (438)
   Start at  10:36:13
   Duration  17.67s (transform 5.65s, setup 0ms, collect 163.73s, tests 30.54s, environment 18ms, prepare 19.05s)
```