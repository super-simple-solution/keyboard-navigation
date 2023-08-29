import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import tingle from 'tingle.js'

import '@/style/index.scss'
import { setKeypad } from './util'
import { PatternData } from '@/types/local.d'

const domain = location.hostname

chrome.runtime
  .sendMessage({
    greeting: 'to-get-pattern',
    data: { domain },
  })
  .then((res: PatternData) => setKeypad(res))

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
    .then((res) => {
      isDetecting = false
      tingle
      Toastify({
        text: 'Detect Success',
        duration: 3000,
      }).showToast()
      setKeypad(res)
    })
})

const modal = new tingle.modal({
  footer: true,
  stickyFooter: false,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: 'Close',
  cssClass: ['custom-class-1', 'custom-class-2'],
  onOpen: function () {
    console.log('modal open')
  },
  onClose: function () {
    console.log('modal closed')
  },
  beforeClose: function () {
    // here's goes some logic
    // e.g. save content before closing the modal
    return true // close the modal
  },
})

// set content
modal.setContent('"<h1>here\'s some content</h1>"')

// add a button
modal.addFooterBtn('Button label', 'tingle-btn tingle-btn--primary', function () {
  // here goes some logic
  modal.close()
})

// add another button
modal.addFooterBtn('Dangerous action !', 'tingle-btn tingle-btn--danger', function () {
  // here goes some logic
  modal.close()
})

// open modal
modal.open()

// function geneSelector(el: Element, ancestorEl: Element) {}
