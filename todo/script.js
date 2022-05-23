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
saveButton.addEventListener("click", () => saveEntry())

function saveEntry() {
    let entryType = document.getElementById('newEntryType').value;
    let entryContent = document.getElementById('newEntryContent').value;
    let entryEndDate = document.getElementById('newEntryEndDate').value;
    // placeholder value (maybe change to number?)
    let entryUserId = "2"

    fetch('https://testapi.io/api/SurkusAPI/resource/ToDoList', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: entryType,
            content: entryContent,
            endDate: entryEndDate,
            userName: entryUserId
        })
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((result) => {
        console.log(result);
        entryType = "";
        entryContent = "";
        entryEndDate = null;
        // render all tasks including the new one here
    })
}
