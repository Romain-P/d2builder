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
    enum: '/d2com/enums',
    type: '/d2com/types',
    message: '/d2com/messages',
    metadata: '/d2com/Metadata.js',
    protocolConstants: '/d2com/ProtocolConstantsEnum.js',
    customDataWrapper: '/d2com/CustomDataWrapper.js',
    networkMessage: '/d2com/NetworkMessage.js'
  }
}
