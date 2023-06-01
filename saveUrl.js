function saveUrl() {
  const url = window.location.toString()
  console.log(url)
  chrome.storage.local.get('urls', (res) => {
    const newUrls = res.urls || []
    console.log(newUrls)
    newUrls.push(url)
    chrome.storage.local.set({ urls: newUrls }, () => console.log('saved'))
  })
}

saveUrl()
