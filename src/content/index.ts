import { getEle } from '@/utils'

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
    patternList = res
  })
