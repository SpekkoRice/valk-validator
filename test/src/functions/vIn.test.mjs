'use strict';

import {describe, it}   from 'node:test';
import assert           from 'node:assert/strict';
import CONSTANTS        from '../../constants.mjs';
import Validator        from '../../../src/index.mjs';

describe('vIn', () => {
    it('Should validate correctly', () => {
        const evaluation = new Validator({
            a: 'in:<meta.a_params>',
            b: 'in:<meta.b_params>',
        }).validate({
            a: 'foo',
            b: 'Hello',
            meta: {
                a_params: ['foo', 'bar'],
                b_params: 'Hello',
            },
        });

        assert.ok(evaluation.is_valid);
        assert.deepEqual(evaluation.errors.a, []);
        assert.deepEqual(evaluation.errors.b, []);
    });

    it('Should validate a string correctly against raw values', () => {
        const validator = new Validator({a: 'in:foo,hello,bar'});
        assert.equal(validator.validate({a: 'bar'}).is_valid, false);
        assert.ok(validator.validate({a: 'foo'}));
    });

    it('Should be invalid when no params are passed', () => {
        const evaluation = new Validator({a: 'in:<meta.params>'}).validate({a: 'hello'});

        assert.equal(evaluation.is_valid, false);
        assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [undefined]}]);
    });

    it('Should be invalid when a non-array or empty array params are passed', () => {
        for (const el of CONSTANTS.NOT_ARRAY_WITH_EMPTY) {
            const evaluation = new Validator({a: 'in:<params>'}).validate({a: 'hello', params: el});

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [el]}]);
        }
    });

    it('Should return a correct error message when invalid', () => {
        const evaluation = new Validator({a: 'in:<meta.params>'}).validate({a: 'hello', meta: {params: ['foo', 'bar']}});

        assert.equal(evaluation.is_valid, false);
        assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [['foo', 'bar']]}]);
    });

    describe('String', () => {
        it('Should validate a correct primitive string check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 'el',
                b: 'lo',
                meta: {params: 'Hello'},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, []);
        });

        it('Should validate a wrong primitive string check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 'ol',
                b: 'le',
                meta: {params: 'Hello'},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: ['Hello']}]);
            assert.deepEqual(evaluation.errors.b, [{msg: 'in', params: ['Hello']}]);
        });

        it('Should take case sensitivity into account for primitive string checks', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 'H',
                b: 'h',
                meta: {params: 'Hello'},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, [{msg: 'in', params: ['Hello']}]);
        });
    });

    describe('Number', () => {
        it('Should validate a correct primitive integer check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 50,
                b: 250,
                meta: {params: [50, 60, 70, 80, 90, 100, 250]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, []);
        });

        it('Should validate a wrong primitive integer check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>', c: 'in:<meta.params>'}).validate({
                a: 50.2,
                b: 247,
                c: 250,
                meta: {params: [50, 60, 70, 80, 90, 100, 250]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [[50,60,70,80,90,100,250]]}]);
            assert.deepEqual(evaluation.errors.b, [{msg: 'in', params: [[50,60,70,80,90,100,250]]}]);
            assert.deepEqual(evaluation.errors.c, []);
        });
    });

    describe('Boolean', () => {
        it('Should validate a correct boolean check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: true,
                b: false,
                meta: {params: [true, false, false]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, []);
        });

        it('Should validate an incorrect boolean check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.a_params>', b: 'in:<meta.b_params>'}).validate({
                a: false,
                b: true,
                meta: {a_params: [true, true, true], b_params: [false, false, false]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [[true, true, true]]}]);
            assert.deepEqual(evaluation.errors.b, [{msg: 'in', params: [[false, false, false]]}]);
        });
    });

    describe('Date', () => {
        it('Should validate a correct date check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: new Date('1990-02-07'),
                meta: {params: [new Date('1990-02-07'), new Date('2019-02-07')]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
        });

        it('Should validate an incorrect date check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: new Date('1995-02-07'),
                meta: {params: [new Date('1990-02-07'), new Date('2019-02-07')]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params:[[new Date('1990-02-07'), new Date('2019-02-07')]]}]);
        });
    });

    describe('Object', () => {
        it('Should validate a correct object check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: {a:10, b:2},
                meta: {params: [{a: 10, b: 2}, {c: 3, d:4}]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
        });

        it('Should validate a wrong object check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: {a:10, b:1},
                meta: {params: [{a: 10, b: 2}, {c: 3, d:4}]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [[{a: 10, b: 2}, {c: 3, d:4}]]}]);
        });
    });

    describe('Array', () => {
        it('Should validate a correct array check as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: [1, 'hello', 2, 'world'],
                meta: {params: [[1, 'hello', 2, 'world'], ['foo'], ['bar']]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
        });

        it('Should validate a wrong array check as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>'}).validate({
                a: [2, 'hello', 2, 'world'],
                meta: {params: [[1, 'hello', 2, 'world'], ['foo'], ['bar']]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg: 'in', params: [[[1, 'hello', 2, 'world'], ['foo'], ['bar']]]}]);
        });
    });

    describe('Mix of types', () => {
        it('Should validate a correct check with mixed params as valid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 'Foo',
                b: true,
                meta: {params: [new Date('2019-02-17'), 'Foo', 1, 2, 3, 'Bar', true, {a: 1}]},
            });

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, []);
        });

        it('Should validate a wrong check with mixed params as invalid', () => {
            const evaluation = new Validator({a: 'in:<meta.params>', b: 'in:<meta.params>'}).validate({
                a: 'Foo',
                b: {b: 2},
                meta: {params: [new Date('2019-02-17'), 'Foo', 1, 2, 3, 'Bar', true, {a: 1}]},
            });

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, []);
            assert.deepEqual(evaluation.errors.b, [{msg: 'in', params: [[new Date('2019-02-17'), 'Foo', 1, 2, 3, 'Bar', true, {a: 1}]]}]);
        });
    });
});
