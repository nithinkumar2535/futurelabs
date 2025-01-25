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


  const recalculateTotals = (detailedItems) => {
    console.log(detailedItems);

    const sampleCollectionCharges = 250; // Static value
    const isSampleFree = true; // Modify based on logic

    // Apply 10% discount for exclusive package category
    const exclusiveDiscount = detailedItems.reduce((total, item) => {
      if (item.category === 'Exclusive') { // Check if item belongs to exclusive category
        return total + (item.offerPrice * item.quantity * 0.1); // 10% discount
      }
      return total;
    }, 0);

    const cartValue = detailedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountedValue = detailedItems.reduce((total, item) => total + item.offerPrice * item.quantity, 0);
    const totalPayable = discountedValue - exclusiveDiscount + (isSampleFree ? 0 : sampleCollectionCharges);

    // Update the DOM for the cart summary
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
                <p>Custom Test Discount<br><em style="font-size: smaller;"> Get <strong style="color: #39a694">(10%)</strong> off on Exclusive Packages – delivering value every day!</em></p>
                <p>-₹${exclusiveDiscount.toFixed(2)}</p>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <strong>Amount Payable</strong>
                <strong>₹${totalPayable.toFixed(2)}</strong>
              </li>
            </ul>
             <div class="container my-2 p-md-0 p-sm-0 p-0">
                        <button
                          class="text-uppercase proceed-btn text-center toggle-button"
                        >
                          Proceed
                        </button>
                      </div>
          </div>
      `;

    setupProceedButtonListener();

    return totalPayable;
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
    console.log(detailedItems);

    if (detailedItems.length === 0) {
      container.innerHTML = "Your Cart is Empty"
      return
    }



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

      // Remove the item from the DOM
      const cartItem = document.querySelector(`.main-cart[data-id="${testId}"]`);
      if (cartItem) cartItem.remove();

      // Update the `detailedItems` array
      const updatedItems = detailedItems.filter((item) => item.testId !== testId);
      detailedItems.length = 0; // Clear the array
      detailedItems.push(...updatedItems); // Update it with the filtered items

      // Recalculate totals
      recalculateTotals(detailedItems);

      if (detailedItems.length === 0) {
        cartSummaryContainer.innerHTML = ""
        container.innerHTML = "Your Cart is Empty"
      }

      // Make an API call to update the backend
      try {
        const removeResponse = await fetch(`${baseUrl}/api/v1/cart/remove-item`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
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






    container.addEventListener('click', async (event) => {
      const patientOption = event.target.closest('.patient-option');
      if (patientOption) {
        const testId = patientOption.dataset.id;
        const numPatients = parseInt(patientOption.dataset.patient, 10);
        const cartItem = document.querySelector(`.main-cart[data-id="${testId}"]`);

        // Update the cart item with the new patient count
        cartItem.setAttribute('data-patients', numPatients);

        // Update the dropdown button text
        const dropdownButton = cartItem.querySelector('.patient-btn');
        dropdownButton.textContent = `${numPatients} Patient${numPatients > 1 ? 's' : ''}`;

        // Update the checked state in the dropdown
        const dropdownItems = cartItem.querySelectorAll('.patient-option input[type="radio"]');
        dropdownItems.forEach((input) => {
          const patientValue = parseInt(input.closest('.patient-option').dataset.patient, 10);
          input.checked = patientValue === numPatients; // Check the matching option
        });

        // Find the corresponding item in `detailedItems` and update the quantity
        const updatedItem = detailedItems.find((item) => item.testId === testId);
        if (updatedItem) {
          updatedItem.quantity = numPatients;
        }

        // Recalculate totals
        recalculateTotals(detailedItems);

        // Save the update to the database
        try {
          const response = await fetch(`${baseUrl}/api/v1/cart/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
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



    document.querySelector('.toggle-button').addEventListener('click', (event) => {


      // Navigate to Address section
      document.querySelector('#checkup1').classList.remove('active');
      document.querySelector('#checkup2').classList.add('active');
    });



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
      const totalAmount = recalculateTotals(detailedItems);
      const validPincode = ['671531', '671314'];
    
      // Validation
      const showError = (message) => {
        errDiv.textContent = message;
        spinner.classList.add("d-none");
        button.disabled = false;
      };
    
      if (!name || !phoneNumber || !address || !pincode) return showError("Please fill all the required fields.");
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) return showError("Please enter a valid 10-digit mobile number.");
      if (!/^\d{6}$/.test(pincode)) return showError("Please enter a valid 6-digit pincode.");
      if (!validPincode.includes(pincode)) return showError("Currently, service is not available in your location.");
    
      // Prepare order data
      const orderData = {
        userId,
        items: detailedItems.map(item => ({
          testId: item.testId,
          quantity: item.quantity,
        })),
        totalAmount,
        name,
        phoneNumber,
        address,
        pincode,
        addressType,
      };
    
      try {
        const response = await fetch(`${baseUrl}/api/v1/orders/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
    
        if (response.ok) {
          container.innerHTML = "Your Cart is Empty";
          cartSummaryContainer.innerHTML = "";
          detailedItems.length = 0;
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


