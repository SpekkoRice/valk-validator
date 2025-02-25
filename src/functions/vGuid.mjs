'use strict';

export default function vGuid (val) {
    //  A RFC-4122 guid is 36 characters in length
    if (typeof val !== 'string' || val.length !== 36) return false;

    //  Verify according to the rfc4122 spec
    return /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/g.test(val);
}
