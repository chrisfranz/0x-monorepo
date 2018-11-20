import * as chai from 'chai';
import * as ethUtil from 'ethereumjs-util';
import 'mocha';

import { AbiEncoder, BigNumber } from '../src/';

import * as AbiSamples from './abi_samples';
import * as OptimizedAbis from './optimizer_abis';
import * as ReturnValueAbis from './return_value_abis';
import { chaiSetup } from './utils/chai_setup';

chaiSetup.configure();
const expect = chai.expect;

describe.only('ABI Encoder', () => {
    describe('Decode Return Values', () => {
        it('No Return Value', async () => {
            // Decode return value
            const method = new AbiEncoder.Method(ReturnValueAbis.noReturnValues);
            const returnValue = '0x';
            const decodedReturnValue = method.decodeReturnValues(returnValue);
            const expectedDecodedReturnValue: any[] = [];
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(expectedDecodedReturnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
        it('Single static return value', async () => {
            // Generate Return Value
            const method = new AbiEncoder.Method(ReturnValueAbis.singleStaticReturnValue);
            const returnValue = ['0x01020304'];
            const encodedReturnValue = method.encodeReturnValues(returnValue);
            const decodedReturnValue = method.decodeReturnValues(encodedReturnValue);
            // Validate decoded return value
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(returnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
        it('Multiple static return values', async () => {
            // Generate Return Value
            const method = new AbiEncoder.Method(ReturnValueAbis.multipleStaticReturnValues);
            const returnValue = ['0x01020304', '0x05060708'];
            const encodedReturnValue = method.encodeReturnValues(returnValue);
            const decodedReturnValue = method.decodeReturnValues(encodedReturnValue);
            // Validate decoded return value
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(returnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
        it('Single dynamic return value', async () => {
            // Generate Return Value
            const method = new AbiEncoder.Method(ReturnValueAbis.singleDynamicReturnValue);
            const returnValue = ['0x01020304'];
            const encodedReturnValue = method.encodeReturnValues(returnValue);
            const decodedReturnValue = method.decodeReturnValues(encodedReturnValue);
            // Validate decoded return value
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(returnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
        it('Multiple dynamic return values', async () => {
            // Generate Return Value
            const method = new AbiEncoder.Method(ReturnValueAbis.multipleDynamicReturnValues);
            const returnValue = ['0x01020304', '0x05060708'];
            const encodedReturnValue = method.encodeReturnValues(returnValue);
            const decodedReturnValue = method.decodeReturnValues(encodedReturnValue);
            // Validate decoded return value
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(returnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
        it('Mixed static/dynamic return values', async () => {
            // Generate Return Value
            const method = new AbiEncoder.Method(ReturnValueAbis.mixedStaticAndDynamicReturnValues);
            const returnValue = ['0x01020304', '0x05060708'];
            const encodedReturnValue = method.encodeReturnValues(returnValue);
            const decodedReturnValue = method.decodeReturnValues(encodedReturnValue);
            // Validate decoded return value
            const decodedReturnValueJson = JSON.stringify(decodedReturnValue);
            const expectedDecodedReturnValueJson = JSON.stringify(returnValue);
            expect(decodedReturnValueJson).to.be.equal(expectedDecodedReturnValueJson);
        });
    });

    describe('Optimizer', () => {
        it('Duplicate Dynamic Arrays with Static Elements', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateDynamicArraysWithStaticElements);
            const array1 = [new BigNumber(100), new BigNumber(150)];
            const array2 = array1;
            const args = [array1, array2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x7221063300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000096';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Dynamic Arrays with Dynamic Elements', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateDynamicArraysWithDynamicElements);
            const array1 = ['Hello', 'World'];
            const array2 = array1;
            const args = [array1, array2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0xbb4f12e300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Static Arrays with Static Elements (should not optimize)', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateStaticArraysWithStaticElements);
            const array1 = [new BigNumber(100), new BigNumber(150)];
            const array2 = array1;
            const args = [array1, array2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x7f8130430000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000009600000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000096';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            const unoptimizedCalldata = method.encode(args);
            expect(optimizedCalldata).to.be.equal(unoptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Static Arrays with Dynamic Elements', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateStaticArraysWithDynamicElements);
            const array1 = ['Hello', 'World'];
            const array2 = array1;
            const args = [array1, array2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x9fe31f8e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Array Elements (should optimize)', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateArrayElements);
            const strings = ['Hello', 'World', 'Hello', 'World'];
            const args = [strings];
            // Validate calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x13e751a900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Tuple Fields', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTupleFields);
            const tuple = ['Hello', 'Hello'];
            const args = [tuple];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x16780a5e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Strings', async () => {
            // Description:
            //   Two dynamic arrays with the same values.
            //   In the optimized calldata, only one set of elements should be included.
            //   Both arrays should point to this set.
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateStrings);
            const args = ['Hello', 'Hello'];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x07370bfa00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Bytes', async () => {
            // Description:
            //   Two dynamic arrays with the same values.
            //   In the optimized calldata, only one set of elements should be included.
            //   Both arrays should point to this set.
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateBytes);
            const value = '0x01020304050607080910111213141516171819202122232425262728293031323334353637383940';
            const args = [value, value];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x6045e42900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002801020304050607080910111213141516171819202122232425262728293031323334353637383940000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Tuples', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTuples);
            const tuple1 = ['Hello, World!', new BigNumber(424234)];
            const tuple2 = tuple1;
            const args = [tuple1, tuple2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x564f826d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000006792a000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c642100000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Fields Across Two Tuples', async () => {
            // Description:
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTuples);
            const tuple1 = ['Hello, World!', new BigNumber(1)];
            const tuple2 = [tuple1[0], new BigNumber(2)];
            const args = [tuple1, tuple2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x564f826d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c642100000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Arrays, Nested in Separate Tuples', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateArraysNestedInTuples);
            const array = [new BigNumber(100), new BigNumber(150), new BigNumber(200)];
            const tuple1 = [array];
            const tuple2 = [array, 'extra argument to prevent exactly matching the tuples'];
            const args = [tuple1, tuple2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x18970a9e000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000009600000000000000000000000000000000000000000000000000000000000000c80000000000000000000000000000000000000000000000000000000000000035657874726120617267756d656e7420746f2070726576656e742065786163746c79206d61746368696e6720746865207475706c65730000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Tuples, Nested in Separate Tuples', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTuplesNestedInTuples);
            const nestedTuple = ['Hello, World!'];
            const tuple1 = [nestedTuple];
            const tuple2 = [nestedTuple, 'extra argument to prevent exactly matching the tuples'];
            const args = [tuple1, tuple2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x0b4d2e6a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c6421000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035657874726120617267756d656e7420746f2070726576656e742065786163746c79206d61746368696e6720746865207475706c65730000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Two-Dimensional Arrays', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTwoDimensionalArrays);
            const twoDimArray1 = [['Hello', 'World'], ['Foo', 'Bar', 'Zaa']];
            const twoDimArray2 = twoDimArray1;
            const args = [twoDimArray1, twoDimArray2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: false });
            const expectedOptimizedCalldata =
                '0x0d28c4f9000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000003466f6f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003426172000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035a61610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000003466f6f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003426172000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035a61610000000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Duplicate Array, Nested within Separate Two-Dimensional Arrays', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.duplicateTwoDimensionalArrays);
            const twoDimArray1 = [['Hello', 'World'], ['Foo']];
            const twoDimArray2 = [['Hello', 'World'], ['Bar']];
            const args = [twoDimArray1, twoDimArray2];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x0d28c4f900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003466f6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034261720000000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Array Elements Duplicated as Tuple Fields', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.arrayElementsDuplicatedAsTupleFields);
            const array = [new BigNumber(100), new BigNumber(150), new BigNumber(200), new BigNumber(225)];
            const tuple = [[array[0]], [array[1]], [array[2]], [array[3]]];
            const args = [array, tuple];
            // Validata calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0x5b5c78fd0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000009600000000000000000000000000000000000000000000000000000000000000c800000000000000000000000000000000000000000000000000000000000000e1';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
        it('Array Elements Duplicated as Separate Parameter', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(OptimizedAbis.arrayElementsDuplicatedAsSeparateParameter);
            const array = ['Hello', 'Hello', 'Hello', 'World'];
            const str = 'Hello';
            const args = [array, str];
            // Validate calldata
            const optimizedCalldata = method.encode(args, { optimize: true });
            const expectedOptimizedCalldata =
                '0xe0e0d34900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';
            expect(optimizedCalldata).to.be.equal(expectedOptimizedCalldata);
            // Validate decoding
            const decodedArgs = method.decode(optimizedCalldata);
            const decodedArgsJson = JSON.stringify(decodedArgs);
            const argsJson = JSON.stringify(args);
            expect(decodedArgsJson).to.be.equal(argsJson);
        });
    });

    describe('Method ABIs', () => {
        it('Types with default widths', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.typesWithDefaultWidthsAbi);
            const args = [
                new BigNumber(1),
                new BigNumber(-1),
                '0x56',
                [new BigNumber(1)],
                [new BigNumber(-1)],
                ['0x56'],
            ];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x09f2b0c30000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff560000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000015600000000000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Array of Static Tuples (Array has defined length)', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.arrayOfStaticTuplesWithDefinedLengthAbi);
            let value = 0;
            const arrayOfTuples = [];
            const arrayOfTuplesLength = 8;
            for (let i = 0; i < arrayOfTuplesLength; ++i) {
                arrayOfTuples.push([new BigNumber(++value), new BigNumber(++value)]);
            }
            const args = [arrayOfTuples];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x9eb20969000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Array of Static Tuples (Array has dynamic length)', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.arrayOfStaticTuplesWithDynamicLengthAbi);
            let value = 0;
            const arrayOfTuples = [];
            const arrayOfTuplesLength = 8;
            for (let i = 0; i < arrayOfTuplesLength; ++i) {
                arrayOfTuples.push([new BigNumber(++value), new BigNumber(++value)]);
            }
            const args = [arrayOfTuples];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x63275d6e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Array of Dynamic Tuples (Array has defined length)', async () => {
            // Generate Calldata
            const method = new AbiEncoder.Method(AbiSamples.arrayOfDynamicTuplesWithDefinedLengthAbi);
            let value = 0;
            const arrayOfTuples = [];
            const arrayOfTuplesLength = 8;
            for (let i = 0; i < arrayOfTuplesLength; ++i) {
                arrayOfTuples.push([new BigNumber(++value), new BigNumber(++value).toString()]);
            }
            const args = [arrayOfTuples];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0xdeedb00f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000132000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000013400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000138000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023132000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023134000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023136000000000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Array of Dynamic Tuples (Array has dynamic length)', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.arrayOfDynamicTuplesWithUndefinedLengthAbi);
            let value = 0;
            const arrayOfTuples = [];
            const arrayOfTuplesLength = 8;
            for (let i = 0; i < arrayOfTuplesLength; ++i) {
                arrayOfTuples.push([new BigNumber(++value), new BigNumber(++value).toString()]);
            }
            const args = [arrayOfTuples];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x60c847fb000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000280000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000132000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000013400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000138000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023130000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023132000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023134000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000023136000000000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Multidimensional Arrays / Static Members', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.multiDimensionalArraysStaticTypeAbi);
            // Eight 3-dimensional arrays of uint8[2][2][2]
            let value = 0;
            const args = [];
            const argsLength = 8;
            for (let i = 0; i < argsLength; ++i) {
                args.push([
                    [
                        [new BigNumber(++value), new BigNumber(++value)],
                        [new BigNumber(++value), new BigNumber(++value)],
                    ],
                    [
                        [new BigNumber(++value), new BigNumber(++value)],
                        [new BigNumber(++value), new BigNumber(++value)],
                    ],
                ]);
            }
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0xc2f47d6f00000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000480000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000009600000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000d400000000000000000000000000000000000000000000000000000000000000e600000000000000000000000000000000000000000000000000000000000000039000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000003b000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000003d000000000000000000000000000000000000000000000000000000000000003e000000000000000000000000000000000000000000000000000000000000003f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000130000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001500000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000210000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000230000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000025000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000027000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000029000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000002b000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002d000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000002f0000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003100000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000033000000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000035000000000000000000000000000000000000000000000000000000000000003600000000000000000000000000000000000000000000000000000000000000370000000000000000000000000000000000000000000000000000000000000038';
            expect(calldata).to.be.equal(expectedCalldata);
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Multidimensional Arrays / Dynamic Members', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.multiDimensionalArraysDynamicTypeAbi);
            // Eight 3-dimensional arrays of string[2][2][2]
            let value = 0;
            const args = [];
            const argsLength = 4;
            for (let i = 0; i < argsLength; ++i) {
                args.push([
                    [
                        [new BigNumber(++value).toString(), new BigNumber(++value).toString()],
                        [new BigNumber(++value).toString(), new BigNumber(++value).toString()],
                    ],
                    [
                        [new BigNumber(++value).toString(), new BigNumber(++value).toString()],
                        [new BigNumber(++value).toString(), new BigNumber(++value).toString()],
                    ],
                ]);
            }
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x81534ebd0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000009a00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000131000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000013300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000134000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000137000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000139000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002313000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000023131000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000231320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002313300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023134000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000231350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002313600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000231370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002313800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000023139000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000232300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000023231000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000232320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002323300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000232350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002323600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000232370000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002323800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002323900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002333100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023332000000000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Fixed Length Array / Dynamic Members', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.staticArrayDynamicMembersAbi);
            const args = [['Brave', 'New', 'World']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x243a6e6e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000005427261766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034e657700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Fixed Length Array / Dynamic Members', async () => {
            // Generaet calldata
            const method = new AbiEncoder.Method(AbiSamples.staticArrayDynamicMembersAbi);
            const args = [['Brave', 'New', 'World']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x243a6e6e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000005427261766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034e657700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Unfixed Length Array / Dynamic Members ABI', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.dynamicArrayDynamicMembersAbi);
            const args = [['Brave', 'New', 'World']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x13e751a900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000005427261766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034e657700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005576f726c64000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Unfixed Length Array / Static Members ABI', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.dynamicArrayStaticMembersAbi);
            const args = [[new BigNumber(127), new BigNumber(14), new BigNumber(54)]];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x4fc8a83300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000036';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Fixed Length Array / Static Members ABI', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.staticArrayAbi);
            const args = [[new BigNumber(127), new BigNumber(14), new BigNumber(54)]];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0xf68ade72000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000036';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Array ABI', async () => {
            // Generate calldata
            const method = new AbiEncoder.Method(AbiSamples.stringAbi);
            const args = [['five', 'six', 'seven']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x13e751a900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000046669766500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000373697800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005736576656e000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Static Tuple', async () => {
            // Generate calldata
            // This is dynamic because it has dynamic members
            const method = new AbiEncoder.Method(AbiSamples.staticTupleAbi);
            const args = [[new BigNumber(5), new BigNumber(10), new BigNumber(15), false]];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0xa9125e150000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Dynamic Tuple (Array input)', async () => {
            // Generate calldata
            // This is dynamic because it has dynamic members
            const method = new AbiEncoder.Method(AbiSamples.dynamicTupleAbi);
            const args = [[new BigNumber(5), 'five']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x5b998f3500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000046669766500000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Dynamic Tuple (Object input)', async () => {
            // Generate Calldata
            // This is dynamic because it has dynamic members
            const method = new AbiEncoder.Method(AbiSamples.dynamicTupleAbi);
            const args = [[new BigNumber(5), 'five']];
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x5b998f3500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000046669766500000000000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Large, Flat ABI', async () => {
            // Construct calldata
            const method = new AbiEncoder.Method(AbiSamples.largeFlatAbi);
            const args = [
                new BigNumber(256745454),
                new BigNumber(-256745454),
                new BigNumber(434244),
                '0x43',
                '0x0001020304050607080911121314151617181920212223242526272829303132',
                '0x0001020304050607080911121314151617181920212223242526272829303132080911121314151617181920212223242526272829303132',
                'Little peter piper piped a piping pepper pot',
                '0xe41d2489571d322189246dafa5ebde1f4699f498',
                true,
            ];
            // Validate calldata
            const calldata = method.encode(args);
            const expectedCalldata =
                '0x312d4d42000000000000000000000000000000000000000000000000000000000f4d9feefffffffffffffffffffffffffffffffffffffffffffffffffffffffff0b26012000000000000000000000000000000000000000000000000000000000006a0444300000000000000000000000000000000000000000000000000000000000000000102030405060708091112131415161718192021222324252627282930313200000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000180000000000000000000000000e41d2489571d322189246dafa5ebde1f4699f4980000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000003800010203040506070809111213141516171819202122232425262728293031320809111213141516171819202122232425262728293031320000000000000000000000000000000000000000000000000000000000000000000000000000002c4c6974746c65207065746572207069706572207069706564206120706970696e672070657070657220706f740000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata);
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
        it('Large, Nested ABI', async () => {
            // Construct Calldata
            const method = new AbiEncoder.Method(AbiSamples.largeNestedAbi);
            const someStaticArray = [new BigNumber(127), new BigNumber(14), new BigNumber(54)];
            const someStaticArrayWithDynamicMembers = [
                'the little piping piper piped a piping pipper papper',
                'the kid knows how to write poems, what can I say -- I guess theres a lot I could say to try to fill this line with a lot of text.',
            ];
            const someDynamicArrayWithDynamicMembers = [
                '0x38745637834987324827439287423897238947239847',
                '0x7283472398237423984723984729847248927498748974284728947239487498749847874329423743492347329847239842374892374892374892347238947289478947489374289472894738942749823743298742389472389473289472389437249823749823742893472398',
                '0x283473298473248923749238742398742398472894729843278942374982374892374892743982',
            ];
            const some2DArray = [
                [
                    'some string',
                    'some another string',
                    'there are just too many stringsup in',
                    'here',
                    'yall ghonna make me lose my mind',
                ],
                [
                    'the little piping piper piped a piping pipper papper',
                    'the kid knows how to write poems, what can I say -- I guess theres a lot I could say to try to fill this line with a lot of text.',
                ],
                [],
            ];
            const someTuple = {
                someUint32: new BigNumber(4037824789),
                someStr:
                    'the kid knows how to write poems, what can I say -- I guess theres a lot I could say to try to fill this line with a lot of text.',
            };
            const someTupleWithDynamicTypes = {
                someUint: new BigNumber(4024789),
                someStr: 'akdhjasjkdhasjkldshdjahdkjsahdajksdhsajkdhsajkdhadjkashdjksadhajkdhsajkdhsadjk',
                someBytes: '0x29384723894723843743289742389472398473289472348927489274894738427428947389facdea',
                someAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
            };
            const someTupleWithDynamicTypes2 = {
                someUint: new BigNumber(9024789),
                someStr: 'ksdhsajkdhsajkdhadjkashdjksadhajkdhsajkdhsadjkakdhjasjkdhasjkldshdjahdkjsahdaj',
                someBytes: '0x29384723894398473289472348927489272384374328974238947274894738427428947389facde1',
                someAddress: '0x746dafa5ebde1f4699f4981d3221892e41d24895',
            };
            const someTupleWithDynamicTypes3 = {
                someUint: new BigNumber(1024789),
                someStr: 'sdhsajkdhsajkdhadjkashdjakdhjasjkdhasjkldshdjahdkjsahdajkksadhajkdhsajkdhsadjk',
                someBytes: '0x38947238437432829384729742389472398473289472348927489274894738427428947389facdef',
                someAddress: '0x89571d322189e415ebde1f4699f498d24246dafa',
            };
            const someArrayOfTuplesWithDynamicTypes = [someTupleWithDynamicTypes2, someTupleWithDynamicTypes3];
            const args = {
                someStaticArray,
                someStaticArrayWithDynamicMembers,
                someDynamicArrayWithDynamicMembers,
                some2DArray,
                someTuple,
                someTupleWithDynamicTypes,
                someArrayOfTuplesWithDynamicTypes,
            };
            const calldata = method.encode(args);
            // Validate calldata
            const expectedCalldata =
                '0x4b49031c000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000088000000000000000000000000000000000000000000000000000000000000009800000000000000000000000000000000000000000000000000000000000000ae0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000034746865206c6974746c6520706970696e67207069706572207069706564206120706970696e6720706970706572207061707065720000000000000000000000000000000000000000000000000000000000000000000000000000000000000081746865206b6964206b6e6f777320686f7720746f20777269746520706f656d732c20776861742063616e204920736179202d2d2049206775657373207468657265732061206c6f74204920636f756c642073617920746f2074727920746f2066696c6c2074686973206c696e6520776974682061206c6f74206f6620746578742e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000163874563783498732482743928742389723894723984700000000000000000000000000000000000000000000000000000000000000000000000000000000006e72834723982374239847239847298472489274987489742847289472394874987498478743294237434923473298472398423748923748923748923472389472894789474893742894728947389427498237432987423894723894732894723894372498237498237428934723980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000027283473298473248923749238742398742398472894729843278942374982374892374892743982000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000b736f6d6520737472696e670000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013736f6d6520616e6f7468657220737472696e67000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024746865726520617265206a75737420746f6f206d616e7920737472696e6773757020696e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046865726500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002079616c6c2067686f6e6e61206d616b65206d65206c6f7365206d79206d696e640000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000034746865206c6974746c6520706970696e67207069706572207069706564206120706970696e6720706970706572207061707065720000000000000000000000000000000000000000000000000000000000000000000000000000000000000081746865206b6964206b6e6f777320686f7720746f20777269746520706f656d732c20776861742063616e204920736179202d2d2049206775657373207468657265732061206c6f74204920636f756c642073617920746f2074727920746f2066696c6c2074686973206c696e6520776974682061206c6f74206f6620746578742e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f0ac511500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000081746865206b6964206b6e6f777320686f7720746f20777269746520706f656d732c20776861742063616e204920736179202d2d2049206775657373207468657265732061206c6f74204920636f756c642073617920746f2074727920746f2066696c6c2074686973206c696e6520776974682061206c6f74206f6620746578742e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003d69d500000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000e41d2489571d322189246dafa5ebde1f4699f498000000000000000000000000000000000000000000000000000000000000004e616b64686a61736a6b646861736a6b6c647368646a6168646b6a73616864616a6b73646873616a6b646873616a6b646861646a6b617368646a6b73616468616a6b646873616a6b64687361646a6b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002829384723894723843743289742389472398473289472348927489274894738427428947389facdea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000089b51500000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000746dafa5ebde1f4699f4981d3221892e41d24895000000000000000000000000000000000000000000000000000000000000004e6b73646873616a6b646873616a6b646861646a6b617368646a6b73616468616a6b646873616a6b64687361646a6b616b64686a61736a6b646861736a6b6c647368646a6168646b6a73616864616a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002829384723894398473289472348927489272384374328974238947274894738427428947389facde100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fa3150000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000089571d322189e415ebde1f4699f498d24246dafa000000000000000000000000000000000000000000000000000000000000004e73646873616a6b646873616a6b646861646a6b617368646a616b64686a61736a6b646861736a6b6c647368646a6168646b6a73616864616a6b6b73616468616a6b646873616a6b64687361646a6b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002838947238437432829384729742389472398473289472348927489274894738427428947389facdef000000000000000000000000000000000000000000000000';
            expect(calldata).to.be.equal(expectedCalldata);
            // Validate decoding
            const expectedDecodedValueJson = JSON.stringify(args);
            const decodedValue = method.decode(calldata, { structsAsObjects: true });
            const decodedValueJson = JSON.stringify(decodedValue);
            expect(decodedValueJson).to.be.equal(expectedDecodedValueJson);
        });
    });

    describe('Array', () => {
        it('Fixed size; Static elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'int[2]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = [new BigNumber(5), new BigNumber(6)];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Dynamic size; Static elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'int[]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = [new BigNumber(5), new BigNumber(6)];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Fixed size; Dynamic elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'string[2]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = ['Hello', 'world'];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c64000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Dynamic size; Dynamic elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'string[]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = ['Hello', 'world'];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005776f726c64000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Dynamic Size; Multidimensional; Dynamic Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'bytes[][]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708', '0x09101112'];
            const array2 = ['0x10111213', '0x14151617'];
            const array3 = ['0x18192021'];
            const args = [array1, array2, array3];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000040102030400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000405060708000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004091011120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000041011121300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000414151617000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000041819202100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Dynamic Size; Multidimensional; Static Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'bytes4[][]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708', '0x09101112'];
            const array2 = ['0x10111213', '0x14151617'];
            const array3 = ['0x18192021'];
            const args = [array1, array2, array3];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x0000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000301020304000000000000000000000000000000000000000000000000000000000506070800000000000000000000000000000000000000000000000000000000091011120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021011121300000000000000000000000000000000000000000000000000000000141516170000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011819202100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Static Size; Multidimensional; Static Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'bytes4[3][2]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708', '0x09101112'];
            const array2 = ['0x10111213', '0x14151617', '0x18192021'];
            const args = [array1, array2];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x010203040000000000000000000000000000000000000000000000000000000005060708000000000000000000000000000000000000000000000000000000000910111200000000000000000000000000000000000000000000000000000000101112130000000000000000000000000000000000000000000000000000000014151617000000000000000000000000000000000000000000000000000000001819202100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Static Size; Multidimensional; Dynamic Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'bytes[3][2]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708', '0x09101112'];
            const array2 = ['0x10111213', '0x14151617', '0x18192021'];
            const args = [array1, array2];
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000401020304000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004050607080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040910111200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000410111213000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004141516170000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041819202100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Static size; Too Few Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'string[3]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = ['Hello', 'world'];
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw('Expected array of 3 elements, but got array of length 2');
        });
        it('Static size; Too Many Elements', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'string[1]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = ['Hello', 'world'];
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw('Expected array of 1 elements, but got array of length 2');
        });
        it('Element Type Mismatch', async () => {
            // Create DataType object
            const testDataItem = { name: 'testArray', type: 'uint[]' };
            const dataType = new AbiEncoder.SolArray(testDataItem);
            // Construct args to be encoded
            const args = [new BigNumber(1), 'Bad Argument'];
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
    });

    describe('Tuple', () => {
        it('Static elements only', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field_1', type: 'int32' }, { name: 'field_2', type: 'bool' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { field_1: new BigNumber(-5), field_2: true };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Dynamic elements only', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field_1', type: 'string' }, { name: 'field_2', type: 'bytes' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { field_1: 'Hello, World!', field_2: '0xabcdef0123456789' };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c6421000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008abcdef0123456789000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Nested Static Array', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field', type: 'uint[2]' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { field: [new BigNumber(1), new BigNumber(2)] };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Nested Dynamic Array', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field', type: 'uint[]' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { field: [new BigNumber(1), new BigNumber(2)] };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Nested Static Multidimensional Array', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field', type: 'bytes4[2][2]' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708'];
            const array2 = ['0x09101112', '0x13141516'];
            const args = { field: [array1, array2] };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x0102030400000000000000000000000000000000000000000000000000000000050607080000000000000000000000000000000000000000000000000000000009101112000000000000000000000000000000000000000000000000000000001314151600000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Nested Dynamic Multidimensional Array', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field', type: 'bytes[2][2]' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const array1 = ['0x01020304', '0x05060708'];
            const array2 = ['0x09101112', '0x13141516'];
            const args = { field: [array1, array2] };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004010203040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040506070800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004091011120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041314151600000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Static and dynamic elements mixed', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [
                    { name: 'field_1', type: 'int32' },
                    { name: 'field_2', type: 'string' },
                    { name: 'field_3', type: 'bool' },
                    { name: 'field_4', type: 'bytes' },
                ],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = {
                field_1: new BigNumber(-5),
                field_2: 'Hello, World!',
                field_3: true,
                field_4: '0xabcdef0123456789',
            };
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c6421000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008abcdef0123456789000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodingRules: AbiEncoder.DecodingRules = { structsAsObjects: true };
            const decodedArgs = dataType.decode(encodedArgs, decodingRules);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Missing Key', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field_1', type: 'int32' }, { name: 'field_2', type: 'bool' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { field_1: new BigNumber(-5) };
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw('Could not assign tuple to object: missing keys field_2');
        });
        it('Bad Key', async () => {
            // Create DataType object
            const testDataItem = {
                name: 'Tuple',
                type: 'tuple',
                components: [{ name: 'field_1', type: 'int32' }, { name: 'field_2', type: 'bool' }],
            };
            const dataType = new AbiEncoder.Tuple(testDataItem);
            // Construct args to be encoded
            const args = { unknown_field: new BigNumber(-5) };
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw("Could not assign tuple to object: unrecognized key 'unknown_field' in object Tuple");
        });
    });

    describe('Address', () => {
        it('Valid Address', async () => {
            // Create DataType object
            const testDataItem = { name: 'Address', type: 'address' };
            const dataType = new AbiEncoder.Address(testDataItem);
            // Construct args to be encoded
            const args = '0xe41d2489571d322189246dafa5ebde1f4699f498';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x000000000000000000000000e41d2489571d322189246dafa5ebde1f4699f498';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Invalid Address - input is not valid hex', async () => {
            // Create DataType object
            const testDataItem = { name: 'Address', type: 'address' };
            const dataType = new AbiEncoder.Address(testDataItem);
            // Construct args to be encoded
            const args = 'e4';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw(AbiEncoder.Address.ERROR_MESSAGE_ADDRESS_MUST_START_WITH_0X);
        });
        it('Invalid Address - input is not 20 bytes', async () => {
            // Create DataType object
            const testDataItem = { name: 'Address', type: 'address' };
            const dataType = new AbiEncoder.Address(testDataItem);
            // Construct args to be encoded
            const args = '0xe4';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw(AbiEncoder.Address.ERROR_MESSAGE_ADDRESS_MUST_BE_20_BYTES);
        });
    });

    describe('Bool', () => {
        it('True', async () => {
            // Create DataType object
            const testDataItem = { name: 'Boolean', type: 'bool' };
            const dataType = new AbiEncoder.Bool(testDataItem);
            // Construct args to be encoded
            const args = true;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('False', async () => {
            // Create DataType object
            const testDataItem = { name: 'Boolean', type: 'bool' };
            const dataType = new AbiEncoder.Bool(testDataItem);
            // Construct args to be encoded
            const args = false;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
    });

    describe('Integer', () => {
        /* tslint:disable custom-no-magic-numbers */
        const max256BitInteger = new BigNumber(2).pow(255).minus(1);
        const min256BitInteger = new BigNumber(2).pow(255).times(-1);
        const max32BitInteger = new BigNumber(2).pow(31).minus(1);
        const min32BitInteger = new BigNumber(2).pow(31).times(-1);
        /* tslint:enable custom-no-magic-numbers */

        it('Int256 - Positive Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int256 - Negative Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(-1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int256 - Positive Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = max256BitInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int256 - Negative Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = min256BitInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = `0x8000000000000000000000000000000000000000000000000000000000000000`;
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int256 - Value too large', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = max256BitInteger.plus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('Int256 - Value too small', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (256)', type: 'int' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = min256BitInteger.minus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('Int32 - Positive Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int32 - Negative Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(-1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int32 - Positive Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = max32BitInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x000000000000000000000000000000000000000000000000000000007fffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int32 - Negative Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = min32BitInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = `0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff80000000`;
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Int32 - Value too large', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = max32BitInteger.plus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('Int32 - Value too small', async () => {
            // Create DataType object
            const testDataItem = { name: 'Integer (32)', type: 'int32' };
            const dataType = new AbiEncoder.Int(testDataItem);
            // Construct args to be encoded
            const args = min32BitInteger.minus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
    });

    describe('Unsigned Integer', () => {
        /* tslint:disable custom-no-magic-numbers */
        const max256BitUnsignedInteger = new BigNumber(2).pow(256).minus(1);
        const min256BitUnsignedInteger = new BigNumber(0);
        const max32BitUnsignedInteger = new BigNumber(2).pow(32).minus(1);
        const min32BitUnsignedInteger = new BigNumber(0);
        /* tslint:enable custom-no-magic-numbers */

        it('UInt256 - Positive Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (256)', type: 'uint' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt256 - Positive Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (256)', type: 'uint' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = max256BitUnsignedInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt256 - Zero Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (256)', type: 'uint' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = min256BitUnsignedInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = `0x0000000000000000000000000000000000000000000000000000000000000000`;
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt256 - Value too large', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (256)', type: 'uint' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = max256BitUnsignedInteger.plus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('UInt256 - Value too small', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (256)', type: 'uint' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = min256BitUnsignedInteger.minus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('UInt32 - Positive Base Case', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (32)', type: 'uint32' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = new BigNumber(1);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0000000000000000000000000000000000000000000000000000000000000001';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt32 - Positive Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (32)', type: 'uint32' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = max32BitUnsignedInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x00000000000000000000000000000000000000000000000000000000ffffffff';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt32 - Zero Value', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (32)', type: 'uint32' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = min32BitUnsignedInteger;
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = `0x0000000000000000000000000000000000000000000000000000000000000000`;
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('UInt32 - Value too large', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (32)', type: 'uint32' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = max32BitUnsignedInteger.plus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
        it('UInt32 - Value too small', async () => {
            // Create DataType object
            const testDataItem = { name: 'Unsigned Integer (32)', type: 'uint32' };
            const dataType = new AbiEncoder.UInt(testDataItem);
            // Construct args to be encoded
            const args = min32BitUnsignedInteger.minus(1);
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw();
        });
    });

    describe('Static Bytes', () => {
        it('Single Byte (byte)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Byte', type: 'byte' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x05';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0500000000000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Single Byte (bytes1)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes1', type: 'bytes1' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x05';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0500000000000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('4 Bytes (bytes4)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes4', type: 'bytes4' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x00010203';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0001020300000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('4 Bytes (bytes4); Encoder must pad input', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes4', type: 'bytes4' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const args = '0x1a18';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x1a18000000000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const paddedArgs = '0x1a180000';
            const paddedArgsAsJson = JSON.stringify(paddedArgs);
            expect(decodedArgsAsJson).to.be.equal(paddedArgsAsJson);
        });
        it('32 Bytes (bytes32)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes32', type: 'bytes32' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x0001020304050607080911121314151617181920212223242526272829303132';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x0001020304050607080911121314151617181920212223242526272829303132';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('32 Bytes (bytes32); Encoder must pad input', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes32', type: 'bytes32' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const args = '0x1a18bf61';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs = '0x1a18bf6100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const paddedArgs = '0x1a18bf6100000000000000000000000000000000000000000000000000000000';
            const paddedArgsAsJson = JSON.stringify(paddedArgs);
            expect(decodedArgsAsJson).to.be.equal(paddedArgsAsJson);
        });
        it('Should throw when pass in too many bytes (bytes4)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes4', type: 'bytes4' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x0102030405';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw(
                'Tried to assign 0x0102030405 (5 bytes), which exceeds max bytes that can be stored in a bytes4',
            );
        });
        it('Should throw when pass in too many bytes (bytes32)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes32', type: 'bytes32' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x010203040506070809101112131415161718192021222324252627282930313233';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw(
                'Tried to assign 0x010203040506070809101112131415161718192021222324252627282930313233 (33 bytes), which exceeds max bytes that can be stored in a bytes32',
            );
        });
        it('Should throw when pass in bad hex (no 0x prefix)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes32', type: 'bytes32' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0102030405060708091011121314151617181920212223242526272829303132';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw("Tried to encode non-hex value. Value must inlcude '0x' prefix.");
        });
        it('Should throw when pass in bad hex (include a half-byte)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes32', type: 'bytes32' };
            const dataType = new AbiEncoder.Byte(testDataItem);
            // Construct args to be encoded
            const args = '0x010';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw('Tried to assign 0x010, which is contains a half-byte. Use full bytes only.');
        });
    });

    describe('Dynamic Bytes', () => {
        it('Fits into one EVM word', async () => {
            // Create DataType object
            const testDataItem = { name: 'Dynamic Bytes', type: 'bytes' };
            const dataType = new AbiEncoder.Bytes(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const args = '0x1a18bf61';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000041a18bf6100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Spans multiple EVM words', async () => {
            // Create DataType object
            const testDataItem = { name: 'Dynamic Bytes', type: 'bytes' };
            const dataType = new AbiEncoder.Bytes(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const bytesLength = 40;
            const args = '0x' + '61'.repeat(bytesLength);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000002861616161616161616161616161616161616161616161616161616161616161616161616161616161000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Input as Buffer', async () => {
            // Create DataType object
            const testDataItem = { name: 'Dynamic Bytes', type: 'bytes' };
            const dataType = new AbiEncoder.Bytes(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const args = '0x1a18bf61';
            const argsAsBuffer = ethUtil.toBuffer(args);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(argsAsBuffer);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000041a18bf6100000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Should throw when pass in bad hex (no 0x prefix)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes', type: 'bytes' };
            const dataType = new AbiEncoder.Bytes(testDataItem);
            // Construct args to be encoded
            const args = '01';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw("Tried to encode non-hex value. Value must inlcude '0x' prefix. Got '01'");
        });
        it('Should throw when pass in bad hex (include a half-byte)', async () => {
            // Create DataType object
            const testDataItem = { name: 'Static Bytes', type: 'bytes' };
            const dataType = new AbiEncoder.Bytes(testDataItem);
            // Construct args to be encoded
            const args = '0x010';
            // Encode Args and validate result
            expect(() => {
                dataType.encode(args);
            }).to.throw('Tried to assign 0x010, which is contains a half-byte. Use full bytes only.');
        });
    });

    describe('String', () => {
        it('Fits into one EVM word', async () => {
            // Create DataType object
            const testDataItem = { name: 'String', type: 'string' };
            const dataType = new AbiEncoder.SolString(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const args = 'five';
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x00000000000000000000000000000000000000000000000000000000000000046669766500000000000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('Spans multiple EVM words', async () => {
            // Create DataType object
            const testDataItem = { name: 'String', type: 'string' };
            const dataType = new AbiEncoder.SolString(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const bytesLength = 40;
            const args = 'a'.repeat(bytesLength);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000002861616161616161616161616161616161616161616161616161616161616161616161616161616161000000000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
        it('String that begins with 0x prefix', async () => {
            // Create DataType object
            const testDataItem = { name: 'String', type: 'string' };
            const dataType = new AbiEncoder.SolString(testDataItem);
            // Construct args to be encoded
            // Note: There will be padding because this is a bytes32 but we are only passing in 4 bytes.
            const strLength = 40;
            const args = '0x' + 'a'.repeat(strLength);
            // Encode Args and validate result
            const encodedArgs = dataType.encode(args);
            const expectedEncodedArgs =
                '0x000000000000000000000000000000000000000000000000000000000000002a30786161616161616161616161616161616161616161616161616161616161616161616161616161616100000000000000000000000000000000000000000000';
            expect(encodedArgs).to.be.equal(expectedEncodedArgs);
            // Decode Encoded Args and validate result
            const decodedArgs = dataType.decode(encodedArgs);
            const decodedArgsAsJson = JSON.stringify(decodedArgs);
            const argsAsJson = JSON.stringify(args);
            expect(decodedArgsAsJson).to.be.equal(argsAsJson);
        });
    });
});