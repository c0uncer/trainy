const sbmtButton = document.getElementById('submit');
const username = document.getElementById('input');
const email = document.getElementById('email');
const password = document.getElementById('password');
const alertBox = document.getElementsByClassName('alert')
const alert = document.getElementById('alert-t')
const baseUrl = 'http//localhost:5000';

sbmtButton.addEventListener('click', async(e)=>{
    e.preventDefault()
        const nameValue = username.value;
        if (nameValue && nameValue.length >= 3 && password.value && password.value.length >=6){
            const res = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    name: username.value,
                    email: email.value,
                    password: password.value
                })
            })
            const data = await res.json()
            console.log(data.message)
            if (data.message == "Registered Successfully!") {
                alert.style.backgroundColor = "#33cc9980"
            }
            else if (data.message == "Email already exists") {
                alert.style.backgroundColor = "#e1215280";
            }
            else if (data.message == "Please provide a valid email") {
                alert.style.backgroundColor = "#e1215280";
            }
            alert.innerHTML = data.message
        }
        else if (nameValue && nameValue.length < 3){
            alert.innerHTML = "Name length must be bigger than 3!"
            alert.style.backgroundColor = "#e1215280";
        }
        else if(password.value && password.value.length < 6){
            alert.innerHTML = "Password length must be bigger than 6!"
            alert.style.backgroundColor = "#e1215280";
        }
        else if (!nameValue){
            alert.innerHTML = "Name can't be empty!"
            alert.style.backgroundColor = "#e1215280";
        }
        else if (!email.value){
            alert.innerHTML = " Email can't be empty!"
            alert.style.backgroundColor = "#e1215280";
        }
        else if (!password.value){
            alert.innerHTML = " Password can't be empty!"
            alert.style.backgroundColor = "#e1215280";
        }
                

                
});