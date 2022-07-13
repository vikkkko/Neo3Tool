import { NOTIFICATION_TITLE_NEO3TOOL } from './constants/ElectronConstants'

function notify (body) {
  /* eslint-disable no-new */
  new Notification(NOTIFICATION_TITLE_NEO3TOOL, {
    body
  })
}

export default notify
