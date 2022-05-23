const outputContainer = document.getElementById('entryContainer')
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
        // render all tasks including the new one here
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
        div.id = 'containerItem'

        const type = document.createElement('p');
        type.id = 'entryType';
        type.textContent = entry.type;

        const content = document.createElement('p');
        content.id = 'entryContent';
        content.textContent = entry.content;

        const endDate = document.createElement('p');

        endDate.id = 'entryEndDate';
        endDate.textContent = entry.endDate;

        const delButton = document.createElement('button');
        delButton.textContent = 'DELETE';
        delButton.addEventListener('click', (event) => {
            const elementId = event.target.parentElement.id;
            deleteEntry(elementId);
        })

        div.append(type, content, endDate, delButton);
        div.setAttribute('id', entry.id);
        outputContainer.append(div);
    })
}

function deleteEntry() {
    
}

getEntries()