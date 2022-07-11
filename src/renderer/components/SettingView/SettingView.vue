<template>
  <div id="wrapper">
    <main>
      <div>
        <div class="doc">
          <label>请先选择正确的网络再进行后续操作   tips:构造交易和发送交易的网络需要一致</label>
          <br></br>
          <select class="alt" v-model="optionsValue" @change='this.handlerNetworkChange'>
            <option v-for="item in selectData" :value="item.value">{{item.name}}</option>
          </select>
          <input class="altHalf" type="text" v-model="rpcUrl"></input>
          <input class="altHalf" type="text" v-model="magic"></input>
          <button class="alt" @click="update"> 更新 </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import {SETTING_ACTION_SETTINGN3T5, SETTING_ACTION_SETTINGMAINNET, SETTING_ACTION_CURNETID} from '../../js/constants/SettingConstants'

  // 894710606  http://seed1t5.neo.org:20332
  export default {
    name: 'createmulti-page',
    data () {
      return {
        rpcUrl: 'http://seed1.neo.org:10332',
        magic: 860833102,
        optionsValue: 1,
        selectData: [{
          value: 0,
          name: 'N3T5'
        },
        {
          value: 1,
          name: 'MAINNET'
        }]
      }
    },
    created () {
      if (this.$store.getters.n3t5Info.magic === 0) {
        this.$store.dispatch(SETTING_ACTION_SETTINGN3T5, {rpcUrl: 'http://seed1t5.neo.org:20332', magic: 894710606})
        this.$store.dispatch(SETTING_ACTION_SETTINGMAINNET, {rpcUrl: 'http://seed1.neo.org:10332', magic: 860833102})
        this.$store.dispatch(SETTING_ACTION_CURNETID, 1)
      }
      this.optionsValue = this.$store.getters.curNetId
      console.log(this.optionsValue)
      let netInfo
      if (this.optionsValue === 0) {
        netInfo = this.$store.getters.n3t5Info
      } else {
        netInfo = this.$store.getters.mainnetInfo
      }
      this.rpcUrl = netInfo.rpcUrl
      this.magic = netInfo.magic
    },
    components: { },
    methods: {
      handlerNetworkChange () {
        const network = this.optionsValue
        console.log(this.optionsValue)
        this.$store.dispatch(SETTING_ACTION_CURNETID, network)
        let netInfo
        if (this.optionsValue === 0) {
          netInfo = this.$store.getters.n3t5Info
        } else {
          netInfo = this.$store.getters.mainnetInfo
        }
        this.rpcUrl = netInfo.rpcUrl
        this.magic = netInfo.magic
      },
      update () {
        const network = this.optionsValue
        if (network === 0) {
          this.$store.dispatch(SETTING_ACTION_SETTINGN3T5, {rpcUrl: this.rpcUrl, magic: this.magic})
        } else {
          this.$store.dispatch(SETTING_ACTION_SETTINGMAINNET, {rpcUrl: this.rpcUrl, magic: this.magic})
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
  .doc select.alt {
    width: 100%;
  }

  .doc input.alt {
    width: 100%;
  }

  .doc textarea.alt {
    width: 100%;
    height: 100px;
  }

  .doc input.altHalf {
    width: 30%;
  }
  
</style>
