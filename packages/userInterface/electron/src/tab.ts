export type Tab = 'ziel' | 'ablaufplan'

export function selectTab(id: Tab) {
  const tabContents = document.getElementsByClassName('tab-content')
  for (let i = 0; i < tabContents.length; i++) {
    tabContents.item(i)?.setAttribute('class', 'tab-content hidden')
  }

  const selectedTab = document.getElementById(id)
  selectedTab?.setAttribute('class', 'tab-content')
}

export function enableTab(id: Tab) {
  const element = document.getElementById(`${id}-selector`)
  if (!element) {
    throw `Konnte ${id}-selector nicht finden`
  }

  element.setAttribute('class', 'tab tab-available')
  element.setAttribute('onClick', `selectTab('${id}')`)
}
