  let isAuthenticated = false;

  
  const phoneForm = document.getElementById("phone-form");
  const otpForm = document.getElementById("otp-form");
  const phoneField = document.getElementById("phone_field");
  const otpInputs = document.querySelectorAll(".otp-input");
  const phoneError = document.getElementById("phone-error");
  const otpError = document.getElementById("otp-error");
  const messageContainer = document.getElementById("message-container");
  const resendButton = document.getElementById("resend-btn");
  const loginButton = document.querySelector(".login-button");
  const changeNumberButton = document.getElementById("change-number");



  window.onload = async function checkAuthStatus() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/check-auth", {
        method: 'GET',
        credentials: "include",
      });
      console.log(response);
      
      if(response.status === 200) {
        isAuthenticated = true
        updateLoginButton();
      }else{
        console.log("unauthorized");
        isAuthenticated = false
        updateLoginButton()
      }
     
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }



  function resetForms() {
    phoneForm.style.display = "block";
    otpForm.style.display = "none";

    phoneField.value = "";
    otpInputs.forEach((input) => (input.value = ""));

    phoneError.textContent = "";
    otpError.textContent = "";
    messageContainer.innerHTML = "";

    const inputContainer = document.querySelector(".input_container");
    const sendOtpButton = document.querySelector(".sign-in_btn");
    
    // Add margin if needed
    inputContainer.classList.add("mb-3");  // Add bottom margin to the input container
    sendOtpButton.classList.add("mt-3");   // Add top margin to the "Send OTP" button
  }





  function showMessage(message, isSuccess = true) {
    messageContainer.innerHTML = `<p class="${isSuccess ? "text-success" : "text-danger"}">${message}</p>`;
  }


   // Phone Number Validation and OTP Send
  phoneForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const phoneNumber = phoneField.value.trim();

    if (! /^[6-9]\d{9}$/.test(phoneNumber)) {
      phoneError.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    phoneError.textContent = "";

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      const result = await response.json();
      showMessage(result.message || "OTP sent successfully!");
      setTimeout(() => {
        showMessage("", false); // Clear the message
      }, 5000);

      phoneForm.style.display = "none";
      otpForm.style.display = "block";
    } catch (error) {
      console.error("Error sending OTP:", error);
      showMessage("Error sending OTP. Please try again.", false);
    }
  });


   // OTP Input Autofocus
   otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && index > 0 && input.value === "") {
        otpInputs[index - 1].focus();
      }
    });
  });


  otpForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const phoneNumber = phoneField.value.trim();
    const otpValue = Array.from(otpInputs).map((input) => input.value).join("");

    if (!/^[0-9]{6}$/.test(otpValue)) {
      otpError.textContent = "Please enter a valid 6-digit OTP.";
      return;
    }

    otpError.textContent = "";

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });

      if (!response.ok) throw new Error("OTP verification failed");

      const result = await response.json();
      showMessage(result.message || "OTP verified successfully!", true);
      otpForm.style.display = "none";
      handleLoginSuccess();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showMessage("Invalid OTP. Please try again.", false);
    }
  });


  resendButton.addEventListener("click", async function () {
    const phoneNumber = phoneField.value.trim();
    if (!phoneNumber) {
      showMessage("Invalid phone number. Refresh the page and try again.", false);
      return;
    }


    resendButton.disabled = true; // Disable button
    clearInterval(resendTimer);
    let countdown = 30; // 30 seconds countdown

    // Update the button text with the countdown
    resendButton.textContent = `Resend Code in ${countdown}s`;

    // Start the countdown timer
    let resendTimer;
    resendTimer = setInterval(function () {
      countdown--;
      resendButton.textContent = `Resend Code in ${countdown}s`;
      
      if (countdown === 0) {
        clearInterval(resendTimer); // Stop the countdown
        resendButton.disabled = false; // Enable button
        resendButton.textContent = "Resend Code"; // Reset button text
      }
    }, 1000); // Update every second

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      const result = await response.json();
      showMessage(result.message || "OTP resent successfully!", true);

      otpInputs.forEach((input) => (input.value = ""));
      otpInputs[0].focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
      showMessage("Error resending OTP. Please try again.", false);
    }
  });


  function updateLoginButton() {
    loginButton.removeEventListener("click", handleLogout);
    if (isAuthenticated) {
      loginButton.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Logout`;
      loginButton.removeAttribute("data-bs-toggle");
      loginButton.removeAttribute("data-bs-target");
      loginButton.addEventListener("click", handleLogout);
    } else {
      loginButton.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Login`;
      loginButton.setAttribute("data-bs-toggle", "collapse");
      loginButton.setAttribute("data-bs-target", "#sidebar");
    }
  }

  // Handle successful login
  function handleLoginSuccess() {
    isAuthenticated = true;
    updateLoginButton();
    // Close the login sidebar
    const sidebar = document.getElementById("sidebar");
    const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
    bsCollapse.hide();
    showMessage("Logged in successfully!", true);
  }

  changeNumberButton.addEventListener("click", function () {
    resetForms();
  });



  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");

      isAuthenticated = false;
      updateLoginButton();
      resetForms();
      showMessage("Logged out successfully!", true);
    } catch (error) {
      console.error("Error during logout:", error);
      showMessage("Logout failed. Please try again.", false);
    }
  }



