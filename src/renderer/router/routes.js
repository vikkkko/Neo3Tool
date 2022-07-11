import * as Route from '../js/constants/RouteConstants'

export default [
  {
    path: Route.HOME_PAGE_PATH,
    name: Route.HOME_PAGE_NAME,
    component: require('../components/HomePageView'),
    children: [
      {
        path: Route.DEFAULT_VIEW_PATH,
        name: Route.DEFAULT_VIEW_NAME,
        component: require('../components/SettingView/SettingView')
      },
      {
        path: Route.SETTING_VIEW_PATH,
        name: Route.SETTING_VIEW_NAME,
        component: require('../components/SettingView/SettingView')
      },
      {
        path: Route.CREATEMULTI_VIEW_PATH,
        name: Route.CREATEMULTI_VIEW_NAME,
        component: require('../components/CreateMultiView/CreateMultiView')
      },
      {
        path: Route.CREATEUNSIGNTX_VIEW_PATH,
        name: Route.CREATEUNSIGNTX_VIEW_NAME,
        component: require('../components/CreateUnsignTxView/CreateUnsignTxView')
      },
      {
        path: Route.SIGNMULTI_VIEW_PATH,
        name: Route.SIGNMULTI_VIEW_NAME,
        component: require('../components/SignMultiView/SignMultiView')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]
