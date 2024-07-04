

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');

    form.addEventListener('submit', handleRegistration);
});

async function handleRegistration(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    
    const firstName = form.first_name.value;
    const lastName = form.last_name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;
    const agreeTerm = form['agree-term'].checked;

    if (!agreeTerm) {
        alert('You must agree to the terms of service.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('role', 'Seller');

    try {
        const response = await fetch('http://127.0.0.1:8000/register/', {
            method: 'POST',
            body: formData,
        });

        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Registration successful:', result);
                window.location.href = "login.html";
            } else {
                console.error('Unexpected response format:', response);
                alert('Registration successful, but unexpected response format.');
            }
        } else {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                console.error('Registration failed:', error);
                alert('Registration failed: ' + (error.message || 'Unknown error'));
            } else {
                const errorText = await response.text();
                console.error('Registration failed with non-JSON response:', errorText);
                alert('Registration failed: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error: ' + error.message);
    }
}








document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', handleLogin);
});


let profileBefore = document.getElementById('profile_before');
let profileAfter = document.getElementById('profile_after');


async function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    const loginData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const contentType = response.headers.get('content-type');

        if (response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Login successful:', result);
                alert('Login successful!');
                
                // Save user data to localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', result.user_id);
                localStorage.setItem('role', result.role);            

                window.location.href = "add_products.html";
            } else {
                console.error('Unexpected response format:', response);
                alert('Login successful, but unexpected response format.');
            }
        } else {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                console.error('Login failed:', error);
                alert('Login failed: ' + (error.message || 'Unknown error'));
            } else {
                const errorText = await response.text();
                console.error('Login failed with non-JSON response:', errorText);
                alert('Login failed: ' + errorText);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error: ' + error.message);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        console.log("Logout link found");
        logoutLink.addEventListener('click', handleLogout);
    }
});
async function handleLogout(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');


    try {
        const response = await fetch("http://127.0.0.1:8000/logout/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log(data);
        alert("Logout Successful");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        
        window.location.href = "login.html";
      
    } catch (error) {
        console.error("Error during logout:", error);
    }
}