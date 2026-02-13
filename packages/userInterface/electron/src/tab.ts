type Tab = 'ziel' | 'ablaufplan'

function switchTab(id: Tab) {
  const tabContents = document.getElementsByClassName('tab-content')
  for (let i = 0; i < tabContents.length; i++) {
    tabContents.item(i)?.setAttribute('class', 'tab-content hidden')
  }

  const selectedTab = document.getElementById(id)
  selectedTab?.setAttribute('class', 'tab-content')
}

function enableTab(id: Tab) {
  const element = document.getElementById(`${id}-selector`)
  if (!element) {
    throw `Konnte ${id}-selector nicht finden`
  }

  element.setAttribute('class', 'tab tab-available')
  element.setAttribute('onClick', `selectTab('${id}')`)
}

document.switchTab = switchTab
document.enableTab = enableTab
