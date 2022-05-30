//#region GRAPHICS

function setFormMessage(formElement, type, message){
  const messageElement = formElement.querySelector(".form_message");

  messageElement.textContent = message;
  messageElement.classList.remove('form_message-success', 'form_message-error')
  messageElement.classList.add(`form_message-${type}`)
}

function setInputError(inputElement, message){
  inputElement.classList.add("form_input-error");
  inputElement.parentElement.querySelector(".form_input-error-message").textContent = message;
}

function clearInputError(inputElement){
  inputElement.classList.remove("form_input-error")
  inputElement.parentElement.querySelector(".form_input-error-message").textContent= "";
}

/**
* This EventListener depending on the button (login/register)
* that is pressed adds class= 'hidden' to login form, and removes it from
* register form or vice versa
*/
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector('#login')
  const createAccountForm = document.querySelector('#createAccount')

  document.querySelector('#linkCreateAccount').addEventListener("click", event => {
      event.preventDefault();
      loginForm.classList.add("form-hidden");
      createAccountForm.classList.remove("form-hidden");
  });

  document.querySelector('#linkLogin').addEventListener("click", event => {
      event.preventDefault();
      loginForm.classList.remove("form-hidden");
      createAccountForm.classList.add("form-hidden");
  });

  loginForm.addEventListener("submit", event => {
      event.preventDefault();

      setFormMessage(loginForm, "error", "Neteisingas vardas/pavardė")
  });
/**
* Implementation lacking
*/
  document.querySelectorAll(".form_input").forEach(inputElement => {
      inputElement.addEventListener("blur", event => {
          if (event.target.id === "signUpUserName" && event.target.value.length > 0 && event.target.value.length < 5) {
              setInputError(inputElement, "Lauke turi būti bent 5 simboliai!");
          }
      });
      inputElement.addEventListener("input", event => {
          clearInputError(inputElement)
      })
  })
});

//#endregion

//#region REGISTER

const submitCreate = document.querySelector("#submitCreate");
/**
* This function takes values from register form
* and associates it with variables
*/
submitCreate.addEventListener("click", event => {

event.preventDefault();
let name = document.querySelector("#signUpUserName");
let lastName = document.querySelector("#signUpUserLastName");
let email = document.querySelector("#signUpUserEmail")

MiniAsyncHelperReg(name, lastName, email);
})

//#endregion

//#region ASYNC_HELPER_REG

/**
* This function main pupose is to (1) take in values from form;
*                                 (2) call async Fetch function with 
*                                     coresponding database values;
*                                 (3) console.log() values for error checking
*                                 (4) check if (1) and (2) function values are
*                                     not duplicated;
*                                 (5) call POST function and save form values
*                                     in a DataBase
* @param {string} name 
* @param {string} lastName 
* @param {string} email 
*/
async function MiniAsyncHelperReg(name, lastName, email) {

let users = [];

users = await AsyncFetch();

DataCheck_By_Email(users.data, email)

console.log("👀 CHECK 2 => IF_result:", typeof sessionStorage.getItem('bool'), sessionStorage.getItem('bool'))
const localSessionStorage = sessionStorage.getItem('bool')

console.log("👀 CHECK 3 => Bool_result:", localSessionStorage);

if(localSessionStorage == 'false'){
  PostData(name.value, lastName.value, email.value);

  const loginForm = document.querySelector('#login')
  const createAccountForm = document.querySelector('#createAccount')

  alert("✅ Vartotojas sukurtas!")

  setFormMessage(createAccountForm, "success", "Vartotojas sukurtas!")

  loginForm.classList.remove("form-hidden");
  createAccountForm.classList.add("form-hidden");

} else {
  alert("⚠️ Toks vartotojas jau egzistuoja!");
}

}

//#endregion

//#region LOGIN
/**
* This function takes values from login form
* and associates it with variables
*/
const submitLogin = document.querySelector("#submitLogin");

submitLogin.addEventListener("click", event => {

event.preventDefault();
let name = document.querySelector("#UserName");
let lastName = document.querySelector("#UserLastName");

console.log(name, lastName)
console.log(name.value, lastName.value)

MiniAsyncHelper_Log(name, lastName)

})

//#endregion

//#region ASYNC_HELPER_LOGIN

/**
* This function main pupose is to (1) take in values from form;
*                                  (2) call async Fetch function with 
*                                      coresponding database values;
*                                  (3) console.log() values for error checking
*                                  (4) check if (1) values can be found
*                                      in (2) fetched values
*                                  (5) if yes: redirect to todo.html;
*                                      if no: alert user
* @param {string} name 
* @param {string} lastName 
*/
async function MiniAsyncHelper_Log(name, lastName) {

let users = [];

users = await AsyncFetch();

DataCheck_By_NameLastName(users.data, name, lastName)

const localSessionStorage = sessionStorage.getItem('bool2' && 'bool3')

console.log ("👀 CHECK 2 => IF_result:", typeof sessionStorage.getItem('bool2'), sessionStorage.getItem('bool2'))

if(localSessionStorage == 'true'){
  alert("🆔 Vartotojas rastas!");
  
  window.location.href = "../todo/todo.html"

  console.log('Perduodamas', typeof localStorage.getItem('name'))
  console.log('Perduodamas', typeof localStorage.getItem('lastName'))
} else {
  alert("⚠️ Vartotojas NERASTAS");
}

}

//#endregion

//#region HELPER_POSTDATA

/**
* Function takes in three strings and using POST method
* saves these string values in a database
* @param {string} name 
* @param {string} lastName 
* @param {string} email 
*/
function PostData(name, lastName, email){
fetch('https://testapi.io/api/SurkusAPI/resource/Users', {
method: 'POST',
headers: {
  'Content-type': 'application/json'
},
  body: JSON.stringify({
  Name: `${name}`,
  LastName: `${lastName}`,
  Email: `${email}`,
})
})
  .then((response) => {
    if (response.ok) {
      console.log('👍 Connection Ok');
      return response.json();
    } else {
      console.log('👎 Connection not Ok');
    }
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  })
}

//#endregion

//#region HELPER_DATACHECK (by email)

/**
* This function checks if email value is found in an
* separated out array of emails from JS.object array
* using .includes() method;
* if certain email is found sessionStorage key 'bool' is set to true;
* Every Time functioned is called it resets the key 'bool' to false;
* @param {JS.objects array} data 
* @param {string} email 
* @returns null
*/
function DataCheck_By_Email(data, email){

sessionStorage.setItem('bool', 'false');

let tempArray = [];
data.forEach(element => {
  tempArray.push(element.Email)
});

console.log(tempArray)
console.log('Value iš formos:', typeof email.value, email.value)

sessionStorage.setItem('bool', `${tempArray.includes(email.value)}`)

console.log("👀 CHECK 1 => IF_result:", typeof sessionStorage.getItem('bool'), sessionStorage.getItem('bool'))

//return null; // just to make sure it is executed at the right time
}

//#endregion

//#region HELPER_DATACHECK (by name and lastname)
/**
* THis function checks if there are corresponding values
* to the ones entered in login form input fields using.include() method;
* if yes: session storage keys 'bool2' and 'bool3' are set to true;
* Aforementioned keys are reset to false every time function are called
* @param {JS.objects array} data 
* @param {string} name 
* @param {string} lastName 
* @returns 
*/
function DataCheck_By_NameLastName(data, name, lastName){

sessionStorage.setItem('bool2', 'false');
sessionStorage.setItem('bool3', 'false');

let tempArrayNames = [];
data.forEach(element => {
  tempArrayNames.push(element.Name)
});

let tempArrayLastNames = [];
data.forEach(element => {
  tempArrayLastNames.push(element.LastName)
});

console.log('Vardų array:', tempArrayNames)
console.log('Pavardžių array:', tempArrayLastNames)
console.log('Value iš formos: ', typeof name.value, name.value, 'ir', typeof lastName.value, lastName.value)

sessionStorage.setItem('bool2', `${tempArrayNames.includes(name.value)}`)
sessionStorage.setItem('bool3', `${tempArrayLastNames.includes(lastName.value)}`)

console.log("👀 CHECK 1 => IF_result:", typeof sessionStorage.getItem('bool2'), sessionStorage.getItem('bool2'))

PassData(name, lastName)

//return null;  // just to make sure it is executed at the right time
}
// #endregion

//#region HELPER_PASSDATA
/**
* This functions main purpose is to set correct values to
* keys 'name' and 'lastName';
* Every time this function is called it clear()'s sessionStorage
* @param {string} name 
* @param {string} lastName 
*/
function PassData(name, lastName){
  localStorage.clear();
  localStorage.setItem('name', name.value);
  localStorage.setItem('lastName', lastName.value);
}

//#endregion

//#region HELPER_CONSOLE.LOG(USERS)
/**
* This function is made for debugging purposes;
* It simply prints out all the fetched() data;
* @param {JS.objects array} data 
*/
function renderData(data){
data.forEach(element => {
  console.log('objektas:', element)
  console.log('id:',element.id)
  console.log('Name:', element.Name)
  console.log('LastName:', element.LastName)
  console.log('Email:', element.Email)
  console.log('createdAt:', element.createdAt)
})
}
//#endregion

//#region ASYNC_FETCH!
/**
* Function that fetches values asynchronously
* and in a proper sequence
* @returns JS.objects array
*/
async function AsyncFetch(){

const response = await fetch('https://testapi.io/api/SurkusAPI/resource/Users/')
const users = await response.json();

return users;
}

document.addEventListener("DOMContentLoaded", async () => {
let users = [];

users = await AsyncFetch();


console.log("Async_01", users)
console.log("Async_02", users.data)
//renderData(users.data)
})

//#endregion