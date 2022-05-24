const outputContainer = document.querySelector('.entryContainer')
const addButton = document.getElementById('addButton')

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
    console.log(dateInput.value)
    let date1 = new Date(dateInput.value)
    let date2 = new Date()
    console.log(date1, date2)
    if (date1 < date2) {
        alert("Cannot assign task to a past date!")
        console.log('nope')
        dateInput.innerHTML = ""
    }
})

function saveEntry() {
    let entryType = document.getElementById('newEntryType').value;
    let entryContent = document.getElementById('newEntryContent').value;
    let entryEndDate = document.getElementById('newEntryEndDate').value;
    // placeholder value (maybe change to number?)
    let entryUserId = '2'

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
        entryType = '';
        entryContent = '';
        entryEndDate = null;
        getEntries()
    })
}

function getEntries() {
    outputContainer.innerHTML = ''
    fetch('https://testapi.io/api/SurkusAPI/resource/ToDoList')
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(result => render(result.data)); 
}

function render(entries) {
    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entryItem'

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

        
        const editButton = document.createElement('button');
        editButton.textContent = 'EDIT';
        editButton.addEventListener('click', (event) => {
            type.outerHTML = (`<input type="text" id="editedType">`);
            editedType.value = entry.type
            content.outerHTML = (`<input type="text" id="editedContent">`);
            editedContent.value = entry.content
            endDate.outerHTML = (`<input type="date" id="editedEndDate" value=${entry.endDate}>`);
            editedEndDate.value = entry.endDate
            
            const elementId = event.target.parentElement.id;
            
            console.log(type.textContent, content.textContent, endDate.textContent)
            
            //add cancel button to discard changes
            
            const confirmEditButton = document.createElement('button');
            confirmEditButton.textContent = 'SAVE CHANGES';
            div.append(confirmEditButton);
            
            
            confirmEditButton.addEventListener('click', () => {
                let updatedType = document.getElementById('editedType').value
                let updatedContent = document.getElementById('editedContent').value
                let updatedEndDate = document.getElementById('editedEndDate').value
                console.log(updatedType, updatedContent, updatedEndDate)
                editEntry(elementId, updatedType, updatedContent, updatedEndDate)
            })
        })

        const delButton = document.createElement('button');
        delButton.textContent = 'DELETE';
        delButton.addEventListener('click', (event) => {
            const elementId = event.target.parentElement.id;
            deleteEntry(elementId);
        })
        
        div.append(type, content, endDate, editButton, delButton);
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