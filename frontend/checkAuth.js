document.addEventListener("DOMContentLoaded", async () => {

  await updateUI();
});




async function updateUI() {
  const { isAuthenticated, userId } = await checkAuthStatus();
  const { cartCount } = isAuthenticated ? await fetchCartCount() : { cartCount: 0 };

  const loginButton = document.getElementById("login-button-desktop");
  const cartButton = document.getElementById("cart-button-desktop");
  const cartItems = document.getElementById("cart-badge-desktop");

  const loginButtonMobile = document.getElementById("login-button-mobile");
  const cartButtonMobile = document.getElementById("cart-button-mobile");
  const cartItemsMobile = document.getElementById("cart-badge-mobile");

  if (isAuthenticated) {
    // Show "Logout" and "Cart"

    if (loginButton) {
      loginButton.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Logout`;
      loginButton.removeAttribute("data-bs-toggle");
      loginButton.removeAttribute("data-bs-target");
      loginButton.addEventListener("click", handleLogout);
    }


    if (cartButton) {
      cartButton.style.display = "inline"; // Show cart button
      cartButton.href = `cart.html?userId=${encodeURIComponent(userId)}`;

      if (cartItems) {
        cartItems.style.display = "flex"; // Show cart badge
        cartItems.innerHTML = `${cartCount}`;
      }
    }


    if (loginButtonMobile) {
      loginButtonMobile.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Logout`;
      loginButtonMobile.removeAttribute("data-bs-toggle");
      loginButtonMobile.removeAttribute("data-bs-target");
      loginButtonMobile.addEventListener("click", handleLogout);
    }

    if (cartButtonMobile) {
      cartButtonMobile.style.display = "block"; // Show cart button
      cartButtonMobile.href = `cart.html?userId=${encodeURIComponent(userId)}`;

      if (cartItemsMobile) {
        cartItemsMobile.style.display = "inline"; // Show cart badge
        cartItemsMobile.innerHTML = `${cartCount}`;
      }
    }

  } else {

    if (loginButton) {
      loginButton.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Login`;
      loginButton.setAttribute("data-bs-toggle", "collapse");
      loginButton.setAttribute("data-bs-target", "#sidebar");
      loginButton.removeEventListener("click", handleLogout);
    }


    if (cartButton) {
      cartButton.style.display = "none"; // Hide cart button
      cartButton.removeAttribute("href");

      if (cartItems) {
        cartItems.style.display = "none"; // Hide cart badge
        cartItems.innerHTML = ""; // Clear cart count
      }
    }

    if (loginButtonMobile) {
      loginButtonMobile.innerHTML = `<img src="images/icon-svg/login.svg" class="login-icon" alt="" /> Login`;
      loginButtonMobile.setAttribute("data-bs-toggle", "collapse");
      loginButtonMobile.setAttribute("data-bs-target", "#sidebar");
      loginButtonMobile.removeEventListener("click", handleLogout);
    }

    if (cartButtonMobile) {
      cartButtonMobile.style.display = "none"; // Hide cart button
      cartButtonMobile.removeAttribute("href");

      if (cartItemsMobile) {
        cartItemsMobile.style.display = "none"; // Hide cart badge
        cartItemsMobile.innerHTML = ""; // Clear cart count
      }
    }
  }
}


async function fetchCartCount() {
  const { userId } = await checkAuthStatus()

  if (!userId) {
    return
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/cart/get/${userId}`)
    const Data = await response.json()
    const data = Data.data
    return { cartCount: data.length }
  } catch (error) {
    console.log("Error getting cart data", error);

  }
}


async function checkAuthStatus() {
  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/check-auth`, {
      method: 'GET',
      credentials: "include",
    });

    if (response.status === 200) {
      const result = await response.json();
      const userId = result.data._id

      return { isAuthenticated: true, userId };
    } else {
      return { isAuthenticated: false, userId: null };


    }
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isAuthenticated: false, userId: null };
  }
}

async function handleLogout() {
  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    console.log(response);


    if (response.ok) {
      // Show Toast message for successful logout
      $('#logoutToast').toast('show'); // Bootstrap toast
      await updateUI(); // Update the UI after logout
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}







async function handleLogin() {

  const phoneForm = document.getElementById("phone-form");
  const otpForm = document.getElementById("otp-form");
  const phoneField = document.getElementById("phone_field");
  const otpInputs = document.querySelectorAll(".otp-input");
  const phoneError = document.getElementById("phone-error");
  const otpError = document.getElementById("otp-error");
  const resendButton = document.getElementById("resend-btn");
  const changeNumberButton = document.getElementById("change-number");
  const messageContainer = document.getElementById("message-container");

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


  phoneForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const phoneNumber = phoneField.value.trim();
    const submitButton = phoneForm.querySelector('button[type="submit"]');



    if (! /^[6-9]\d{9}$/.test(phoneNumber)) {
      phoneError.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    phoneError.textContent = "";
    submitButton.disabled = true;
    const originalButtonText = submitButton.textContent; // Save original button text
    submitButton.textContent = "Sending OTP..."; // Change to loading message




    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });


      if (!response.ok) throw new Error("Failed to send OTP");

      const result = await response.json();
      showMessage(result.message || "OTP sent successfully!");
      setTimeout(() => {
        showMessage("", false); // Clear the message
      }, 3000);

      phoneForm.style.display = "none";
      otpForm.style.display = "block";
    } catch (error) {
      console.error("Error sending OTP:", error);
      showMessage("Error sending OTP. Please try again.", false);
    } finally {
      // Restore the original button text and enable the button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });

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

  let resendTimer;

  resendButton.addEventListener("click", async function () {
    const phoneNumber = phoneField.value.trim();

    if (! /^[6-9]\d{9}$/.test(phoneNumber)) {
      showMessage("Please enter a valid 10-digit phone number.", false);
      return;
    }


    resendButton.disabled = true; // Disable button
    let countdown = 30; // 30 seconds countdown

    // Update the button text with the countdown
    resendButton.textContent = `Resend Code in ${countdown}s`;

    // Start the countdown timer

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
      const response = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
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

  changeNumberButton.addEventListener("click", function () {
    resetForms();
  });

  otpForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const phoneNumber = phoneField.value.trim();
    const otpValue = Array.from(otpInputs).map((input) => input.value).join("");
    const submitButton = otpForm.querySelector('button[type="submit"]');

    if (!/^[0-9]{6}$/.test(otpValue)) {
      otpError.textContent = "Please enter a valid 6-digit OTP.";
      return;
    }

    otpError.textContent = "";

    // Disable the submit button and show loading message
    const originalButtonText = submitButton.textContent; // Save the original button text
    submitButton.disabled = true;
    submitButton.textContent = "Verifying OTP..."; // Change to loading message

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });

      if (!response.ok) throw new Error("OTP verification failed");

      const result = await response.json();

      // Show Toast message for successful login
    $('#loginToast').toast('show');


      showMessage(result.message || "OTP verified successfully!", true);
      resetForms()
      const sidebar = document.getElementById("sidebar");
      const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
      bsCollapse.hide();
      await updateUI()
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showMessage("Invalid OTP. Please try again.", false);
    } finally {
      // Restore the original button text and enable the button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });


}

handleLogin()
















































