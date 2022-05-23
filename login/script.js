// ############
// # Graphics #
// ############
//#region 

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

// ###############
// # CREATE USER #
// ###############
//#region 

const submitCreate = document.querySelector("#submitCreate");

submitCreate.addEventListener("click", event => {

    event.preventDefault();
    let name = document.querySelector("#signUpUserName");
    let lastName = document.querySelector("#signUpUserLastName");
    let email = document.querySelector("#signUpUserEmail")

    PostData(name.value, lastName.value, email.value);
})

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

// #############################
// # Log In with existing user #
// #############################
//#region 

const submitLogin = document.querySelector("#submitLogin");

submitLogin.addEventListener("click", event => {

    event.preventDefault();
    let name = document.querySelector("#UserName");
    let lastName = document.querySelector("#UserLastName");

    // PostData(name.value, lastName.value, email.value);
})


fetch('https://testapi.io/api/SurkusAPI/resource/ToDo/')
    .then((response) => {
        if (response.ok) {
        console.log('👍 Connection Ok');
        return response.json();
        } else {
        console.log('👎 Connection not Ok');
        }
    })
    .then(response => renderData(response.data))
    //  .then(data => console.log(data, typeof data))
    // .then(data => renderData(data))

    
    
function renderData(data){
    // const elem1 = data.LastName;
    // console.log(elem1)
    data.forEach(element => {
        //let name = segment.Name
        console.log(element)
        console.log(element.id)
        console.log(element.Name)
        console.log(element.LastName)
        console.log(element.Email)
        console.log(element.createdAt)
    })
}

//#endregion