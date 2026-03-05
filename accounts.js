// Encryption
function encryptPassword(password) {
    let encrypt = "";
    for (let i = 0; i < password.length; i++) {
        encrypt += String.fromCharCode(password.charCodeAt(i) + 3);
    }
    return encrypt;
}

// Decryption
function decryptPassword(password) {
    let decrypt = "";
    for (let i = 0; i < password.length; i++) {
        decrypt += String.fromCharCode(password.charCodeAt(i) - 3);
    }
    return decrypt;
}

// E-mail validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validatiom
function validatePassword(password) {
    return password.length >= 6;
}

// Output message
function showMessage(element, message, type = 'error') {
    element.textContent = message;
    element.style.color = type === 'success' ? '#28A745' : '#DC3545';
    element.style.fontSize = '0.9rem';
    element.style.marginTop = '0.5rem';
}

// Output Message Clearance
function clearMessage(element) {
    element.textContent = '';
}

// Sign-Up Logic
const signupBtn = document.getElementById("signBtn");
const signModel = document.getElementById("signUp");
const close1 = document.getElementById("closePopup1");
const signupForm = document.getElementById("signUpForm");
let signUpMessage = document.getElementById("signUpMessage");
const signLink = document.getElementById("signLink");

// Opening the Pop up
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signModel.style.display = "flex";
    clearMessage(signUpMessage);
    signupForm.reset();
});

// Closing the Pop up
close1.addEventListener("click", () => {
    signModel.style.display = "none";
    clearMessage(signUpMessage);
    signupForm.reset();
});

// Closing the Pop up when clicking the area other the Pop up
signModel.addEventListener("click", (e) => {
    if (e.target === signModel) {
        signModel.style.display = "none";
        clearMessage(signUpMessage);
        signupForm.reset();
    }
});

// Submit
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get and trim form values
    const usernameSigned = document.getElementById("newUsername").value.trim();
    const passwordSigned = document.getElementById("newPassword").value.trim();
    const gmailSigned = document.getElementById("newGmail").value.trim();
    
    // Validation checks
    if (!usernameSigned || !gmailSigned || !passwordSigned) {
        showMessage(signUpMessage, "Please fill out all the fields", 'error');
        return;
    }
    
    if (usernameSigned.length < 3) {
        showMessage(signUpMessage, "Username must be at least 3 characters", 'error');
        return;
    }
    
    if (!validateEmail(gmailSigned)) {
        showMessage(signUpMessage, "Please enter a valid email address", 'error');
        return;
    }
    
    if (passwordSigned.length < 6) {
        showMessage(signUpMessage, "Password must be at least 6 characters", 'error');
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if email already exists
    const emailCheck = users.some(user => user.gmail.toLowerCase() === gmailSigned.toLowerCase());
    if (emailCheck) {
        showMessage(signUpMessage, "This email has already been registered", 'error');
        return;
    }
    
    // Check if username already exists
    const unameCheck = users.some(user => user.username.toLowerCase() === usernameSigned.toLowerCase());
    if (unameCheck) {
        showMessage(signUpMessage, "This username has already been taken", 'error');
        return;
    }
    
    // Add new user
    users.push({
        username: usernameSigned,
        password: encryptPassword(passwordSigned),
        gmail: gmailSigned,
        createdAt: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Show success message
    showMessage(signUpMessage, "Account created successfully! You can now log in.", 'success');
    
    // Clear form
    signupForm.reset();
    
    // Auto close after 2 seconds
    setTimeout(() => {
        signModel.style.display = "none";
        clearMessage(signUpMessage);
    }, 2000);
});

// Login Logic
const loginBtn = document.getElementById("loginBtn");
const loginModel = document.getElementById("login");
const close2 = document.getElementById("closePopup2");
const loginForm = document.getElementById("logInForm");
const loginMessage = document.getElementById("loginMessage");
const loginLink = document.getElementById("loginLink");

// Open login modal
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModel.style.display = "flex";
    clearMessage(loginMessage);
    loginForm.reset();
});

// Close login modal
close2.addEventListener("click", () => {
    loginModel.style.display = "none";
    clearMessage(loginMessage);
    loginForm.reset();
});

// Closing the Pop up when clicking the area other the Pop up
loginModel.addEventListener("click", (e) => {
    if (e.target === loginModel) {
        loginModel.style.display = "none";
        clearMessage(loginMessage);
        loginForm.reset();
    }
});

// Submit
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUsername = document.getElementById("username").value.trim();
    const currentPassword = document.getElementById("password").value.trim();
    
    // Validation checks
    if (!currentUsername || !currentPassword) {
        showMessage(loginMessage, "Please enter both username and password", 'error');
        return;
    }
    
    // Find user with matching credentials
    const foundUser = users.find(user => 
        user.username.toLowerCase() === currentUsername.toLowerCase() && 
        decryptPassword(user.password) === currentPassword
    );
    
    if (foundUser) {
        // Store logged in user
        localStorage.setItem("loggedInUser", foundUser.username);
        localStorage.setItem("loginTime", new Date().toISOString());
        
        // Update UI
        updateLoginUI(foundUser.username);
        
        // Show success and close modal
        showMessage(loginMessage, "Login successful!", 'success');
        
        setTimeout(() => {
            loginModel.style.display = "none";
            loginForm.reset();
            clearMessage(loginMessage);
        }, 1000);
    } else {
        showMessage(loginMessage, "Invalid username or password", 'error');
        loginForm.reset();
    }
});

// Log Out Logic
function logOutUser(e) {
    e.preventDefault();
    
    // Confirm logout
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loginTime");
        
        // Reset UI to login button
        loginLink.innerHTML = `<a href="#" id="loginBtn">LOGIN</a>`;
        
        // Re-attach login button event listener
        const newLoginBtn = document.getElementById("loginBtn");
        newLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loginModel.style.display = "flex";
            clearMessage(loginMessage);
            loginForm.reset();
        });
        
        // Show notification
        alert("You have been logged out successfully!");
    }
}

// For Logout button
function updateLoginUI(username) {
    loginLink.innerHTML = `<a href="#" id="logoutBtn" style="color: white;">LOG OUT (${username})</a>`;
    
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", logOutUser);
}

// Checking if user is already logged in
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    
    if (loggedInUser) {
        updateLoginUI(loggedInUser);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
});

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
    // Close modals with Escape key
    if (e.key === "Escape") {
        if (signModel.style.display === "flex") {
            signModel.style.display = "none";
            clearMessage(signUpMessage);
            signupForm.reset();
        }
        if (loginModel.style.display === "flex") {
            loginModel.style.display = "none";
            clearMessage(loginMessage);
            loginForm.reset();
        }
    }
});