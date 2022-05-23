const addButton = document.getElementById('addButton')

addButton.addEventListener("click", () => {
    addButton.style.display = "none"
    newEntryInput.style.display = 'inline-block'
})

const cancelButton = document.getElementById("cancelEntry")
cancelButton.addEventListener("click", () => {
    addButton.style.display = "block"
    newEntryInput.style.display = 'none'
    
})

const saveButton = document.getElementById("saveEntry")
saveButton.addEventListener("click", () => void 0)