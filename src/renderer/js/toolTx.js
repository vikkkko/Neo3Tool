import { tx } from '@cityofzion/neon-js'
import * as tool from './tool'

export class ToolTx {
  // eslint-disable-next-line no-useless-constructor
  constructor () {
  }

  sign (accountsMap, magic) {
    for (let i = 0; i < this.tran.signers.length; i++) {
      const _signerAddress = tool.getAddressFromScriptHash(this.tran.signers[i].account.toString())
      if (!accountsMap.has(_signerAddress)) {
        throw new Error(`需要签名的地址是${_signerAddress},没有找到对应签名地址`)
      }
      let _account = accountsMap.get(_signerAddress).account
      const _isMultiSig = accountsMap.get(_signerAddress).isMultiSig
      if (_isMultiSig) {
        const _script = _account.contract.script
        const multiInfo = tool.getMultiInfoFromBase64VerificationScript(_script)
        const _pubKeys = multiInfo.pubKeys
        let _signed = 0
        for (let i = 0; i < _pubKeys.length; i++) {
          const _address = tool.getAddressFromPublicKey(_pubKeys[i])
          if (accountsMap.has(_address)) {
            _account = accountsMap.get(_address).account
            this.tran.sign(_account, magic)
            _signed = _signed + 1
          }
        }
        if (_signed === 0) {
          throw new Error('未进行任何有效签名，请检查登陆地址以及多签地址')
        } else {
          this.multiScript = _script
        }
      } else {
        this.tran.sign(_account, magic)
      }
    }
  }

  getMultiAccount () {
    if (this.multiScript) {
      const multiInfo = tool.getMultiInfoFromBase64VerificationScript(this.multiScript)
      const _pubKeys = multiInfo.pubKeys
      const _threshold = multiInfo.threshold
      const _multiAccount = tool.createMultiAccount(parseInt(_threshold), _pubKeys)
      return _multiAccount
    } else {
      return null
    }
  }

  deserialize (unsigntx) {
    if (unsigntx.indexOf('|') > 0) {
      const strs = unsigntx.split('|')
      this.tran = tool.getTranFromHex(strs[0])
      this.multiScript = strs[1]
    } else {
      this.tran = tool.getTranFromHex(unsigntx)
    }
  }

  serialize () {
    if (this.multiScript) {
      return `${this.tran.serialize()}|${this.multiScript}`
    } else {
      return `${this.tran.serialize()}`
    }
  }

  async send (rpcUrl) {
    const multiAccount = this.getMultiAccount()
    if (multiAccount) {
      const multisigWitness = tx.Witness.buildMultiSig(
        this.tran.serialize(false),
        this.tran.witnesses,
        multiAccount
      )
      this.tran.witnesses = [multisigWitness]
    }
    const result = await tool.sendTransaction(rpcUrl, this.tran)
    return result
  }
}
