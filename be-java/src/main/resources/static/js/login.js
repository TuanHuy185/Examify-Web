const baseUrl = "http://localhost:8090";

document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('loginForm')
        .addEventListener('submit', function (event) {
            // prevent default behavior of submit
            event.preventDefault();
    
            const uname = document.getElementById("username");
            const pwd = document.getElementById("password");

            const reqJson = {
                username: uname.value,
                password: pwd.value,
            };
            
            fetch(
                `${baseUrl}/api/authenticate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reqJson),
                    credentials: 'include' // Đảm bảo rằng cookie được gửi kèm theo yêu cầu
                }
            )
            .then(response => response.json())
            .then(data => {
                if(data.status=="OK"){
                    // console.log('Login successful:', data);
                    window.location.href="/home";
                }
                else if(data.status=="ERROR"){
                    window.location.href="/login?error=true";
                    console.error('Error:', error);
                }
            })
            .catch(error => {
                if (error instanceof AuthenticationException) {
                    window.location.href="/login?error=true";
                    console.error('Error:', error);
                } 
                else {
                    window.location.href="/login?except=true";
                    console.error('Error:', error);
                }
            });

          
        });
});
