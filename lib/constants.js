module.exports = {
  src: {
    enum: '/dofus/network/enums',
    type: '/dofus/network/types',
    message: '/dofus/network/messages',
    metadata: '/dofus/network/Metadata.as',
    protocolConstants: '/dofus/network/ProtocolConstantsEnum.as',
    customDataWrapper: '/jerakine/network/CustomDataWrapper.as',
    networkMessage: '/jerakine/network/NetworkMessage.as'
  },
  output: {
    enum: '/enums',
    type: '/types',
    message: '/messages',
    metadata: '/Metadata.js',
    protocolConstants: '/ProtocolConstantsEnum.js',
    customDataWrapper: '/CustomDataWrapper.js',
    networkMessage: '/NetworkMessage.js'
  }
}
