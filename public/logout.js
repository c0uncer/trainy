const logoutBtn = document.getElementById('logout')
//logStat == "logout" ayarla
        logoutBtn.addEventListener('click', async (e)=>{
            e.preventDefault()
            const res = await fetch('http://localhost:5000/auth/logout',{
                method:"DELETE",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    
                })
            })
            const data = await res.json();
            console.log(data.message)
        })