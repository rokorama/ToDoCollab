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

    // const dc = DuplicationCheck(email);
    fetch('https://testapi.io/api/SurkusAPI/resource/ToDo/')
    .then((response) => {
        if (response.ok) {
        console.log('👍 Connection Ok');
        return response.json();
        } else {
        console.log('👎 Connection not Ok');
        }
    })

    .then(response => DataCheck_SS(response.data, email))
    // console.log('10000000', dc)
    // console.log(duplicationCheck, typeof duplicationCheck)

    console.log("2 => IF_result:", typeof sessionStorage.getItem('bool'), sessionStorage.getItem('bool'))
    const localSessionStorage = sessionStorage.getItem('bool')

    console.log("3 => Bool_result:", localSessionStorage);

  if(localSessionStorage == 'false'){
    PostData(name.value, lastName.value, email.value);

    const loginForm = document.querySelector('#login')
    const createAccountForm = document.querySelector('#createAccount')

    alert("Vartotojas sukurtas => bandykite jungtis!")

    setFormMessage(createAccountForm, "success", "Vartotojas sukurtas!")

    loginForm.classList.remove("form-hidden");
    createAccountForm.classList.add("form-hidden");

  } else {
    alert("(!) Toks vartotojas jau egzistuoja!");
  }

  // let name = document.querySelector("#signUpUserName");
  // let lastName = document.querySelector("#signUpUserLastName");
  // let email = document.querySelector("#signUpUserEmail")

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

    fetch('https://testapi.io/api/SurkusAPI/resource/ToDo/')
    .then((response) => {
        if (response.ok) {
        console.log('👍 Connection Ok');
        return response.json();
        } else {
        console.log('👎 Connection not Ok');
        }
    })

    .then(response => DataCheck_SS2(response.data, name, lastName))

    const localSessionStorage = sessionStorage.getItem('bool2')
    console.log ("2 => IF_result:", typeof sessionStorage.getItem('bool2'), sessionStorage.getItem('bool2'))
    if(localSessionStorage == 'true'){
      //window.location.href = "http://127.0.0.1:5500/todo/todo.html"
      alert("(!) Toks vartotojas rastas!");
    } else {
      alert("(!) Toks vartotojas nerastas!");
    }
})

// #region CONSOLE.LOG(USERS)
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
  
  function renderData(data){
    data.forEach(element => {
        console.log(element)
        console.log(element.id)
        console.log(element.Name)
        console.log(element.LastName)
        console.log(element.Email)
        console.log(element.createdAt)
    })
  }
//#endregion

// async function  DuplicationCheck(email){
 
// }

function DataCheck_SS(data, email){

  sessionStorage.setItem('bool', 'false');

  let tempArray = [];
  
  data.forEach(element => {
    tempArray.push(element.Email)
  });

  console.log(tempArray)
  console.log('lyginame su paduotu', email.value)
  
  sessionStorage.setItem('bool', `${tempArray.includes(email.value)}`)

  console.log("1 => IF_result:", typeof sessionStorage.getItem('bool'), sessionStorage.getItem('bool'))
  
  return null;
}


function DataCheck_SS2(data, name, lastName){

  sessionStorage.setItem('bool2', 'false');

  let tempArray = [];
  
  data.forEach(element => {
    tempArray.push(element.Name)
  });

  console.log(tempArray)
  console.log('lyginame su paduotu', name.value)
  
  sessionStorage.setItem('bool2', `${tempArray.includes(name.value)}`)

  console.log("1 => IF_result:", typeof sessionStorage.getItem('bool2'), sessionStorage.getItem('bool2'))
  
  return null;
}
// #endregion