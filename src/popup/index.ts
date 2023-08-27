import { getEle, createEle } from '@/utils'
import '@/style/index.scss'

const init = () => {
  const contentEle = getEle('#popup-app')
  console.log(contentEle, 'contentEle')
  if (contentEle) {
    const popupContainer = createEle({ tag: 'div', class: 'sss-popup-container' })
    contentEle.append(popupContainer)

    const detectEle = createEle({ tag: 'div', content: 'To Detect Element', class: 'sss-detect' })
    popupContainer.append(detectEle)

    const btnContainer = createEle({ tag: 'div', class: 'sss-btn-container' })
    popupContainer.append(btnContainer)

    const preBtnEle = createEle({ tag: 'div', content: 'Prev', class: 'sss-btn sss-pre-btn' })
    btnContainer.append(preBtnEle)

    const nextBtnEle = createEle({ tag: 'div', content: 'Next', class: 'sss-btn sss-next-btn' })
    btnContainer.append(nextBtnEle)
  }
}
init()
// function toInspect() {
//   chrome.runtime.sendMessage('to-inspect')
// }
