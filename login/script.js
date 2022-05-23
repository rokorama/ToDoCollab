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

        setFormMessage(loginForm, "error", "Neteisingas vartotojas/slaptažodis!")
    });

    document.querySelectorAll(".form_input").forEach(inputElement => {
        inputElement.addEventListener("blur", event => {
            if (event.target.id === "signUpUserName" && event.target.value.length > 0 && event.target.value.length < 5) {
                setInputError(inputElement, "Vartotojas turi turėti bent 5 simbolius!");
            }
        });
        inputElement.addEventListener("input", event => {
            clearInputError(inputElement)
        })
    })
});