import '@/style/index.scss'

const detectEle = document.querySelector('.sss-detect')
detectEle?.addEventListener('click', async () => {
  const [tab]: any = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  chrome.tabs.sendMessage(tab.id, { action: 'detect' })
})
