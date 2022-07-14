<template>
  <div id="wrapper">
    <main>
      <div>
        <div class="doc">
          <label>钱包登陆（加载略慢，耐心等候）：</label>
          <input class="alt" type="file" accept="application/json" @change="this.handlerFileChange"> </input>
          <label>密码：</label>
          <input class="alt" type="text" v-model="password" :placeholder="pltxt_password"> </input>
          <button class="alt" @click="login"> 登陆 </button>
          <br></br>
          <label>wif登陆：</label>
          <input class="alt" type="text" v-model="wif" :placeholder="pltxt_wif"> </input>
          <button class="alt" @click="login"> 登陆 </button>
          <br></br>
          <label>已经登陆的地址：</label>
          <textarea class="alt" v-model="loginaccounts" :placeholder="pltxt_loginaccounts" disabled></textarea>
          <br></br>
          <label>将未签名的数据复制到下方的文本中，签名后复制给其他密钥掌握者</label>
          <textarea class="alt" v-model="unsigntx" @change="this.handlerUnsigntxChange"></textarea>
          <button class="alt" @click="sign"> 签名 </button>
          <button class="alt" @click="sendTransaction"> 发送 </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import { decryptWalletKeys, getAccountFromWIF, createMultiAccount, getAddressFromPublicKey, getMultiInfoFromBase64VerificationScript } from '../../js/tool'
  import { ToolTx } from '../../js/toolTx'

  export default {
    name: 'signmulti-page',
    data () {
      return {
        pltxt_password: '',
        pltxt_wif: '',
        pltxt_loginaccounts: '',
        walletstr: '',
        password: '',
        wif: '',
        accountsMap: new Map(),
        loginaccounts: '',
        unsigntx: '',
        toolTx: new ToolTx()
      }
    },
    created () {
      let pubKeys = []
      let signingThreshold = ''
      for (var i = 0; i < this.$store.getters.multiInfo.pubKeys.length; i++) {
        pubKeys.push(this.$store.getters.multiInfo.pubKeys[i])
      }
      signingThreshold = this.$store.getters.multiInfo.signingThreshold

      if (signingThreshold && pubKeys.length > parseInt(signingThreshold)) {
        const multiAccount = createMultiAccount(parseInt(signingThreshold), pubKeys)
        this.accountsMap.set(multiAccount.address, {account: multiAccount, isMultiSig: true})
        this.refreshAccounts()
      }
    },
    components: { },
    methods: {
      handlerFileChange (e) {
        if (!e.target.files.length) {
          alert('文件有误')
          return
        }
        const file = e.target.files[0]
        if (file.name.includes('.json')) {
          const reader = new FileReader()
          reader.onload = e => {
            this.walletstr = reader.result
          }
          reader.readAsText(file)
        } else {
          alert('请选择json格式的钱包文件')
        }
      },
      handlerUnsigntxChange () {
        try {
          this.toolTx.deserialize(this.unsigntx)
          const multiAccount = this.toolTx.getMultiAccount()
          if (multiAccount) {
            this.accountsMap.set(multiAccount.address, {account: multiAccount, isMultiSig: true})
            this.refreshAccounts()
          }
        } catch (e) {
          alert(e)
        }
        console.log('导入交易数据成功')
      },
      async login () {
        try {
          this.loginaccounts = '正在导入，请稍候。。。。。。。。。。。。。。'
          if (this.wif) {
            const _account = getAccountFromWIF(this.wif)
            this.accountsMap.set(_account.address, {account: _account, isMultiSig: false})
          } else {
            let walletJson = JSON.parse(this.walletstr)
            const wifs = await decryptWalletKeys(walletJson, this.password)
            for (var i = 0; i < wifs.length; i++) {
              const _account = getAccountFromWIF(wifs[i])
              this.accountsMap.set(_account.address, {account: _account, isMultiSig: false})
            }
          }
        } catch (e) {
          alert(e)
        }
        this.refreshAccounts()
      },
      refreshAccounts () {
        this.loginaccounts = ''
        const keys = this.accountsMap.keys()
        for (let i = 0; i < this.accountsMap.size; i++) {
          const key = keys.next().value
          const account = this.accountsMap.get(key).account
          const isMultiSig = this.accountsMap.get(key).isMultiSig
          if (isMultiSig) {
            const _script = account.contract.script
            const multiInfo = getMultiInfoFromBase64VerificationScript(_script)
            const _pubKeys = multiInfo.pubKeys
            const _threshold = multiInfo.threshold
            this.loginaccounts = `${this.loginaccounts} \r\n  ${key}    (${_threshold}/${_pubKeys.length})`
            for (let i = 0; i < _pubKeys.length; i++) {
              this.loginaccounts = `${this.loginaccounts} \r\n        -----${getAddressFromPublicKey(_pubKeys[i])}`
            }
          } else {
            this.loginaccounts = `${this.loginaccounts} \r\n ${key}`
          }
        }
      },
      sign () {
        try {
          const netid = this.$store.getters.curNetId
          let magic
          if (netid === 0) {
            magic = this.$store.getters.n3t5Info.magic
          } else {
            magic = this.$store.getters.mainnetInfo.magic
          }
          this.toolTx.sign(this.accountsMap, magic)
          console.log(`tran:${JSON.stringify(this.toolTx.tran.toJson())}}`)
          this.unsigntx = this.toolTx.serialize()
          alert('签名成功')
        } catch (e) {
          alert(e)
        }
      },
      async sendTransaction () {
        try {
          const netid = this.$store.getters.curNetId
          let rpcUrl
          if (netid === 0) {
            rpcUrl = this.$store.getters.n3t5Info.rpcUrl
          } else {
            rpcUrl = this.$store.getters.mainnetInfo.rpcUrl
          }
          const result = await this.toolTx.send(rpcUrl)
          alert(result)
        } catch (e) {
          alert(e)
        }
        this.toolTx.deserialize(this.unsigntx)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 100%; }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .doc input.alt {
    width: 100%;
  }

  .doc textarea.alt {
    width: 100%;
    height: 100px;
  }
  
</style>
