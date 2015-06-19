var glob = require( 'glob' ),
    Q = require( 'q' ),
    path = require( 'path' );

var messages = {}, self;

var MessageReceiver = function () {
  self = this;
}

module.exports = MessageReceiver;

MessageReceiver.prototype.parse = function (input, messageId, messageLength) {
  var deferred = Q.defer();
  if(!self.messages){
    return init().then(function (messages) {
      self.messages = messages;
      return self.parse(input, messageId, messageLength);
    })
  }

  var Message = self.messages[messageId];
  if (!Message)
  {
    deferred.reject('Unknown packet received (ID ' + messageId + ', length ' + messageLength + ')');
  }
  else{
    var message = new (Message)();
    message.unpack(input, messageLength);
    deferred.resolve(message);
  }

  return deferred.promise;
};

MessageReceiver.prototype.create = function (messageId) {
  var deferred = Q.defer();
  if(!self.messages){
    return init().then(function (messages) {
      self.messages = messages;
      return self.create(messageId);
    })
  }

  var Message = self.messages[messageId];
  if(!Message)
  {
    deferred.reject('Unknown packet received (ID ' + messageId + ')');
  }
  else{
    deferred.resolve(new Message());
  }

  return deferred.promise;
}

function init () {
  var deferred = Q.defer();

  glob(path.join(__dirname, 'messages/**/*.js'), function( err, files ) {
    if(err){
      deferred.reject(err);
      return;
    }
    var messages = {};
    files.forEach(function (file) {
      var message = require(file);
      messages[message.id] = message.class;
    });
    deferred.resolve(messages);
  });

  return deferred.promise;
}