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
  const footerProfile = document.getElementById("profile-cart-container");

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

    if(footerProfile) {
      footerProfile.innerHTML = `
      <a href= "cart.html?userId=${encodeURIComponent(userId)}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h2.086a.75.75 0 0 1 .713.553l.911 3.644m2.275 9.104h8.64m4.5-11.25h-12.75m12.75 0-2.25 9h-10.5m-2.91-5.25h13.8m-11.4 8.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" />
        </svg>
        <span>Cart</span>
      </a>
    `;
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

    if(footerProfile) {
      footerProfile.innerHTML = `
      <a href="#" data-bs-toggle="collapse"
      data-bs-target="#sidebar"
      aria-expanded="false"
      aria-controls="sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span>Profile</span>
      </a>
    `;
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
    resendButton.disabled = false;
    resendButton.textContent = "Resend Code";
  }

  function showMessage(message, isSuccess = true) {
    messageContainer.innerHTML = `<p class="${isSuccess ? "text-success" : "text-danger"}">${message}</p>`;
    setTimeout(() => (messageContainer.innerHTML = ""), 3000); // Auto-clear message
  }

  phoneForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const phoneNumber = phoneField.value.trim();
    const submitButton = phoneForm.querySelector('button[type="submit"]');

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      phoneError.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    phoneError.textContent = "";
    submitButton.disabled = true;
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Sending OTP...";

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send OTP");

      showMessage(result.message || "OTP sent successfully!");
      phoneForm.style.display = "none";
      otpForm.style.display = "block";
      otpInputs[0].focus();
    } catch (error) {
      console.error("Error sending OTP:", error);
      showMessage(error.message || "Error sending OTP. Please try again.", false);
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });

  otpInputs.forEach((input, index) => {
    input.setAttribute("autocomplete", "one-time-code");

    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      // Auto-submit OTP if all fields are filled
      if ([...otpInputs].every((inp) => inp.value.length === 1)) {
        document.getElementById("otp-form").dispatchEvent(new Event("submit"));
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && index > 0 && input.value === "") {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      let data = e.clipboardData.getData("text").trim();
      if (data.length === 6) {
        data.split("").forEach((char, i) => {
          if (otpInputs[i]) otpInputs[i].value = char;
        });
        otpInputs[5].focus(); // Move focus to last input
        document.getElementById("otp-form").dispatchEvent(new Event("submit"));
      }
    });
  });

  let resendTimer;
  resendButton.addEventListener("click", async function () {
    const phoneNumber = phoneField.value.trim();

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      showMessage("Please enter a valid 10-digit phone number.", false);
      return;
    }

    resendButton.disabled = true;
    let countdown = 30;
    resendButton.textContent = `Resend Code in ${countdown}s`;

    resendTimer = setInterval(() => {
      countdown--;
      resendButton.textContent = `Resend Code in ${countdown}s`;
      if (countdown === 0) {
        clearInterval(resendTimer);
        resendButton.disabled = false;
        resendButton.textContent = "Resend Code";
      }
    }, 1000);

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to resend OTP");

      showMessage(result.message || "OTP resent successfully!", true);
      otpInputs.forEach((input) => (input.value = ""));
      otpInputs[0].focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
      showMessage(error.message || "Error resending OTP. Please try again.", false);
    }
  });

  changeNumberButton.addEventListener("click", resetForms);

  otpForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const phoneNumber = phoneField.value.trim();
    const otpValue = [...otpInputs].map((input) => input.value).join("");
    const submitButton = otpForm.querySelector('button[type="submit"]');

    if (!/^\d{6}$/.test(otpValue)) {
      otpError.textContent = "Please enter a valid 6-digit OTP.";
      return;
    }

    otpError.textContent = "";
    submitButton.disabled = true;
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Verifying OTP...";

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "OTP verification failed");

      // Show Toast message for successful login
      const loginToast = new bootstrap.Toast(document.getElementById("loginToast"));
      loginToast.show();

      showMessage(result.message || "OTP verified successfully!", true);
      resetForms();

      // Close the sidebar
      const sidebar = document.getElementById("sidebar");
      const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
      bsCollapse.hide();

      await updateUI();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showMessage(error.message || "Invalid OTP. Please try again.", false);
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
}


handleLogin()
















































