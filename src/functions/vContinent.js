'use strict';

import Is           from '@valkyriestudios/utils/is';
import mapKey       from '@valkyriestudios/utils/array/mapKey';
import continents   from '@valkyriestudios/utils/data/continents.json';

const MAP = mapKey(continents, 'code');

export default function vContinent (val) {
    if (!Is.NeString(val)) return false;
    return MAP.hasOwnProperty(val);
}
