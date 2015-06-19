module.exports = {
  src: {
    enum: '/dofus/network/enums',
    type: '/dofus/network/types',
    message: '/dofus/network/messages',
    metadata: '/dofus/network/Metadata.as',
    protocolConstants: '/dofus/network/ProtocolConstantsEnum.as',
    customDataWrapper: '/jerakine/network/CustomDataWrapper.as',
    protocolTypeManager: '/lib/templates/protocol-type-manager.tpl',
    messageReceiver: '/lib/templates/message-receiver.tpl',
    networkMessage: '/jerakine/network/NetworkMessage.as'
  },
  output: {
    enum: '/enums',
    type: '/types',
    message: '/messages',
    metadata: '/Metadata.js',
    protocolConstants: '/ProtocolConstantsEnum.js',
    customDataWrapper: '/CustomDataWrapper.js',
    protocolTypeManager: '/protocol-type-manager.js',
    messageReceiver: '/message-receiver.js',
    networkMessage: '/NetworkMessage.js'
  }
}
