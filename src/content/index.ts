import '@/style/index.scss'
import { setKeypad } from './util'
import { PatternData } from '@/types/local.d'

const domain = location.hostname

chrome.runtime
  .sendMessage({
    greeting: 'to-get-pattern',
    data: {
      domain,
    },
  })
  .then((res: PatternData) => {
    setKeypad(res)
  })

let isDetecting = false
//监听popup发送的事件，监听鼠标hover元素
chrome.runtime.onMessage.addListener((request) => {
  if (request && request.action === 'detect') {
    isDetecting = true
  }
})

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
  const target = e.target as Element
  const targetTagName = target.localName
  const targetClassList = Array.from(target.classList)
    .filter((item) => item != 'sss-hover')
    .join('.')
  const parentNode = target && (target.parentNode as Element)
  const parentTagName = parentNode && parentNode.localName

  chrome.runtime
    .sendMessage({
      greeting: 'to-save-detect-ele',
      data: {
        domain,
        next_selector: `${parentTagName}>${targetTagName}.${targetClassList}`,
      },
    })
    .then(() => {
      isDetecting = false
    })
})
