import './style.scss'
import { NON_AUTO_KEY } from '@/const'
import { isEmpty } from '@/utils'
import { getActiveTab } from '@/utils/extension-action'

const switchEle = document.getElementById('switch') as HTMLInputElement
getActiveTab().then(({ url }) => {
  const domain = new URL(url).hostname
  chrome.storage.sync.get(NON_AUTO_KEY).then(({ [NON_AUTO_KEY]: domainList }) => {
    const auto_enable =
      !domainList || isEmpty(domainList) || !domainList.find((item: string) => domain === item || item.endsWith(domain))
    switchEle.checked = auto_enable
  })
})

switchEle?.addEventListener('change', () => {
  getActiveTab()
    .then(({ id, url }) => {
      const checked = switchEle.checked
      const domain = new URL(url).hostname
      chrome.storage.sync.get(NON_AUTO_KEY).then(({ [NON_AUTO_KEY]: domainList }) => {
        if (!domainList || isEmpty(domainList)) domainList = []
        const domainIndex = domainList.indexOf(domain)
        if (checked && domainIndex !== -1) {
          domainList.splice(domainIndex, 1)
        }
        if (!checked && domainIndex === -1) {
          domainList.push(domain)
        }
        chrome.storage.sync.set({ [NON_AUTO_KEY]: domainList })
      })
      chrome.tabs.sendMessage(id, { greeting: 'toggle-enable', data: switchEle.checked })
    })
    .catch((e) => {
      console.error(e.message)
    })
})
