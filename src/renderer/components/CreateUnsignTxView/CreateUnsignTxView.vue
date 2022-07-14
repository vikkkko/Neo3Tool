<template>
  <div id="wrapper">
    <main>
      <div>
        <div class="doc">
          <label>交易发起者（如果是多签账户发起交易，这里填写多签地址）：</label>
          <input class="alt" type="text" v-model="sender" :placeholder="pltxt_sender"> </input>
          <br></br>
          <label>调用的合约hash：</label>
          <input class="alt" type="text" v-model="contract" :placeholder="pltxt_contract"> </input>
          <br></br>
          <label>调用的合约方法：</label>
          <input class="alt" type="text" v-model="operation" :placeholder="pltxt_operation"> </input>
          <br></br>
          <label>调用合约的参数：</label>
          <div v-for='(item, index) in args'>
            <select v-model="item.optionsValue">
              <option v-for="item2 in selectData" :value="item2.value">{{item2.name}}</option>
            </select>
            <input class="altHalf" type="text" v-model="item.text"></input>
          </div>
          <button class="alt" @click="push"> + </button>
          <button class="alt" @click="pull"> - </button>
          <br></br>
          <button class="alt" @click="createUnsignTx()">生成交易（交易未签名，如需发送上链还需要签名）</button>
          <textarea class="alt" v-model="unsigntx" :placeholder="pltxt_unsigntx" disabled></textarea>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {convertToContractParam, makeScript, makeTranWithUnSign} from '../../js/tool'
  import {SCPARAMS_ACTION_SCPARAMS} from '../../js/constants/ScParamsConstants.js'

  export default {
    name: 'createunsigntx-page',
    data () {
      return {
        pltxt_sender: '',
        pltxt_contract: '',
        pltxt_operation: '',
        pltxt_unsigntx: '点击生成交易按钮后，这里会出现构建的交易详情',
        sender: 'NViXcgccXsZXWaiwGesFSRRSw3miJQjLAQ',
        operation: 'transfer',
        contract: 'd2a4cff31913016155e38e474a2c06d08be276cf',
        unsigntx: '',
        args: [{
          text: 'NViXcgccXsZXWaiwGesFSRRSw3miJQjLAQ',
          optionsValue: 0
        },
        {
          text: 'NV8EUCrrGasFN3qZMG6qLNJGyPYVCwqvLY',
          optionsValue: 0
        },
        {
          text: '100',
          optionsValue: 2
        },
        {
          text: '',
          optionsValue: 5
        }],
        selectData: [{
          value: 0,
          name: 'address'
        },
        {
          value: 1,
          name: 'hash160'
        },
        {
          value: 2,
          name: 'int'
        },
        {
          value: 3,
          name: 'string'
        },
        {
          value: 4,
          name: 'boolean'
        },
        {
          value: 5,
          name: 'null'
        },
        {
          value: 6,
          name: 'hash256'
        },
        {
          value: 7,
          name: 'byteArray'
        },
        {
          value: 8,
          name: 'publicKey'
        }]
      }
    },
    created () {
      const scparams = this.$store.getters.scparams
      if (scparams.hex) {
        this.sender = scparams.sender
        this.contract = scparams.smartcontract
        this.operation = scparams.operation
        this.unsigntx = scparams.hex
        this.args = scparams.args
      }
    },
    components: { },
    methods: {
      async createUnsignTx () {
        let argments = []
        for (var i = 0; i < this.args.length; i++) {
          const arg = this.args[i]
          const contractParam = convertToContractParam(this.selectData[arg.optionsValue].name, arg.text)
          console.log(`${JSON.stringify(contractParam.toJson())}`)
          argments.push(contractParam)
        }
        const script = makeScript(this.contract, this.operation, argments)
        const netid = this.$store.getters.curNetId
        let rpcUrl
        if (netid === 0) {
          rpcUrl = this.$store.getters.n3t5Info.rpcUrl
        } else {
          rpcUrl = this.$store.getters.mainnetInfo.rpcUrl
        }
        const tran = await makeTranWithUnSign(rpcUrl, this.sender, script)
        this.unsigntx = tran.serialize()
        // store
        let scParams = {
          sender: this.sender,
          smartcontract: this.contract,
          operation: this.operation,
          args: this.args,
          hex: this.unsigntx
        }
        this.$store.dispatch(SCPARAMS_ACTION_SCPARAMS, scParams)
      },
      push () {
        this.args.push({
          optionsValue: 1,
          text: ''
        })
      },
      pull () {
        this.args.pop()
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

  .doc input.altHalf {
    width: 50%;
  }

  .doc textarea.alt {
    width: 100%;
    height: 100px;
  }
  
</style>
