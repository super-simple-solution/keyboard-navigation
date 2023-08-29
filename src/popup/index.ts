import './style.scss'

const detectEle = document.querySelector('.detect')
detectEle?.addEventListener('click', () => {
  // if ((e.target as Element).className !== 'btn') return
  chrome.tabs.query({ active: true, lastFocusedWindow: true }).then((tab) => {
    const tabId = tab[0]?.id
    if (!tabId) return
    chrome.tabs.sendMessage(tabId, { action: 'detect' })
  })
})
