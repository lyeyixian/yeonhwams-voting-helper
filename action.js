async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

chrome.storage.local.get('ign', (res) => {
  document.getElementById('ign').innerText = res.ign || '<IGN>'
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'ign') {
      document.getElementById('ign').innerText = newValue || '<IGN>'
    }
  }
})

document.getElementById('submitIgn').addEventListener('click', () => {
  const ign = document.getElementById('ignInput').value
  chrome.storage.local.set({ ign }, () => console.log('ign saved'))
})

chrome.storage.local.get('day', (res) => {
  document.getElementById('day').innerText = res.day || 1
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'day') {
      document.getElementById('day').innerText = newValue || 1
    }
  }
})

document.getElementById('submitDay').addEventListener('click', () => {
  const day = document.getElementById('dayInput').value
  chrome.storage.local.set({ day }, () => console.log('day saved'))
})

chrome.storage.local.get('posts', (res) => {
  document.getElementById('posts').innerText = res.posts || 0
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'posts') {
      document.getElementById('posts').innerText = newValue || 0
    }
  }
})

document.getElementById('submitPosts').addEventListener('click', () => {
  const posts = document.getElementById('postsInput').value
  chrome.storage.local.set({ posts }, () => console.log('posts saved'))
})

function getUrlsCountHtmlStr(urls) {
  const map = new Map()

  urls
    .map((url) => new URL(url).hostname)
    .forEach((hostname) => {
      if (map.has(hostname)) {
        map.set(hostname, map.get(hostname) + 1)
      } else {
        map.set(hostname, 1)
      }
    })

  return [...map.entries()]
    .map(([hostname, count]) => `<p><u>${hostname}</u> x${count}</p>`)
    .join('')
}

chrome.storage.local.get('urls', (res) => {
  const urls = res.urls || []

  document.getElementById('urlList').innerHTML = getUrlsCountHtmlStr(urls)
  document.getElementById('totalVote').innerText = urls.length
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'urls') {
      document.getElementById('urlList').innerHTML = getUrlsCountHtmlStr(newValue)
      document.getElementById('totalVote').innerText = newValue.length
    }
  }
})

document.getElementById('clearUrl').addEventListener('click', function () {
  chrome.storage.local.set({ urls: [] }, () => console.log('urls cleared'))
})

document
  .getElementById('fillForm')
  .addEventListener('click', async function () {
    chrome.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id },
      files: ['fillForm.js'],
    })
  })

document
  .getElementById('submitForm')
  .addEventListener('click', async function () {
    chrome.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id },
      files: ['submit.js'],
    })
  })

document.getElementById('saveUrl').addEventListener('click', async function () {
  chrome.scripting.executeScript({
    target: { tabId: (await getCurrentTab()).id },
    files: ['saveUrl.js'],
  })
})

async function download() {
  const ign = (await chrome.storage.local.get('ign')).ign || '<IGN>'
  const day = (await chrome.storage.local.get('day')).day || 1
  const posts = parseInt((await chrome.storage.local.get('posts')).posts || 0)
  const urls = (await chrome.storage.local.get('urls')).urls || []
  urls.sort()

  const title = `${ign} /${day}\uc77c /\ub204\uc801 ${posts === -1 ? (day * 20) : (posts + urls.length)}`
  const prepend = `\uc778\uac8c\uc784 \ub2c9\ub124\uc784: ${ign}\n\ub204\uc801 \uc77c\uc218: ${day}\n`
  const content = `${title}\n\n${prepend}\n\n${urls
    .map((url, index) => `${index + 1}. ${url}`)
    .join('\n')}`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  chrome.downloads.download({
    url,
    filename: `yeonhwa-voting-${ign}.txt`,
  })
}

document.getElementById('download').addEventListener('click', download)

document.addEventListener('keydown', async (e) => {
  if (e.key === 'F1') {
    chrome.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id },
      files: ['fillForm.js'],
    })
  }
  if (e.key === 'F2') {
    chrome.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id },
      files: ['submit.js'],
    })
  }
  if (e.key === 'F3') {
    chrome.scripting.executeScript({
      target: { tabId: (await getCurrentTab()).id },
      files: ['saveUrl.js'],
    })
  }
  if (e.key === 'F4') {
    try {
      await download()
    } catch (error) {
      console.log(error)
    }
  }
})


