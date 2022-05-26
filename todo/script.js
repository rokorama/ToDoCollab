const outputContainer = document.querySelector('.entryContainer')
const addButton = document.getElementById('addButton')

//place somewhere else?
const userFirstName = localStorage.getItem('name')
const userLastName = localStorage.getItem('lastName')
const combinedNames = `${userFirstName}${userLastName}`

// text for header at top of the page
document.getElementById('pageHeader').textContent = `Tasks - ${userFirstName} ${userLastName}`

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', () => {
    const confirmLogout = confirm("Do you wish to log out?");
    if (confirmLogout) {
        localStorage.removeItem('name');
        localStorage.removeItem('lastName');
        window.location.href = '../index.html'
    }
})

addButton.addEventListener('click', () => {
    addButton.style.display = 'none'
    newEntryInput.style.display = 'inline-block'
})

const cancelButton = document.getElementById('cancelEntry')
cancelButton.addEventListener('click', () => {
    addButton.style.display = 'block'
    newEntryInput.style.display = 'none'
    
})

const saveButton = document.getElementById('saveEntry')
saveButton.addEventListener('click', () => saveEntry())

const dateInput = document.getElementById('newEntryEndDate')
dateInput.addEventListener('blur', () => {
    let date1 = new Date(dateInput.value)
    let date2 = new Date()
    if (date1 < date2) {
        alert("Cannot assign task to a past date!")
        dateInput.innerHTML = ""
    }
})

function saveEntry() {
    let entryType = document.getElementById('newEntryType').value;
    let entryContent = document.getElementById('newEntryContent').value;
    let entryEndDate = document.getElementById('newEntryEndDate').value;
    // placeholder value (maybe change to number?)
    let entryUserId = combinedNames

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
        entryType = '';
        entryContent = '';
        entryEndDate = null;
        getEntries()
    })
}

function getEntries() {
    outputContainer.innerHTML = ''
    // see if i can filter via URL parameters
    fetch('https://testapi.io/api/SurkusAPI/resource/ToDoList')
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(result => {
            resultJson = result.data;
            return resultJson.filter((entry) => entry.userName === combinedNames
            )
        })
        .then(filteredData => render(filteredData)); 
}

function render(entries) {
    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entryItem';

        // rename variables cause it causes nightmares below
        const type = document.createElement('p');
        type.id = 'entryType';
        type.textContent = entry.type;

        const content = document.createElement('p');
        content.id = 'entryContent';
        content.textContent = entry.content;

        const endDate = document.createElement('p');

        endDate.id = 'entryEndDate';
        endDate.textContent = entry.endDate;
        
        const editedType = document.createElement('input');
        editedType.type = 'text'
        editedType.style.display = 'none'
        
        const editedContent = document.createElement('input');
        editedContent.type = 'text'
        editedContent.style.display = 'none'

        const editedEndDate = document.createElement('input');
        editedEndDate.type = 'date'
        editedEndDate.style.display = 'none'

        const deleteEntryButton = document.createElement('button');
        deleteEntryButton.textContent = 'DELETE';

        const saveChangesButton = document.createElement('button');
        saveChangesButton.textContent = 'SAVE CHANGES';
        saveChangesButton.style.display = 'none'

        const discardChangesButton = document.createElement('button');
        discardChangesButton.textContent = 'DISCARD CHANGES';
        discardChangesButton.style.display = 'none'

        const editButton = document.createElement('button');
        editButton.textContent = 'EDIT';
        editButton.addEventListener('click', () => {
            editedType.style.display = 'block'
            editedContent.style.display = 'block'
            editedEndDate.style.display = 'block'

            editedType.value = entry.type;
            editedContent.value = entry.content;
            editedEndDate.value = entry.endDate;

            type.style.display = 'none'
            content.style.display = 'none'
            endDate.style.display = 'none'

            editButton.style.display = 'none'
            deleteEntryButton.style.display = 'none'

            saveChangesButton.style.display = 'block'
            discardChangesButton.style.display = 'block'
        })
        
        deleteEntryButton.addEventListener('click', (event) => {
            const elementId = event.target.parentElement.id;
            deleteEntry(elementId);
        })
        
        saveChangesButton.addEventListener('click', (event) => {
            const elementId = event.target.parentElement.id;

            let updatedType = editedType.value
            let updatedContent = editedContent.value
            let updatedEndDate = editedEndDate.value
            console.log(updatedType, updatedContent, updatedEndDate)
            editEntry(elementId, updatedType, updatedContent, updatedEndDate)
        })

        discardChangesButton.addEventListener('click', () => {
            editedType.style.display = 'none'
            editedContent.style.display = 'none'
            editedEndDate.style.display = 'none'

            type.style.display = 'block'
            content.style.display = 'block'
            endDate.style.display = 'block'

            editButton.style.display = 'block'
            deleteEntryButton.style.display = 'block'

            saveChangesButton.style.display = 'none'
            discardChangesButton.style.display = 'none'
        })

        div.append(type, content, endDate, editedType, editedContent, editedEndDate, editButton, deleteEntryButton, saveChangesButton, discardChangesButton);
        div.setAttribute('id', entry.id);
        outputContainer.append(div);
    })
}

async function editEntry(entryId, newType, newContent, newEndDate) {
    const edit = await fetch(`https://testapi.io/api/SurkusAPI/resource/ToDoList/${entryId}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: newType,
            content: newContent,
            endDate: newEndDate,
        })
    })
    
    if (edit) {
        getEntries()
    }
}

async function deleteEntry(entryId) {
    const del = await fetch(`https://testapi.io/api/SurkusAPI/resource/ToDoList/${entryId}`, {
        method: 'DELETE'
    })

    if (del) {
        getEntries()
    }
}

getEntries()