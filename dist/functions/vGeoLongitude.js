'use strict';

Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports["default"] = vGeoLongitude;
var _is = _interopRequireDefault(require("@valkyriestudios/utils/is"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function vGeoLongitude(val) {
  return _is["default"].Number(val) && val >= -180 && val <= 180;
}