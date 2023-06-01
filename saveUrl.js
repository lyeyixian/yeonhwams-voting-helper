function saveUrl() {
  const url = window.location.toString()

  chrome.storage.local.get('urls', (res) => {
    const newUrls = res.urls || []

    newUrls.push(url)
    chrome.storage.local.set({ urls: newUrls }, () => console.log('saved'))
  })
}

saveUrl()
