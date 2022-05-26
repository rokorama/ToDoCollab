//#region GRAPHICS

function setFormMessage(formElement, type, message){
    const messageElement = formElement.querySelector(".form_message");

    messageElement.textContent = message;
    messageElement.classList.remove('form_message-success', 'form_message-error')
    messageElement.classList.add(`form_message-${type}`)
}

//setFormMessage(loginForm, "success", "Prisijungėte!")

function setInputError(inputElement, message){
    inputElement.classList.add("form_input-error");
    inputElement.parentElement.querySelector(".form_input-error-message").textContent = message;
}

function clearInputError(inputElement){
    inputElement.classList.remove("form_input-error")
    inputElement.parentElement.querySelector(".form_input-error-message").textContent= "";
}

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

        //fetch login

        setFormMessage(loginForm, "error", "Neteisingas vardas/pavardė")
    });

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

submitCreate.addEventListener("click", event => {

  event.preventDefault();
  let name = document.querySelector("#signUpUserName");
  let lastName = document.querySelector("#signUpUserLastName");
  let email = document.querySelector("#signUpUserEmail")

  MiniAsyncHelperReg(name, lastName, email);
})

//#endregion

//#region ASYNC_HELPER_REG

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

function PostData(name, lastName, email){
  fetch('https://testapi.io/api/SurkusAPI/resource/ToDo', {
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
  
  return null;
}

//#endregion

//#region HELPER_DATACHECK (by name and lastname)

function DataCheck_By_NameLastName(data, name, lastName){

  sessionStorage.setItem('bool2', 'false');

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

  return null;
}
// #endregion

//#region HELPER_PASSDATA

  function PassData(name, lastName){
    localStorage.clear();
    localStorage.setItem('name', name.value);
    localStorage.setItem('lastName', lastName.value);
  }

//#endregion

//#region HELPER_CONSOLE.LOG(USERS)

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

async function AsyncFetch(){
  const response = await fetch('https://testapi.io/api/SurkusAPI/resource/ToDo/')
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