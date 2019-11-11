'use strict';

import Validator from '../../src/index';

describe("vLessThan", () => {

    it ('should return a correct error message when invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:10' })).validate({ a: 11 });
        expect(evaluation.is_valid).toEqual(false);
        expect(evaluation.errors.a).toEqual([{msg: 'less_than', params: ['10']}]);
    });

    it ('should allow a string as an acceptable value', () => {
        const evaluation = (new Validator({ a: 'less_than:10' })).validate({ a: 'hello' });
        expect(evaluation.is_valid).toEqual(true);
    });

    it ('should allow a numerical value as an acceptable value', () => {
        const evaluation = (new Validator({ a: 'less_than:10' })).validate({ a: 5 });
        expect(evaluation.is_valid).toEqual(true);
    });

    it ('should disallow NaN values', () => {
        const evaluation = (new Validator({ a: 'less_than:10' })).validate({ a: Number.NaN });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should only allow numerical values as parameter in the rule', () => {
        const evaluation = (new Validator({ a: 'less_than:foo' })).validate({ a: 5 });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should not allow other types as values', () => {
        const typechecks = {
            a : 100,
            b : 200,
            c : 'hello',
            d : false,
            e : true,
            f : new RegExp(),
            g : new Date(),
            h : {},
            i : [],
            j : '',
            k : new String('Foo'),
            l : new Array(),
            m : Object.create(null),
        };

        const valid_keys    = ['a', 'b', 'c', 'j', 'k'];
        const invalid_keys  = ['d', 'e', 'f', 'g', 'h', 'i', 'l', 'm'];
        const rules         = [...valid_keys, ...invalid_keys].reduce((acc, key) => {
            acc[key] = 'less_than:250';
            return acc;
        }, {});

        const evaluation = (new Validator(rules)).validate(typechecks);

        expect(evaluation.is_valid).toEqual(false);

        valid_keys.forEach(key => expect(evaluation.errors[key]).toEqual([]));
        invalid_keys.forEach(key => expect(evaluation.errors[key]).toEqual([{msg:'less_than', params: ['250']}]));
    });

//  String

    it ('should validate a string whose length is smaller than the provided parameter as valid', () => {
        const evaluation = (new Validator({ a: 'less_than:10' })).validate({ a: 'hello' });
        expect(evaluation.is_valid).toEqual(true);
    });

    it ('should validate a string whose length is equal to the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:11' })).validate({ a: 'hello world' });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should validate a string whose length is larger than the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:8' })).validate({ a: 'hello world' });
        expect(evaluation.is_valid).toEqual(false);
    });

//  Number

    it ('should validate a number smaller than the provided parameter as valid', () => {
        const evaluation = (new Validator({ a: 'less_than:1000' })).validate({ a: 950 });
        expect(evaluation.is_valid).toEqual(true);
    });

    it ('should validate a number equal to the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:42' })).validate({ a: 42 });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should validate a number larger than the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:9000' })).validate({ a: 9999 });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should validate negative number ranges that are below the provided parameter as valid', () => {
        const evaluation = (new Validator({ a: 'less_than:-500' })).validate({ a: -501 });
        expect(evaluation.is_valid).toEqual(true);
    });

    it ('should validate negative number ranges that are above the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:-20' })).validate({ a: -18 });
        expect(evaluation.is_valid).toEqual(false);
    });

    it ('should validate negative number ranges that are equal to the provided parameter as invalid', () => {
        const evaluation = (new Validator({ a: 'less_than:-999' })).validate({ a: -999 });
        expect(evaluation.is_valid).toEqual(false);
    });


});
