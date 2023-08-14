import { getEle } from '@/utils'

const keycodes = {
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
  const prevEle = getEle('[role="navigation"] a[rel="prev"]')
  const nextEle = getEle('[role="navigation"] a[rel="next"]')
  if ([keycodes.left, keycodes.up].includes(e.code)) {
    prevEle && prevEle.click()
  } else if ([keycodes.right, keycodes.down].includes(e.code)) {
    nextEle && nextEle.click()
    console.log(nextEle, 'nextEle')
  }
}
