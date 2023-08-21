import { getEle } from '@/utils'

// [attr~=value]  "value xxx"
// [attr|=value] "value-xxx"
// [attr^=value] "valuexxx"
// [attr$=value] "xxxvalue"
// [attr*=value] "xxxvaluexxx"
// [class^='value' i] i or s

const keyCodeMap = {
  left: 'ArrowLeft',
  up: 'ArrowUp',
  right: 'ArrowRight',
  down: 'ArrowDown',
}

setKeypad()

function setKeypad() {
  document.addEventListener('keydown', keypad, false)
}

// https://postgrest.org/en/stable/releases/v10.2.0.html

function keypad(e: KeyboardEvent) {
  const prevEle = getEle('a[rel="prev"]')
  const nextEle = getEle('a[rel="next"]')
  if ([keyCodeMap.left, keyCodeMap.up].includes(e.code)) {
    prevEle && prevEle.click()
  } else if ([keyCodeMap.right, keyCodeMap.down].includes(e.code)) {
    nextEle && nextEle.click()
    console.log(nextEle, 'nextEle')
  }
}
