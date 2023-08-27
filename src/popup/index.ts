import '@/style/index.scss'

const detectEle = document.querySelector('.sss-detect')
detectEle &&
  detectEle.addEventListener('click', async () => {
    const [tab]: any = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'detect' })
    console.log(response, 'response')
  })
