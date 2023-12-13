import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '@/style/index.scss'
import { isEmpty } from '@/utils'
import { initEventHandler } from '@/utils/extension-action'
import Navigate from './navigate'
import { NON_AUTO_KEY } from '@/const'
import { Pattern } from '@/types/local.d'
import Modal from './modal'

const domain = location.hostname
let navigateIns: Navigate

const contentReq = {
  'toggle-detect': toggleDetect,
  'toggle-enable': toggleEnable,
}

function toggleEnable(enable = true) {
  if (!navigateIns) return
  enable ? navigateIns?.init() : navigateIns.undo()
}

function init() {
  const domain = location.hostname
  chrome.storage.sync.get(NON_AUTO_KEY).then(({ [NON_AUTO_KEY]: domainList }) => {
    const auto_focus =
      !domainList || isEmpty(domainList) || !domainList.find((item: string) => domain === item || item.endsWith(domain))
    chrome.runtime
      .sendMessage({
        greeting: 'to-get-pattern',
        data: { domain },
      })
      .then((res: Pattern | null) => {
        if (!res) return
        if (res.next_selector?.length) {
          navigateIns = new Navigate(res, auto_focus)
        }
      })
  })
}

init()

let isDetecting = false
//监听popup发送的事件，监听鼠标hover元素
chrome.runtime.onMessage.addListener((request) => {
  if (request && request.action === 'detect') {
    isDetecting = true
  }
})

function toggleDetect() {
  isDetecting = !isDetecting
}

initEventHandler(contentReq)

document.body.addEventListener('mouseover', (e) => {
  if (!isDetecting) return
  const target = e.target as Element
  target.classList.add('sss-hover')
})

document.body.addEventListener('mouseout', (e) => {
  if (!isDetecting) return
  const target = e.target as Element
  target.classList.remove('sss-hover')
})

document.body.addEventListener('click', (e) => {
  if (!isDetecting) return
  e.preventDefault()
  Modal.open()
  isDetecting = false
  const target = e.target as Element
  const targetTagName = target.localName
  const targetClassList =
    '.' +
    Array.from(target.classList)
      .filter((item) => item != 'sss-hover')
      .join('.')
  const parentNode = target.parentNode as Element
  const parentTagName = parentNode.localName

  chrome.runtime
    .sendMessage({
      greeting: 'to-save-detect-ele',
      data: {
        domain,
        next_selector: [`${parentTagName}>${targetTagName}${targetClassList}`],
        prev_selector: [],
        test_url: location.href,
      },
    })
    .then(() => {
      // TODO: return pattern
      target.classList.remove('sss-hover')
      isDetecting = false
      Toastify({
        text: 'Detect Success',
        duration: 10000,
        className: 'sss-toast',
        position: 'center',
        style: { top: '50%' },
      }).showToast()
      init()
    })
})
