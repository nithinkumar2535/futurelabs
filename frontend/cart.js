
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.cart-card');
  const modal = document.getElementById('exampleModal');
  const confirmRemoveButton = modal.querySelector('.confirm-remove');
  const cartSummaryContainer = document.querySelector('.cart-value');



  const params = new URLSearchParams(window.location.search);
  const userId = params.get('userId'); // Gets the value of `userId`

  if (!userId) {
    window.location.href = "error.html";
    console.log("User not found");
  }

  const setupProceedButtonListener = () => {
    const proceedButton = document.querySelector('.toggle-button');
    if (proceedButton) {
      proceedButton.addEventListener('click', (event) => {
        // Navigate to the Address section
        document.querySelector('#checkup1').classList.remove('active');
        document.querySelector('#checkup2').classList.add('active');
      });
    }
  };


  const recalculateTotals = (detailedItems, appliedCoupon = null) => {
    const sampleCollectionCharges = 250;
    const isSampleFree = true;

    const exclusiveDiscount = detailedItems.reduce((total, item) => {
        if (item.category === 'Exclusive') {
            return total + (item.offerPrice * item.quantity * 0.1);
        }
        return total;
    }, 0);

    const cartValue = detailedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountedValue = detailedItems.reduce((total, item) => total + item.offerPrice * item.quantity, 0);
    
    let couponDiscount = 0;
    if (appliedCoupon) {
        couponDiscount = (discountedValue * appliedCoupon.discount) / 100;
    }

    const totalPayable = discountedValue - exclusiveDiscount - couponDiscount + (isSampleFree ? 0 : sampleCollectionCharges);

    cartSummaryContainer.innerHTML = `
        <div class="container py-5 py-sm-0">
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                    <p>Cart Value</p>
                    <p><del>₹${cartValue.toFixed(2)}</del> ₹${discountedValue.toFixed(2)}</p>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <p>Sample Collection Charges</p>
                    <p>${isSampleFree ? '<del>₹250.00</del> <strong style="color: #39a694">Free</strong>' : `₹${sampleCollectionCharges.toFixed(2)}`}</p>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <p>Custom Test Discount</p>
                    <p>-₹${exclusiveDiscount.toFixed(2)}</p>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <p>Coupon Discount</p>
                    <p style="color: green;">-${couponDiscount.toFixed(2)}</p>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                    <strong>Amount Payable</strong>
                    <strong>₹${totalPayable.toFixed(2)}</strong>
                </li>
            </ul>

            <!-- Coupon Input Section -->
            <div class="mt-3">
                <input type="text" id="coupon-code" class="form-control" placeholder="Enter Coupon Code" />
                <button id="apply-coupon" class="btn  mt-2 w-100">Apply Coupon</button>
                <p id="coupon-error" class="text-danger mt-1"></p>
            </div>

            <div class="container my-2">
                <button class="text-uppercase proceed-btn text-center toggle-button">Proceed</button>
            </div>
        </div>
    `;

    setupProceedButtonListener();

    return { cartValue, discountedValue, couponDiscount, exclusiveDiscount, totalPayable };
};









  try {
    const response = await fetch(`${baseUrl}/api/v1/cart/get/${userId}`);
    const cartItems = await response.json()
    const items = cartItems.data


    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const detailResponse = await fetch(`${baseUrl}/api/v1/tests/get-test/${item.testId}`);
        const details = await detailResponse.json();
        const testDeatils = details.data

        return { ...item, ...testDeatils };
      })
    );
    

    if (detailedItems.length === 0) {
      container.innerHTML = "Your Cart is Empty"
      return
    }

    const updateCartCount = () => {
      const cartCountDesktop =  document.getElementById("cart-badge-desktop");
      const cartCountMobile = document.getElementById("cart-badge-mobile");
      
      if (cartCountDesktop) {
        cartCountDesktop.textContent = detailedItems.length
      }
    
      if (cartCountMobile) {
        cartCountMobile.textContent = detailedItems.length
      }
    
    };



    container.innerHTML = detailedItems
      .map(
        (item) => `
        <div class="main-cart" data-id="${item.testId}">
          <div class="row">
            <div class="col-lg-1 col-md-2 col-sm-2 col-2 text-start">
               <img class="cart-img" src="images/icon-svg/cart/pr-1.svg" alt="" />
            </div>
            <div class="col-lg-10 col-md-8 col-sm-8 col-8 p-0">
              <h1 class="cart-title">${item.testName}</h1>
              <div class="d-flex">
                <h3 class="cart-value">₹${item.offerPrice}</h3>
                <span class="d-flex">
                  <del class="px-2 cart-real-value">${item.price}</del>
                  <p class="fw-bolder" style="color: #f47779">${item.discountPercentage}% OFF</p>
                </span>
              </div>
            </div>
            <div class="col-lg-1 col-md-2 col-sm-2 col-2 text-end ">
              <span data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.testId}" data-user="${item.userId}">
                <img src="images/icon-svg/cart/remove.svg" class="cart-remove" alt="Remove" />
              </span>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <!-- Patient Dropdown -->
             <div class="dropdown">
              <button class="patient-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                ${item.quantity || 1} Patient${(item.quantity || 1) > 1 ? 's' : ''}
              </button>
              <ul class="dropdown-menu">
                ${[1, 2, 3, 4, 5]
            .map(
              (num) => `
                    <li>
                      <a class="dropdown-item patient-option" href="#" data-patient="${num}" data-id="${item.testId}">
                        <input type="radio" name="patients-${item.testId}" class="form-check-input me-2" ${num === (item.quantity || 1) ? 'checked' : ''
                } />
                        ${num} Patient${num > 1 ? 's' : ''}
                      </a>
                    </li>`
            )
            .join('')}
              </ul>
            </div>
          </div>
          <hr />
          <div class="container d-flex justify-content-evenly">
            <span class="d-flex gap-2">
              <img src="images/icon-svg/product/feest.svg" class="svg-cart" alt="Fasting" />
              ${item.fasting ? `Fasting required: ${item.fastingTime}` : `Fasting not required`}
            </span>
            <span class="d-flex gap-2">
              <img src="images/icon-svg/product/report.svg" class="svg-cart" alt="Report" />
              Report in ${item.reportTime}
            </span>
          </div>
        </div>
      `
      )
      .join('');

    recalculateTotals(detailedItems)

    container.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('[data-bs-toggle="modal"]');
      if (removeBtn) {
        const testId = removeBtn.dataset.id;
        const userId = removeBtn.dataset.user;
        confirmRemoveButton.setAttribute('data-id', testId);
        confirmRemoveButton.setAttribute('data-user', userId);
      }
    });


    // Add click event listener to the "Yes" button in the modal
    confirmRemoveButton.addEventListener('click', async () => {
      const testId = confirmRemoveButton.getAttribute('data-id');
      const userId = confirmRemoveButton.getAttribute('data-user');
    
      const cartItem = document.querySelector(`.main-cart[data-id="${testId}"]`);
      if (cartItem) cartItem.remove();
    
      const updatedItems = detailedItems.filter((item) => item.testId !== testId);
      detailedItems.length = 0;
      detailedItems.push(...updatedItems);
    
      // Ensure coupon discount is preserved when recalculating totals
      recalculateTotals(detailedItems, appliedCoupon);
    
      updateCartCount();
    
      if (detailedItems.length === 0) {
        cartSummaryContainer.innerHTML = "";
        container.innerHTML = "Your Cart is Empty";
      }
    
      try {
        const removeResponse = await fetch(`${baseUrl}/api/v1/cart/remove-item`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, testId }),
        });
    
        if (!removeResponse.ok) {
          console.error('Failed to remove item from server');
        } else {
          console.log(`Item with testId ${testId} removed successfully.`);
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    });
    
    






    let appliedCoupon = null; // Store the applied coupon globally

    container.addEventListener('click', async (event) => {
      const patientOption = event.target.closest('.patient-option');
      if (patientOption) {
        const testId = patientOption.dataset.id;
        const numPatients = parseInt(patientOption.dataset.patient, 10);
        const cartItem = document.querySelector(`.main-cart[data-id="${testId}"]`);
    
        cartItem.setAttribute('data-patients', numPatients);
    
        const dropdownButton = cartItem.querySelector('.patient-btn');
        dropdownButton.textContent = `${numPatients} Patient${numPatients > 1 ? 's' : ''}`;
    
        const dropdownItems = cartItem.querySelectorAll('.patient-option input[type="radio"]');
        dropdownItems.forEach((input) => {
          const patientValue = parseInt(input.closest('.patient-option').dataset.patient, 10);
          input.checked = patientValue === numPatients;
        });
    
        const updatedItem = detailedItems.find((item) => item.testId === testId);
        if (updatedItem) {
          updatedItem.quantity = numPatients;
        }
    
        // Ensure applied coupon is passed
        recalculateTotals(detailedItems, appliedCoupon);
    
        try {
          const response = await fetch(`${baseUrl}/api/v1/cart/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testId, userId, quantity: numPatients }),
          });
    
          if (!response.ok) {
            console.error('Failed to update the patient count on the server.');
          } else {
            console.log(`Patient count for testId ${testId} updated successfully.`);
          }
        } catch (error) {
          console.error('Error updating patient count:', error);
        }
      }
    });
    
    
    // Store the applied coupon when it's applied

    document.addEventListener('click', async (event) => {
      if (event.target.id === 'apply-coupon') {
        const couponCode = document.getElementById('coupon-code').value.trim();
        const couponError = document.getElementById('coupon-error');
    
        if (!couponCode) {
          couponError.textContent = "Please enter a coupon code.";
          return;
        }
        
        try {
          
          const response = await fetch(`${baseUrl}/api/v1/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode }),
          });
    
          const data = await response.json();
    
          if (!response.ok || !data.success) {
            couponError.textContent = "Invalid or expired coupon.";
            return;
          }
    
          appliedCoupon = data.data; // Store the applied coupon
          recalculateTotals(detailedItems, appliedCoupon);
          document.getElementById('coupon-error').textContent = "Coupon applied successfully!";
          document.getElementById('coupon-error').style.color = "green";

        } catch (error) {
          console.error("Error applying coupon:", error);
          couponError.textContent = "Invalid or expired coupon.";
        }
      }
    });
    


    // clicking proceed button
    document.querySelector('.toggle-button').addEventListener('click', (event) => {


      // Navigate to Address section
      document.querySelector('#checkup1').classList.remove('active');
      document.querySelector('#checkup2').classList.add('active');
    });

    // submit order 
    document.querySelector('.btn-nexttoggle').addEventListener('click', async (event) => {
      const button = event.target;
      const spinner = button.querySelector('.spinner-border');
      const errDiv = document.querySelector('.error-msg');
      
      // Show spinner and disable the button
      spinner.classList.remove("d-none");
      button.disabled = true;
      
      // Collect form data
      const name = document.querySelector('#f-name').value.trim();
      const phoneNumber = document.querySelector('#phone-number').value.trim();
      const address = document.querySelector('#message-text').value.trim();
      const pincode = document.querySelector('#pincode').value.trim();
      const addressType = document.querySelector('input[name="options"]:checked').id;
      const validPincode = ['560024', '560045', '560046', '560092', '560094', '560006', '560032', '560080', '560112', '562106'];
    

       // Function to show errors
       const showError = (message) => {
        errDiv.textContent = message;
        spinner.classList.add("d-none");
        button.disabled = false;
      };

      
      // Validation (Synchronous)
      if (!name || !phoneNumber || !address || !pincode) return showError("Please fill all the required fields.");
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) return showError("Please enter a valid 10-digit mobile number.");
      if (!/^\d{6}$/.test(pincode)) return showError("Please enter a valid 6-digit pincode.");
      if (!validPincode.includes(pincode)) return showError("Currently, service is not available in your location.");
    
      const { cartValue, discountedValue, couponDiscount, exclusiveDiscount, totalPayable } = recalculateTotals(detailedItems, appliedCoupon);
      
      // Prepare order data
      const orderData = {
        userId,
        items: detailedItems.map(item => ({
          testId: item.testId,
          quantity: item.quantity,
        })),
        name,
        phoneNumber,
        address,
        pincode,
        addressType,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        cartValue,
        discountedValue,
        couponDiscount,
        exclusiveDiscount,
        totalPayable
      };
    
     
    
      try {
        // Start submitting order request
        const submitOrder = fetch(`${baseUrl}/api/v1/orders/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
    
        // Use Promise.all to handle both spinner visibility and async submit request simultaneously
        const response = await Promise.all([submitOrder]);
    
        if (response[0].ok) {
          container.innerHTML = "Your Cart is Empty";
          cartSummaryContainer.innerHTML = "";
          detailedItems.length = 0;
          
          updateCartCount(); // Update cart count to 0 after submission
    
          document.querySelector('#checkup2').classList.remove('active');
          document.querySelector('#checkup3').classList.add('active');
        } else {
          showError("Order submission failed.");
        }
      } catch (error) {
        console.error('Error submitting order:', error);
        showError('An error occurred while submitting your order. Please try again.');
      } finally {
        spinner.classList.add("d-none");
        button.disabled = false;
      }
    });
    
    
    




  } catch (error) {
    console.error('Error loading test packages:', error);
    container.innerHTML = '<p>Error loading test packages.</p>';
  }

});


