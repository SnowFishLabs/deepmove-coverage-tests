import {
    StructClass,
    get_package_address,
    get_wasm
} from "@deepmove/sui";
import {
    bcs as bcs_import
} from "@mysten/sui/bcs";

let PACKAGE_NAME: string = "MoveStdlib";
let PACKAGE_ADDRESS: string = "0x0000000000000000000000000000000000000000000000000000000000000001";
let MODULE_NAME: string = "type_name";

function do_get_package_address() {
    let package_address: string = get_package_address(PACKAGE_NAME);
    if (package_address) {
        return package_address;
    } else {
        return PACKAGE_ADDRESS;
    }
}

/* ============================== TypeName =============================== */

export class TypeName implements StructClass {
    $type: string = `${do_get_package_address()}::${MODULE_NAME}::TypeName`;

    name: string;

    constructor(name: string) {
        this.name = name;
    }

    into_value() {
        return this.get_value()
    }

    from_bcs_vector_t(bytes: Uint8Array) {
        let args = this.from_bcs_vector(bcs_import.vector(this.get_bcs()).parse(bytes));
        var self = this;
        return args.map(function(arg) {
            arg.$type = self.$type;
            return arg;
        })
    }

    from_bcs_t(bytes: Uint8Array) {
        let result = this.from_bcs(this.get_bcs().parse(bytes));
        result.$type = this.$type;
        return result;
    }

    serialize(arg: any) {
        return this.get_bcs().serialize(arg);
    }

    serialize_bcs() {
        return this.get_bcs()
    }

    return_bcs() {
        return this.get_bcs()
    }

    from_bcs(arg: any) {
        return TypeName.from_bcs(arg)
    }

    from_bcs_vector(args: any) {
        return TypeName.from_bcs_vector(args)
    }

    get_bcs() {
        return TypeName.bcs
    }

    get_value() {
        return this
    }

    static $type() {
        return `${do_get_package_address()}::${MODULE_NAME}::TypeName`
    }

    from(arg: TypeName) {
        this.name = arg.name;
    }

    static from_bcs(arg: {
        name: string
    }): TypeName {
        return new TypeName(arg.name)
    }

    static from_bcs_vector(args: {
        name: string
    } []): TypeName[] {
        return args.map(function(arg) {
            return new TypeName(arg.name)
        })
    }

    static get bcs() {
        return bcs_import.struct("TypeName", {
            name: bcs_import.string(),
        }).transform({
            input: (val: any) => {
                return val
            },
            output: (val) => new TypeName(val.name),
        });
    };
}

function unit_test_poison() {
    let wasm = get_wasm();

    let args: any[] = []

    wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "unit_test_poison", [], args);

}

function get < T0 extends StructClass > (type_args: string[]): [Uint8Array] {
    let wasm = get_wasm();

    let args: any[] = []

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "get", type_args, args);
    return [
        new Uint8Array(r0.Raw[0])
    ];
}

function get_with_original_ids < T0 extends StructClass > (type_args: string[]): [Uint8Array] {
    let wasm = get_wasm();

    let args: any[] = []

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "get_with_original_ids", type_args, args);
    return [
        new Uint8Array(r0.Raw[0])
    ];
}

function is_primitive(arg0: TypeName): [boolean] {
    let wasm = get_wasm();

    let args: any[] = [
        wasm.new_bytes(TypeName.bcs.serialize(arg0).toBytes(), "")
    ]

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "is_primitive", [], args);

    return [
        bcs_import.bool().parse(new Uint8Array(r0.Raw[0]))
    ];
}

function borrow_string(arg0: TypeName): [string] {
    let wasm = get_wasm();

    let args: any[] = [
        wasm.new_bytes(TypeName.bcs.serialize(arg0).toBytes(), "")
    ]

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "borrow_string", [], args);

    return [
        bcs_import.string().parse(new Uint8Array(r0.Raw[0]))
    ];
}

function get_address(arg0: TypeName): [string] {
    let wasm = get_wasm();

    let args: any[] = [
        wasm.new_bytes(TypeName.bcs.serialize(arg0).toBytes(), "")
    ]

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "get_address", [], args);

    return [
        bcs_import.string().parse(new Uint8Array(r0.Raw[0]))
    ];
}

function get_module(arg0: TypeName): [string] {
    let wasm = get_wasm();

    let args: any[] = [
        wasm.new_bytes(TypeName.bcs.serialize(arg0).toBytes(), "")
    ]

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "get_module", [], args);

    return [
        bcs_import.string().parse(new Uint8Array(r0.Raw[0]))
    ];
}

function into_string(arg0: TypeName): [string] {
    let wasm = get_wasm();

    let args: any[] = [
        wasm.new_bytes(TypeName.bcs.serialize(arg0).toBytes(), "")
    ]

    let [r0] = wasm.call_return_bcs(PACKAGE_ADDRESS, MODULE_NAME, "into_string", [], args);

    return [
        bcs_import.string().parse(new Uint8Array(r0.Raw[0]))
    ];
}

export const type_name = {
    TypeName,
    unit_test_poison,
    get,
    get_with_original_ids,
    is_primitive,
    borrow_string,
    get_address,
    get_module,
    into_string
}