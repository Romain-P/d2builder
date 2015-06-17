var d2com = require('d2com'),
    NetworkMessage = d2com.networkMessage,
    CustomDataWrapper = d2com.customDataWrapper,
    util = require('util');

var _classname_ = function () {
  _vars_
};

util.inherits(_classname_, NetworkMessage);

_classname_.prototype.serialize = function (output) {
  _serialize_
};

_classname_.prototype.deserialize = function (input) {
  _deserialize_
};

_classname_.prototype.getMessageId = function () {
  return _id_;
};

_classname_.prototype.getClassName = function () {
  return '_classname_';
};

module.exports.id = _id_;
module.exports.class = _classname_;
