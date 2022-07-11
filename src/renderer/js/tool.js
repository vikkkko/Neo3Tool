import Neon, { wallet, sc, tx, u, rpc } from '@cityofzion/neon-js'

export function getMultiInfoFromBase64VerificationScript (verificationScript) {
  const hexstring = u.HexString.fromBase64(verificationScript)
  const _pubKeys = wallet.getPublicKeysFromVerificationScript(hexstring.toString())
  const _threshold = wallet.getSigningThresholdFromVerificationScript(hexstring.toString())
  return {pubKeys: _pubKeys, threshold: _threshold}
}

export function getAddressFromPublicKey (pubKey) {
  const scriptHash = wallet.getScriptHashFromPublicKey(pubKey)
  const address = wallet.getAddressFromScriptHash(scriptHash)
  return address
}

export function getAddressFromScriptHash (scriptHash) {
  const address = wallet.getAddressFromScriptHash(scriptHash)
  return address
}

export function convertToContractParam (type, value) {
  switch (type) {
    case 'address':
      const scriptHash = wallet.getScriptHashFromAddress(value)
      return sc.ContractParam.hash160(scriptHash)
    case 'int':
      return sc.ContractParam.integer(value)
    case 'hash160':
      return sc.ContractParam.hash160(value)
    case 'string':
      return sc.ContractParam.string(value)
    case 'boolean':
      return sc.ContractParam.boolean(value)
    case 'publicKey':
      return sc.ContractParam.publicKey(value)
    case 'hash256':
      return sc.ContractParam.hash256(value)
    case 'byteArray':
      return sc.ContractParam.byteArray(value)
    case 'null':
      return sc.ContractParam.any()
    default:
      alert(`${type} 类型错误`)
      break
  }
}

export function getTranFromHex (hexString) {
  return tx.Transaction.deserialize(hexString)
}

export async function decryptWalletKeys (walletJson, password) {
  const _wallet = new wallet.Wallet(walletJson)
  const _accounts = _wallet.accounts
  const wifs = []
  for (let i = 0; i < _accounts.length; i++) {
    const _account = _accounts[i]
    console.log(JSON.stringify(_account))
    const wif = await wallet.decrypt(
      _account.encrypted,
      password,
      _wallet.scrypt
    )
    wifs.push(wif)
  }
  return wifs
}

export function getAccountFromWIF (wif) {
  return new wallet.Account(wif)
}

export function createMultiAccount (minCount, pubKeys) {
  return wallet.Account.createMultiSig(minCount, pubKeys)
}

export function makeScript (_scriptHash, _operation, _args) {
  const sb = Neon.create.scriptBuilder()
  const contractCall = {
    scriptHash: _scriptHash,
    operation: _operation,
    args: _args
  }
  sb.emitContractCall(contractCall)
  return sb.build()
}

export async function makeTranWithUnSign (rpcUrl, _sender, _script) {
  var sciprtHash = ''
  if (wallet.isAddress(_sender)) {
    sciprtHash = wallet.getScriptHashFromAddress(_sender)
  } else {
    alert(`交易发起者 不是 地址类型`)
    return
  }
  console.log(sciprtHash)
  let rpcClient = new rpc.RPCClient(rpcUrl)
  let currentHeight = await rpcClient.getBlockCount()
  console.log(currentHeight)
  let _signers = [
    {
      account: sciprtHash,
      scopes: tx.WitnessScope.Global
    }
  ]
  let invokeResult = await rpcClient.invokeScript(u.HexString.fromHex(_script), _signers)
  let _systemFee = invokeResult.gasconsumed
  console.log(`_systemFee: ${JSON.stringify(_systemFee)}`)
  var transaction = new tx.Transaction({
    script: _script,
    validUntilBlock: currentHeight + 5000,
    systemFee: u.BigInteger.fromNumber(_systemFee),
    signers: _signers
  })
  transaction.networkFee = u.BigInteger.fromNumber(transaction.size * 10000)
  return transaction
}

export async function sendTransaction (rpcUrl, transaction) {
  let rpcClient = new rpc.RPCClient(rpcUrl)
  const result = await rpcClient.sendRawTransaction(transaction)
  return result
}
