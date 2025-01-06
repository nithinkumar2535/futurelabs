let isAuthenticated = false; // Initialize the authentication state


document.addEventListener("DOMContentLoaded", function () {
  const phoneForm = document.getElementById("phone-form");
  const otpForm = document.getElementById("otp-form");
  const phoneField = document.getElementById("phone_field");
  const otpInputs = document.querySelectorAll(".otp-input");
  const phoneError = document.getElementById("phone-error");
  const otpError = document.getElementById("otp-error");
  const messageContainer = document.getElementById("message-container");
  const resendButton = document.getElementById("resend-btn");
  const closeButton = document.querySelector('[data-bs-toggle="collapse"]'); // Sidebar close button
  const loginButton = document.querySelector(".login-button");



  async function checkAuthStatus() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/check-auth", { credentials: "include" });
      const result = await response.json();
      console.log(result);
      
      isAuthenticated = result.isAuthenticated || false;
      updateLoginButton();
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  }
  
  
  




  // Function to update button text and action
  function updateLoginButton() {
    loginButton.removeEventListener("click", handleLogout);
    if (isAuthenticated) {
      loginButton.innerHTML = `<img src="images/icon-svg/logout.svg" class="login-icon" alt="" /> Logout`;
      loginButton.removeAttribute("data-bs-toggle");
      loginButton.removeAttribute("data-bs-target");
      loginButton.addEventListener("click", handleLogout);
    } else {
      loginButton.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Login`;
      loginButton.setAttribute("data-bs-toggle", "collapse");
      loginButton.setAttribute("data-bs-target", "#sidebar");
    }
  }

  // Handle logout action
  async function handleLogout() {
    try {
      const response = await fetch("/api/v1/auth/logout", {
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

  checkAuthStatus();


  // Example: Update authentication status after login
  function handleLoginSuccess() {
    isAuthenticated = true;
    updateLoginButton();
  }

  // Reset Sidebar State on Open
  document.querySelector('[data-bs-target="#sidebar"]').addEventListener("click", function () {
    resetForms();
  });

  // Reset Sidebar State on Close
  closeButton.addEventListener("click", function () {
    resetForms();
  });

  function resetForms() {
    phoneForm.style.display = "block";
    otpForm.style.display = "none";

    phoneField.value = "";
    otpInputs.forEach((input) => (input.value = ""));

    phoneError.textContent = "";
    otpError.textContent = "";
    messageContainer.innerHTML = "";
  }

  // Helper function to show messages
  function showMessage(message, isSuccess = true) {
    messageContainer.innerHTML = `<p class="${isSuccess ? 'text-success' : 'text-danger'}">${message}</p>`;
  }

  // Phone Number Validation and OTP Send
  phoneForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const phoneNumber = phoneField.value.trim();

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
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

  // OTP Verification
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
      handleLoginSuccess()
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showMessage("Invalid OTP. Please try again.", false);
    }
  });

  // Resend OTP
  resendButton.addEventListener("click", async function () {
    const phoneNumber = phoneField.value.trim();
    if (!phoneNumber) {
      showMessage("Invalid phone number. Refresh the page and try again.", false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) throw new Error("Failed to resend OTP");

      const result = await response.json();
      showMessage(result.message || "OTP resent successfully!", true);

      // Clear and refocus OTP fields
      otpInputs.forEach((input) => (input.value = ""));
      otpInputs[0].focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
      showMessage("Error resending OTP. Please try again.", false);
    }
  });
});
