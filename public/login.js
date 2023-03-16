const sbmtButton = document.getElementById('submit');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const alertBox = document.getElementsByClassName('alert')
        const alert = document.getElementById('alert-t')
        const baseUrl = 'http//localhost:5000';
        const LogoutBtn = document.getElementById('login-out')
        let loggedIn = false;

        if (loggedIn == false){
            sbmtButton.addEventListener('click', async (e) => {
                e.preventDefault()
                const res = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value
                    })
                })
                const data = await res.json()
                console.log(data.message)
                alert.innerHTML = data.message
                if (data.message == "Login Successfull!") {
                    alert.style.backgroundColor = "#33cc9980"
                    alert.innerHTML += " You will be redirected to the homepage in 3 seconds..."
                    loggedIn = true;
                    if(data.logRole == "admin"){
                        async function Redirect(){
                            await fetch('http://localhost:5000/' ,{
                            method: 'POST',
                            headers: {
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                logStat: "admin login"
                            })
                            })
                        }
                        Redirect()
                        // setTimeout(adminRedirect,3000)
                        // function adminRedirect() {
                        //     document.location.href = 'http://localhost:5000/'
                        // }
                    }
                    else if (data.logRole == "user"){
                        async function Redirect(){
                            await fetch('http://localhost:5000/' ,{
                            method: 'POST',
                            headers: {
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                logStat: "user login"
                            })
                            })
                        }
                        Redirect()
                        setTimeout(adminRedirect,3000)
                        function adminRedirect() {
                            document.location.href = 'http://localhost:5000/'
                        }
                    }
                }
                else if (data.message == "Invalid Credentials") {
                    alert.style.backgroundColor = "#e1215280";

                }
                else if (data.message == "Please provide email and password") {
                    alert.style.backgroundColor = "#e1215280";
                }
                else if (data.message == "Please verify your email"){
                    alert.style.backgroundColor = "#e1215280";
                }



            });
            
        }