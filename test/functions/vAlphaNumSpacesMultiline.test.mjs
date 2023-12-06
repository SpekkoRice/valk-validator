'use strict';

import {describe, it}   from 'node:test';
import assert           from 'node:assert/strict';
import CONSTANTS        from '../constants.mjs';
import Validator        from '../../src/index.mjs';

describe('vAlphaNumSpacesMultiline', () => {
    it('Should validate a alphanumeric multiline string correctly', () => {
        for (const el of [
            //  Full set
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 \r\n',
            //  Purely alphabet
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'abcdefghijklmnopqrstuvwxyz',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'helloworld',
            'loremipsumdolorsitamet',
            //  Purely digits
            '0123456789',
            '9876543210',
            '48093320894432948239432',
            //  Random strings
            'hello world',
            'hi5',
            '8ask',
            'Hello world 123456890 this is a t3st',
            'Hello\nWorld\r\nthis is amazing right!',
            'Hi\nthis\nis\rmultiline',
        ]) {
            const evaluation = new Validator({a1: 'alpha_num_spaces_multiline'}).validate({a1: el});

            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a1, []);
        }
    });

    it('Should not validate non-string as valid', () => {
        for (const el of CONSTANTS.NOT_STRING_WITH_EMPTY) {
            const evaluation = new Validator({a1: 'alpha_num_spaces_multiline'}).validate({a1: el});

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a1, [{msg: 'alpha_num_spaces_multiline', params: []}]);
        }
    });

    it('Should not validate other non-alphanumeric strings as valid alphanumeric multiline strings', () => {
        for (const el of [
            'yyyyyyyy.',
            '! dff',
            'NoSpecialcharacters#',
            'this, is a test',
            'this: is a test',
            '[hi',
            'hi]',
            '<oh my god',
            '>oh my god',
            '{hi',
            '}hi',
            '"hi',
            '"hi',
            'this, is a test! with special characters.',
            '\'hi',
            '~`[]{}"\'.<>/!@#$%^&*()_+)=',
            '+hi',
            '=hi',
            '-hi',
            '~hi',
            '(hi',
            'hi)',
        ]) {
            const evaluation = new Validator({a1: 'alpha_num_spaces_multiline'}).validate({a1: el});

            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a1, [{msg: 'alpha_num_spaces_multiline', params: []}]);
        }
    });
});
