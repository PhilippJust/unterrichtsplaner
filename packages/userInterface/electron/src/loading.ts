function enableLoading() {
  const loadingOverlay = document.getElementById('loading-overlay')
  loadingOverlay?.classList.remove('hidden')
  loadingOverlay?.classList.add('flex')
}

function disableLoading() {
  const loadingOverlay = document.getElementById('loading-overlay')
  loadingOverlay?.classList.add('hidden')
  loadingOverlay?.classList.remove('flex')
}

document.enableLoading = enableLoading
document.disableLoading = disableLoading
