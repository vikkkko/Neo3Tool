<template>
  <div class="layout">
    <div class="layout-menu">
      <Menu mode="horizontal" active-name="menu-setting" @on-select="onMenuSelect">
      <Menu-item name="menu-setting">
          <Icon type="cube"></Icon>设置
        </Menu-item>
        <Menu-item name="menu-createmulti">
          <Icon type="cube"></Icon>创建多签
        </Menu-item>
        <Menu-item name="menu-createunsigntx">
          <Icon type="beer"></Icon>构建未签名交易
        </Menu-item>
        <Menu-item name="menu-signmulti">
          <Icon type="help-buoy"></Icon>多签签名及发送
        </Menu-item>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
    <div class="layout-copy">
      &copy; Neo3Tool, 2017
    </div>
  </div>
</template>

<script>
  import * as Route from '../js/constants/RouteConstants'
  
  export default {
    name: 'home-page',
    components: {
    },
    data () {
      return {
        info: {},
        version: {},
        ping: '',
        showInfo: false,
        showVersion: false
      }
    },
    methods: {
      onMenuSelect (selectedMenuName) {
        console.log(selectedMenuName)
        switch (selectedMenuName) {
          case 'menu-setting':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.SETTING_VIEW_PATH
            })
            break
          case 'menu-createmulti':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.CREATEMULTI_VIEW_PATH
            })
            break
          case 'menu-createunsigntx':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.CREATEUNSIGNTX_VIEW_PATH
            })
            break
          case 'menu-signmulti':
            this.$router.push({
              path: Route.HOME_PAGE_PATH + Route.SIGNMULTI_VIEW_PATH
            })
            break
          default:
            console.log('default')
            break
        }
      }
    },
    created () {
    }
  }
</script>

<style scoped>
  .layout {
    height: 100%;
    position: relative;
    overflow: auto;
    ::-webkit-scrollbar {display:none;}
  }

  .layout-menu {
    -webkit-app-region: drag;
  }

  .ivu-menu {
    margin-top: 5px;
    height: 55px;
  }

  .layout-content {
    min-height: 200px;
    overflow: auto;
    ::-webkit-scrollbar {display:none;}
    max-height: 100vh;
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  a {
    color: inherit;
  }

  @media (max-width: 850px) {
    .ivu-menu {
      display: inline-table;
    }
  }

</style>
