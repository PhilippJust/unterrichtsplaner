document
  .getElementById('planer-form')
  ?.addEventListener('submit', (evt: Event) => {
    evt.preventDefault()

    const anfrage = {
      fach: (document.getElementById('fach') as HTMLInputElement).value,
      themengebiet: (
        document.getElementById('themengebiet') as HTMLInputElement
      ).value,
      zielsetzung: (document.getElementById('zielsetzung') as HTMLInputElement)
        .value,
      dauer: parseInt(
        (document.getElementById('dauer') as HTMLInputElement).value
      ),
      klassengroesse: (
        document.getElementById('klassengroesse') as HTMLInputElement
      ).value,
      klassenstufe: parseInt(
        (document.getElementById('klassenstufe') as HTMLInputElement).value
      ),
      schulform: (document.getElementById('schulform') as HTMLInputElement)
        .value,
    }

    window.electronAPI.send('generate-unterrichtsablauf', anfrage)
  })

window.electronAPI.on('unterrichtsablauf-generated', (result: any) => {
  ;(document.getElementById('thema') as HTMLElement).innerText = result.thema

  const lernzieleList = document.getElementById('lernziele') as HTMLUListElement
  lernzieleList.innerHTML = ''
  for (const lernziel of result.lernziele) {
    const li = document.createElement('li')
    li.innerText = lernziel
    lernzieleList.appendChild(li)
  }

  populateTable('einstiegsphase', result.einstiegsphase)
  populateTable('erarbeitungsphase', result.erarbeitungsphase)
  populateTable('sicherungsphase', result.sicherungsphase)
})

function populateTable(tableId: string, data: any[]) {
  const tableBody = (
    document.getElementById(tableId) as HTMLTableElement
  ).getElementsByTagName('tbody')[0]
  tableBody.innerHTML = ''

  for (const aktion of data) {
    const row = tableBody.insertRow()
    row.insertCell(0).innerText = aktion.dauer
    row.insertCell(1).innerText = aktion.ziel
    row.insertCell(2).innerText = aktion.beschreibung
    row.insertCell(3).innerText = aktion.material
  }
}
