// Load the login section by default
document.addEventListener('DOMContentLoaded', function () {
    showLoginSection();
});

// Global variable to store registered users
let users = [];

// Show login section
function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('registration-section').style.display = 'none';
}

// Show registration section
function showRegistrationSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('registration-section').style.display = 'block';
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Check if the user exists and the password matches
    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        // Redirect to home page immediately
        window.location.href = 'index.html'; // Adjust this to your home page URL
    } else {
        document.getElementById('login-message').innerText = 'Invalid username or password.'; // Feedback message
    }
});

// Handle registration form submission
document.getElementById('registration-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const regFullname = document.getElementById('fullname').value;
    const regUsername = document.getElementById('reg-username').value;
    const regPassword = document.getElementById('reg-password').value;

    // Show loader
    document.getElementById('loader').style.display = 'block';

    // Simulate registration delay
    setTimeout(function () {
        // Check if the username is already taken
        const existingUser = users.find(user => user.username === regUsername);
        if (existingUser) {
            document.getElementById('reg-message').innerText = 'Username is already taken. Please choose another.'; // Feedback message
            document.getElementById('loader').style.display = 'none';
            return;
        }

        // Store the user details
        users.push({ fullname: regFullname, username: regUsername, password: regPassword });
        document.getElementById('loader').style.display = 'none';
        document.getElementById('reg-message').innerText = 'Registration successful!'; // Feedback message

        // Redirect to login section after showing success message
        setTimeout(showLoginSection, 2000); // Redirect after 2 seconds
    }, 4000); // Simulate a 4-second delay for registration
});

// Show registration form when link is clicked
document.getElementById('showRegister').addEventListener('click', function (e) {
    e.preventDefault();
    showRegistrationSection();
});

// Show login form when link is clicked
document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    showLoginSection();
});

// Google Login (Placeholder)
function loginWithGoogle() {
    alert('Google login functionality not implemented.');
}

// Facebook Login (Placeholder)
function loginWithFacebook() {
    alert('Facebook login functionality not implemented.');
}

// Microsoft Login (Placeholder)
function loginWithMicrosoft() {
    alert('Microsoft login functionality not implemented.');
}

// Event listeners for social login buttons
document.getElementById('googleLogin')?.addEventListener('click', loginWithGoogle);
document.getElementById('facebookLogin')?.addEventListener('click', loginWithFacebook);
document.getElementById('microsoftLogin')?.addEventListener('click', loginWithMicrosoft);
