var d2com = require('d2com'),
    NetworkMessage = d2com.networkMessage,
    CustomDataWrapper = d2com.customDataWrapper,
    util = require('util');

var _classname_ = function () {
  _vars_
};

util.inherits(_classname_, NetworkMessage);

_classname_.prototype.pack = function (output) {
  var data = new Buffer(32);
  this.serialize(new CustomDataWrapper(data));
  this.writePacket(output, _id_, data);
};

_classname_.prototype.unpack = function (intput, len) {
  this.deserialize(intput);
};

_classname_.prototype.serialize = function (output) {
  _serialize_
};

_classname_.prototype.deserialize = function (input) {
  _deserialize_
};

module.exports.id = _id_;
module.exports.class = _classname_;
