import '@/style/index.scss'
import { isEmpty } from '@/utils'
import { initEventHandler } from '@/utils/extension-action'
import Navigate from './navigate'
import { NON_AUTO_KEY } from '@/const'
import { Pattern } from '@/types/local.d'

let navigateIns: Navigate

const contentReq = {
  'toggle-enable': toggleEnable,
}

function toggleEnable(enable = true) {
  if (!navigateIns) return
  enable ? navigateIns?.init() : navigateIns?.undo()
}

function init() {
  const domain = location.hostname
  chrome.storage.sync.get(NON_AUTO_KEY).then(({ [NON_AUTO_KEY]: domainList }) => {
    const auto_enable =
      !domainList || isEmpty(domainList) || !domainList.find((item: string) => domain === item || item.endsWith(domain))
    chrome.runtime
      .sendMessage({
        greeting: 'to-get-pattern',
        data: { domain },
      })
      .then((res: Pattern | null) => {
        if (!res) return
        if (res.next_selector?.length) {
          navigateIns = new Navigate(res, auto_enable)
        }
      })
  })
}

init()

initEventHandler(contentReq)
