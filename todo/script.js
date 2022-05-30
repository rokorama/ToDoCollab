const activeEntryContainer = document.querySelector('.activeEntryContainer')
const completedEntryContainer = document.querySelector('.completedEntryContainer')
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

document.querySelectorAll(".inputContainer").forEach(inputElement => {
    console.log(inputElement.className)

    let inputField = inputElement.querySelector('.inputTextField')
    inputField.addEventListener("blur", () => {
        if (inputField.value.length === 0) {
            setInputError(inputElement, "Field cannot be blank!");
        }
    });
    inputElement.addEventListener("input", () => {
        clearInputError(inputElement)
    })
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
    let entryUserId = combinedNames

    fetch('https://testapi.io/api/rokorama/resource/toDoTasks', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: entryType,
            content: entryContent,
            endDate: entryEndDate,
            userId: entryUserId,
            completed: false
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
    activeEntryContainer.innerHTML = ''
    completedEntryContainer.innerHTML = ''
    fetch('https://testapi.io/api/rokorama/resource/toDoTasks')
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(result => {
            resultJson = result.data;
            return resultJson.filter((entry) => entry.userId === combinedNames
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

        const completedCheckbox = document.createElement('input');
        completedCheckbox.id = 'completedCheckbox';
        completedCheckbox.type = 'checkbox';
        completedCheckbox.checked = entry.completed;

        const completedLabel = document.createElement('label');
        completedLabel.setAttribute('for', 'completedCheckbox');
        completedLabel.textContent = 'Completed';

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

            entry.type = editedType.value
            entry.content = editedContent.value
            entry.endDate = editedEndDate.value
            editEntry(elementId, entry)
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

        completedCheckbox.addEventListener('change', (event) => {
            const elementId = event.target.parentElement.id;

            if (completedCheckbox.checked) {
                entry.completed = false;
                toggleCompletedStatus(elementId, entry)
            } else {
                entry.completed = true;
                toggleCompletedStatus(elementId, entry)
            }
        })

        if (entry.completed) {
            div.append(type, content, endDate, deleteEntryButton,
                       completedCheckbox, completedLabel)
            div.setAttribute('id', entry.id);
            completedEntryContainer.append(div)
        } else {
            div.append(type, content, endDate,
                    editedType, editedContent, editedEndDate,
                    editButton, deleteEntryButton,
                    saveChangesButton, discardChangesButton,
                    completedCheckbox, completedLabel);
            div.setAttribute('id', entry.id);
            activeEntryContainer.append(div);
        }
    })
}

async function editEntry(entryId, entry) {
    const edit = await fetch(`https://testapi.io/api/rokorama/resource/toDoTasks/${entryId}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: entry.type,
            content: entry.content,
            endDate: entry.endDate,
            userId: entry.userId,
            completed: entry.completed
        })
    })
    
    if (edit) {
        getEntries()
    }
}

async function toggleCompletedStatus(entryId, entry) {
    const edit = await fetch(`https://testapi.io/api/rokorama/resource/toDoTasks/${entryId}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: entry.type,
            content: entry.content,
            endDate: entry.endDate,
            userId: entry.userId,
            completed: entry.completed
        })
    })
    
    if (edit) {
        setTimeout(1000)
        const div = document.getElementById(entryId);
        if (div.parentElement === activeEntryContainer) {
            activeEntryContainer.removeChild(div);
            completedEntryContainer.append(div);
        } else {
            completedEntryContainer.removeChild(div);
            activeEntryContainer.append(div);
        }
    }
}

async function deleteEntry(entryId) {
    const del = await fetch(`https://testapi.io/api/rokorama/resource/toDoTasks/${entryId}`, {
        method: 'DELETE'
    })

    if (del) {
        getEntries()
    }
}

function setInputError(inputElement, message) {
    console.log('error lol')
    inputElement.classList.add("form_input-error");
    let errorMessage = document.createElement('p');
    errorMessage.className = 'form_input-error-message'
    errorMessage.textContent = message;
    inputElement.append(errorMessage);
    let childElements = inputElement.getElementsByTagName('input');
    childElements[0].className = 'form_input-error';
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form_input-error")
    let elementToRemove = inputElement.getElementsByTagName('p');
    console.log(elementToRemove)
    elementToRemove[0].remove();

}

getEntries()