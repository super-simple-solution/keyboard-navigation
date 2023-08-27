import { getEle, createEle } from '@/utils'
import '@/style/index.scss'

const detectEle = createEle({ tag: 'div', content: 'To Detect Element', class: 'sss-detect' })
const preBtnEle = createEle({ tag: 'div', content: 'Prev', class: 'sss-btn sss-pre-btn' })
const nextBtnEle = createEle({ tag: 'div', content: 'Next', class: 'sss-btn sss-next-btn' })
const init = () => {
  console.log(123223424)
  console.log(123223424)
  const contentEle = getEle('#popup-app')
  if (contentEle) {
    const popupContainer = createEle({ tag: 'div', class: 'sss-popup-container' })
    contentEle.append(popupContainer)

    popupContainer.append(detectEle)

    const btnContainer = createEle({ tag: 'div', class: 'sss-btn-container' })
    popupContainer.append(btnContainer)

    btnContainer.append(preBtnEle)
    btnContainer.append(nextBtnEle)
  }
}
init()

detectEle.addEventListener('click', async () => {
  console.log(33333)
  const [tab]: any = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'detect' })
  console.log(response, 'response')
})
