import { getEle } from '@/utils'
import '@/style/index.scss'

// [attr~=value]  "value xxx"
// [attr|=value] "value-xxx"
// [attr^=value] "valuexxx"
// [attr$=value] "xxxvalue"
// [attr*=value] "xxxvaluexxx"
// [class^='value' i] i or s

const keyCodeMap = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
}
setKeypad()

function setKeypad() {
  document.addEventListener('keydown', keypad, false)
}

// https://postgrest.org/en/stable/releases/v10.2.0.html

function keypad(e: KeyboardEvent) {
  const prevEle = getEle('a[rel="prev"]')
  const nextEle = getEle('a[rel="next"]')
  if (keyCodeMap.left === e.code) {
    prevEle && prevEle.click()
  } else if (keyCodeMap.right === e.code) {
    nextEle && nextEle.click()
    console.log(nextEle, 'nextEle')
  }
}

chrome.runtime
  .sendMessage({
    greeting: 'to-get-pattern',
    data: {
      domain: location.hostname,
    },
  })
  .then((res) => {
    console.log(res, 'xxxx')
    // patternList = res
  })

let isDetecting = false
//监听popup发送的事件，监听鼠标hover元素
chrome.runtime.onMessage.addListener((request) => {
  if (request && request.action === 'detect') {
    isDetecting = true
    document.body.addEventListener('mouseover', (e) => {
      const target = e.target as Element
      target && target.classList.add('sss-hover')
    })
    document.body.addEventListener('mouseout', (e) => {
      const target = e.target as Element
      target && target.classList.remove('sss-hover')
    })
  }
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
        domain: location.hostname,
        type: 'prev_selector',
        element: `${parentTagName}>${targetTagName}.${targetClassList}`,
      },
    })
    .then(() => {
      isDetecting = false
    })
})
