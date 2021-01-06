'use strict';

import Validator from '../../src/index';

describe("vUrl", () => {

    const invalids = [
        100,
        200,
        'hello',
        false,
        true,
        new RegExp(),
        new Date(),
        {},
        [],
        '',
        new String('Foo'),
        new Array(),
        Object.create(null),
    ];

    const invalid_url = [
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
    ];

    const valids = [
        "http://foo.com/blah_blah",
        "http://foo.com/blah_blah/",
        "http://foo.com/blah_blah_(wikipedia)",
        "http://foo.com/blah_blah_(wikipedia)_(again)",
        "http://www.example.com/wpstyle/?p=364",
        "https://www.example.com/foo/?bar=baz&inga=42&quux",
        "http://✪df.ws/123",
        "http://userid:password@example.com:8080",
        "http://userid:password@example.com:8080/",
        "http://userid@example.com",
        "http://userid@example.com/",
        "http://userid@example.com:8080",
        "http://userid@example.com:8080/",
        "http://userid:password@example.com",
        "http://userid:password@example.com/",
        "http://➡.ws/䨹",
        "http://⌘.ws",
        "http://⌘.ws/",
        "http://foo.com/blah_(wikipedia)#cite-1",
        "http://foo.com/blah_(wikipedia)_blah#cite-1",
        "http://foo.com/unicode_(✪)_in_parens",
        "http://foo.com/(something)?after=parens",
        "http://☺.damowmow.com/",
        "http://code.google.com/events/#&product=browser",
        "http://j.mp",
        "ftp://foo.bar/baz",
        "http://foo.bar/?q=Test%20URL-encoded%20stuff",
        "http://مثال.إختبار",
        "http://例子.测试",
        "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
        "http://1337.net",
        "http://a.b-c.de",
        "http://223.255.255.254",
    ];

    it ('should validate a url string correctly', () => {
        const v = new Validator({a: 'url'});

        for (let el of valids) {
            const evaluation = v.validate({a: el});
            expect(evaluation.is_valid).toEqual(true);
            expect(evaluation.errors.a).toEqual([]);
        }
    });

    it ('should not validate other types as valid urls', () => {
        const v = new Validator({a: 'url'});

        for (let el of invalids) {
            const evaluation = v.validate({a: el});
            expect(evaluation.is_valid).toEqual(false);
            expect(evaluation.errors.a).toEqual([{msg:'url', params: []}]);
        }
    });

    it ('should not validate improper strings as valid urls', () => {
        const v = new Validator({a: 'url'});

        for (let el of invalid_url) {
            const evaluation = v.validate({a: el});
            expect(evaluation.is_valid).toEqual(false);
            expect(evaluation.errors.a).toEqual([{msg:'url', params: []}]);
        }
    });
});
