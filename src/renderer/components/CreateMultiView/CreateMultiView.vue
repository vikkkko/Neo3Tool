<template>
  <div id="wrapper">
    <main>
      <div>
        <div class="doc">
          <div>
            <h1>方式一：多签脚本创建</h1>
            <label>脚本：</label>
            <input class="alt" type="text" v-model="multiScript" :placeholder="pltxt_multiScript"> </input>
            <button class="alt" @click="createMultiType1()">生成多签地址</button>
          </div>
          <br></br>
          <div> 
            <h1>方式二：公钥创建（确定好公钥顺序之后再填入）</h1>
            <label>公钥：</label>
            <input class="alt" type="text" v-model="pubKey" :placeholder="pltxt_pubKey"> </input>
            <button class="alt" @click="addPubKey()">增加公钥</button>
            <textarea class="alt" v-model="textPubKeys" :placeholder="pltxt_pubKeysLog" disabled></textarea>
            <label>输入最小需要的公钥数量：</label>
            <input class="alt" type="text" v-model="multiInfo.signingThreshold" :placeholder="pltxt_signingThreshold"> </input>
            <button class="alt" @click="createMulitType2()">生成多签地址</button>
          </div>
          <br></br>
          <div>
            <textarea class="alt" v-model="multAddress" disabled></textarea>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {getAddressFromPublicKey, createMultiAccount, getMultiInfoFromBase64VerificationScript} from '../../js/tool'
  import {ACCOUNT_ACTION_MULTIINFO} from '../../js/constants/AccountConstants'

  export default {
    name: 'createmulti-page',
    data () {
      return {
        pltxt_pubKey: '',
        pltxt_multiScript: '',
        pltxt_signingThreshold: '0',
        pltxt_pubKeysLog: '地址:公钥',
        pubKey: '',
        multiScript: '',
        textPubKeys: '',
        multiInfo: {
          pubKeys: [],
          signingThreshold: ''
        },
        multAddress: ''
      }
    },
    created () {
      for (var i = 0; i < this.$store.getters.multiInfo.pubKeys.length; i++) {
        this.multiInfo.pubKeys.push(this.$store.getters.multiInfo.pubKeys[i])
      }
      this.multiInfo.signingThreshold = this.$store.getters.multiInfo.signingThreshold
      this.refreshTextPubKyes()
      if (this.multiInfo.signingThreshold && this.multiInfo.pubKeys.length > parseInt(this.multiInfo.signingThreshold)) {
        const multiAccount = this.createMulitType2()
        this.multiScript = multiAccount.contract.script
      }
      this.$store.watch(state => state.multi.multiInfo, _multiInfo => {
        this.multiInfo = _multiInfo
      })
    },
    components: { },
    methods: {
      addPubKey () {
        if (this.pubKey.length !== 66) {
          alert('请输入正确的公钥 示例：0200654cef9361c68394cf6f02be34706feb2cd26449438cc8b73f1849de7d2345')
          return
        }
        for (let i = 0; i < this.multiInfo.pubKeys.length; i++) {
          if (this.multiInfo.pubKeys[i] === this.pubKey) {
            return
          }
        }
        this.multiInfo.pubKeys.push(this.pubKey)
        this.refreshTextPubKyes()
        console.log(JSON.stringify(this.$store.state.multi.multiInfo))
      },
      refreshTextPubKyes () {
        this.textPubKeys = ''
        for (let i = 0; i < this.multiInfo.pubKeys.length; i++) {
          const pubKey = this.multiInfo.pubKeys[i]
          const textPubkey = `${getAddressFromPublicKey(pubKey)} : ${pubKey}`
          this.textPubKeys = `${this.textPubKeys} \r\n ${textPubkey}`
        }
      },
      createMultiType1 () {
        try {
          const multiInfo = getMultiInfoFromBase64VerificationScript(this.multiScript)
          this.multiInfo.pubKeys = multiInfo.pubKeys
          this.multiInfo.signingThreshold = multiInfo.threshold
          this.refreshTextPubKyes()
          return this.createMulitType2()
        } catch (e) {
          alert(e)
          return null
        }
      },
      createMulitType2 () {
        try {
          const multiAccount = createMultiAccount(parseInt(this.multiInfo.signingThreshold), this.multiInfo.pubKeys)
          this.multAddress = JSON.stringify(multiAccount)
          this.$store.dispatch(ACCOUNT_ACTION_MULTIINFO, this.multiInfo)
          return multiAccount
        } catch (e) {
          alert(e)
          return null
        }
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
