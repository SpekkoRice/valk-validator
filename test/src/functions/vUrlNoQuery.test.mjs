'use strict';

import {describe, it}   from 'node:test';
import assert           from 'node:assert/strict';
import CONSTANTS        from '../../constants.mjs';
import Validator        from '../../../src/index.mjs';

describe('vUrlNoQuery', () => {
    it('Should validate a url string correctly', () => {
        const v = new Validator({a: 'url_noquery'});

        for (const el of [
            'http://foo.com/blah_blah',
            'http://foo.com/blah_blah/',
            'http://foo.com/blah_blah_(wikipedia)',
            'http://foo.com/blah_blah_(wikipedia)_(again)',
            'http://✪df.ws/123',
            'http://userid:password@example.com:8080',
            'http://userid:password@example.com:8080/',
            'http://userid@example.com',
            'http://userid@example.com/',
            'http://userid@example.com:8080',
            'http://userid@example.com:8080/',
            'http://userid:password@example.com',
            'http://userid:password@example.com/',
            'http://➡.ws/䨹',
            'http://⌘.ws',
            'http://⌘.ws/',
            'http://foo.com/blah_(wikipedia)#cite-1',
            'http://foo.com/blah_(wikipedia)_blah#cite-1',
            'http://foo.com/unicode_(✪)_in_parens',
            'http://☺.damowmow.com/',
            'http://j.mp',
            'ftp://foo.bar/baz',
            'http://مثال.إختبار',
            'http://例子.测试',
            'http://1337.net',
            'http://a.b-c.de',
            'http://223.255.255.254',
        ]) {
            const evaluation = v.validate({a: el});
            assert.ok(evaluation.is_valid);
            assert.deepEqual(evaluation.errors.a, []);
        }
    });

    it('Should not validate a url string with a query string as correct', () => {
        const v = new Validator({a: 'url_noquery'});

        for (const el of [
            'http://www.example.com/wpstyle/?p=364',
            'https://www.example.com/foo/?bar=baz&inga=42&quux',
            'http://foo.com/(something)?after=parens',
            'http://foo.bar/?q=Test%20URL-encoded%20stuff',
            'http://code.google.com/events/#&product=browser',
        ]) {
            const evaluation = v.validate({a: el});
            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg:'url_noquery', params: []}]);
        }
    });

    it('Should not validate other types as valid urls', () => {
        const v = new Validator({a: 'url_noquery'});

        for (const el of CONSTANTS.NOT_STRING_WITH_EMPTY) {
            const evaluation = v.validate({a: el});
            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg:'url_noquery', params: []}]);
        }
    });

    it('Should not validate strings that are urls after trimming as valid', () => {
        const v = new Validator({a: 'url_noquery'});

        for (const el of [
            'https://www.google.com   ',
            '    https://www.google.com   ',
            '    https://www.google.com',
        ]) {
            const evaluation = v.validate({a: el});
            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg:'url_noquery', params: []}]);
        }
    });

    it('Should not validate improper strings as valid urls', () => {
        const v = new Validator({a: 'url_noquery'});

        for (const el of [
            'http://',
            'http://.',
            'http://..',
            'http://../',
            'http://?',
            'http://??',
            'http://??/',
            'http://#',
            'http://##',
            'http://##/',
            'http://foo.bar?q=Spaces should be encoded',
            '//',
            '//a',
            '///a',
            '///',
            'http:///a',
            'foo.com',
            'rdar://1234',
            'h://test',
            'http:// shouldfail.com',
            ':// should fail',
            'http://foo.bar/foo(bar)baz quux',
            'ftps://foo.bar/',
            'http://-error-.invalid/',
            'http://a.b--c.de/',
            'http://-a.b.co',
            'http://a.b-.co',
            'http://0.0.0.0',
            'http://10.1.1.0',
            'http://10.1.1.255',
            'http://224.1.1.1',
            'http://1.1.1.1.1',
            'http://123.123.123',
            'http://3628126748',
            'http://.www.foo.bar/',
            'http://www.foo.bar./',
            'http://.www.foo.bar./',
            'http://10.1.1.1',
            'http://10.1.1.254',
        ]) {
            const evaluation = v.validate({a: el});
            assert.equal(evaluation.is_valid, false);
            assert.deepEqual(evaluation.errors.a, [{msg:'url_noquery', params: []}]);
        }
    });
});
