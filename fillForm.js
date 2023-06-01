async function fillForm() {
  const ign = (await chrome.storage.local.get('ign')).ign
  const titleValue =
    '⚡374연화⚡신규보스카링⚡칼리 완벽구현⚡도원경⚡지속적인버전업⚡스캐⚡'
  const contentValue =
    `⚡374연화⚡신규보스카링⚡칼리 완벽구현⚡도원경⚡지속적인버전업⚡스캐⚡\n\n\n\n\n\nhttps://discord.gg/yeonhwa\n\n추천인: ${ign}`

  // change the option of select tag
  const select = document.getElementById('ca_name')
  if (select) {
    select.value = '메이플'
  }

  // update the value of the input field
  const title = document.getElementById('wr_subject')
  if (title) {
    title.value = titleValue
  }

  const content = document.getElementById('wr_content')
  if (content) {
    content.value = contentValue
  }

  // change the content of the body of an iframe to a p tag
  const iframe1 = document.querySelector('iframe')
  if (iframe1 && window.location.host !== 'android-dev.org') {
    const iframe2 = iframe1.contentWindow.document.getElementById('se2_iframe')
    if (iframe2) {
      const p = document.createElement('p')
      p.innerText = contentValue
      iframe2.contentWindow.document.body.appendChild(p)
    }
  }
}

fillForm()
