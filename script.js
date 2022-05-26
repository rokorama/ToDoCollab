console.log('Hello world!')

function checkLocalStorage() {
    const name = localStorage.getItem('name')
    const lastName = localStorage.getItem('lastName')

    if(name == null || lastName == null ){
        window.location.href = "login/login.html"
    } else {
        window.location.href = "todo/todo.html"
    }
}

checkLocalStorage();