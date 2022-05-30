/**
 * This function is working in tandem with
 * login and todo functions; mainly it chekcs if
 * local storage has keys that are not null, depending
 * on the state of these values this function redirects
 * browser to either login screen or todo app depending
 * on of the user which credentials are saved
 * in local storage (they are reset (nulled) on logout
 * and set during login) 
 */
 function checkLocalStorage() {
    const name = localStorage.getItem('name')
    const lastName = localStorage.getItem('lastName')

    console.log('iš local storage key - name - paimu', typeof name, name)
    console.log('iš local storage key - lastName - paimu', typeof lastName, lastName)

    if(name == null || lastName == null ){
        window.location.href = "login/login.html"
    } else {
        window.location.href = "todo/todo.html"
    }
}

checkLocalStorage();