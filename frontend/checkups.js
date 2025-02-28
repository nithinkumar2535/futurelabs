
document.addEventListener("DOMContentLoaded", async function () {
  const tabList = document.getElementById("tabList");
  const urlParams = new URLSearchParams(window.location.search);
  const activeTabName = urlParams.get("tab") || null;
  const tabContent = document.getElementById("tabContent");
  const rightOffcanvas = document.getElementById("offcanvasRight1")
  const bottomOffcanvas = document.getElementById("offcanvasBottom")

  // Fetch checkups from the backend
  try {

    tabContent.innerHTML = `
        <div style="display: flex; justify-content: center;  height: 100vh; margin-top:100px;">
          <div id="loadingSpinner" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;

    const [testData, banner] = await Promise.all([
      fetch(`${baseUrl}/api/v1/category/lessPrice/get`).then((response) => response.json()),
      fetch(`${baseUrl}/api/v1/bottombanners/get-random`).then((response) => response.json()),

    ])
    renderTestData(testData, banner)

  } catch (error) {
    console.error("Error fetching tabs:", error)
  }

  function renderTestData(data, Banner) {

    const tabs = data ? data.data : [];
    const banner = Banner.data
    tabs.forEach((tab, index) => {
      const isActive = activeTabName ? tab.name === activeTabName : index === 0 ? "active" : "";
      const tabItem = `
      <div class="tab-item ${isActive}" data-name="${tab.name}">
        <img src="${baseUrl}/${tab.imagePath}" alt="${tab.name}" />
        <h4>${tab.name}</h4>
      </div>
      `;

      tabList.insertAdjacentHTML("beforeend", tabItem);


      // Activate the correct tab
      if (activeTabName) {
        document.querySelectorAll(".tab-item").forEach((tabElement) => {
          const tabName = tabElement.getAttribute("data-name");
          if (tabName === activeTabName) {
            tabElement.classList.add("active");
            fetchTabContent(tabName, banner);
          }
        });
      } else if (tabs[0]) {
        fetchTabContent(tabs[0].name, banner);
      }

      // Add click event listeners for each tab
      document.querySelectorAll(".tab-item").forEach((tabElement) => {
        tabElement.addEventListener("click", () => {
          // Remove active class from all tabs
          document.querySelectorAll(".tab-item").forEach((el) => el.classList.remove("active"));
          // Add active class to the clicked tab
          tabElement.classList.add("active");

          // Fetch and render content for the clicked tab
          const tabName = tabElement.getAttribute("data-name");

          // Clear previous content and show loading
          tabContent.innerHTML = ' <div style="display: flex; justify-content: center; height: 100vh; margin-top:100px;"> \
           <div id="loadingSpinner" class="spinner-border text-primary" role="status"> \
             <span class="visually-hidden">Loading...</span> \
           </div> \
         </div>';


          fetchTabContent(tabName, banner);
        });
      });
    })

  }

  // Function to fetch and render tab content
async function fetchTabContent(tabName, banner) {
  const tabContent = document.getElementById("tabContent");
  tabContent.innerHTML = `
      <div style="display: flex; justify-content: center; height: 100vh; margin-top:100px;">
        <div id="loadingSpinner" class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
  `;

  const response = await fetch(`${baseUrl}/api/v1/tests/get/lessPrice/${encodeURIComponent(tabName)}`);
  
  if (!response.ok) {
      console.log("No tests found");
      tabContent.innerHTML = `<div>No tests available</div>`;
      return;
  }

  const Data = await response.json();
  const data = Data ? Data.data : [];

  // Check user authentication
  const authStatus = await checkAuthStatus();
  const userId = authStatus.isAuthenticated ? authStatus.userId : null;
  let cartItems = [];

  // Fetch cart items if user is logged in
  if (userId) {
      try {
          const cartResponse = await fetch(`${baseUrl}/api/v1/cart/get/${userId}`);
          if (cartResponse.ok) {
              const cart = await cartResponse.json();
              cartItems = cart.data;
          }
      } catch (error) {
          console.error("Error fetching cart data:", error);
      }
  }

  // Render test cards
  tabContent.innerHTML = `
      <div class="container-fluid p-2">
          <div class="row">
              ${data.length === 0 ? `<div>No tests available</div>` : data.map((test, index) => {
                  const isInCart = cartItems.some(item => item.testId === test._id);
                  return `
                      <div class="col-lg-4 col-md-6 col-sm-12 mt-lg-3 mt-md-2 mt-sm-2 mt-2">
                          <div class="checkup-cardmain">
                              <div class="d-flex justify-content-between">
                                  <a href="product.html?id=${test._id}&category=${test.category}">
                                      <h2 class="checkup-card-h">${test.testName}</h2>
                                  </a>
                                  <span class="checkup-cardprice text-end">
                                      ₹${test.offerPrice} <br /><del>₹${test.price}</del>
                                  </span>
                              </div>
                              <p class="checkup-card-disc">${test.description}</p>
                              <span class="checkup-cardoff">${test.discountPercentage}% OFF</span>

                               <div
            class="checkup-cardmore d-lg-block d-md-none d-sm-none d-none"
            data-bs-id="${test._id}"
            data-index="${index}"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight1"
            aria-controls="offcanvasRight1"
          >
            know more+ <i class="fa-solid fa-chevron-down"></i>
          </div>

          <div
            class="checkup-cardmore d-lg-none d-md-block d-sm-block d-block"
            data-bs-id="${test._id}"
            data-index="${index}"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasBottom"
            aria-controls="offcanvasBottom"
          >
            know more+ <i class="fa-solid fa-chevron-down"></i>
          </div>

                              <div class="d-flex justify-content-between">
                                  <div class="checkup-cardrta">
                                      Report in <span class="checkup-hours">${test.reportTime}</span>
                                  </div>
                                  <span class="add-check-up" data-bs-id="${test._id}">
                                      ${isInCart ? `
                                          <a href="cart.html?userId=${userId}" class="view-cartbtn">View Cart</a>
                                          <a href="#" class="remove-cart-item"> <i class="fa-solid fa-minus"></i> </a>
                                      ` : `
                                          Add <a href="#" class="checkup-cardadd"> <i class="fa-solid fa-plus"></i> </a>
                                      `}
                                  </span>
                              </div>
                          </div>
                      </div>
                  `;
              }).join("")}
          </div>
      </div>
  `;

  // Attach event listeners ONCE using delegation
  attachEventListeners(userId, data, banner);
}

// Attach event listeners once using delegation
function attachEventListeners(userId, data, banner) {
  document.removeEventListener("click", cartClickHandler);
  document.addEventListener("click", (event) => cartClickHandler(event, userId));

  document.querySelectorAll(".checkup-cardmore").forEach((btn) => {
      btn.removeEventListener("click", offcanvasHandler);
      btn.addEventListener("click", (event) => offcanvasHandler(event, data, banner));
  });
}

// Handles adding/removing items from the cart using event delegation
async function cartClickHandler(event, userId) {
  if (!userId) {
      showLoginSidebar();
      return;
  }

  const addButton = event.target.closest(".checkup-cardadd");
  const removeButton = event.target.closest(".remove-cart-item");

  if (addButton) {
      event.preventDefault();
      const buttonContainer = addButton.closest(".add-check-up");
      const testId = buttonContainer.dataset.bsId;

      if (addButton.dataset.processing === "true") return; // Prevent multiple clicks
      addButton.dataset.processing = "true"; // Mark button as processing

      try {
          const response = await fetch(`${baseUrl}/api/v1/cart/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, testId })
          });

          if (response.ok) {
              updateUI()
              buttonContainer.innerHTML = `
                  <a href="cart.html?userId=${userId}" class="view-cartbtn">View Cart</a>
                  <a href="#" class="remove-cart-item"> <i class="fa-solid fa-minus"></i> </a>
              `;
          }
      } catch (error) {
          console.error("Error adding to cart:", error);
      } finally {
          addButton.dataset.processing = "false"; // Reset flag
      }
  }

  if (removeButton) {
      event.preventDefault();
      const buttonContainer = removeButton.closest(".add-check-up");
      const testId = buttonContainer.dataset.bsId;

      try {
          const response = await fetch(`${baseUrl}/api/v1/cart/remove-item`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, testId })
          });

          if (response.ok) {
            updateUI()
              buttonContainer.innerHTML = `
                  Add <a href="#" class="checkup-cardadd"> <i class="fa-solid fa-plus"></i> </a>
              `;
          }
      } catch (error) {
          console.error("Error removing from cart:", error);
      }
  }
}

// Offcanvas content update handler
function offcanvasHandler(event, data, banner) {
  const index = event.currentTarget.dataset.index;
  const test = data[index];
  updateOffcanvasContent(test, banner);
}

// Show login sidebar if user is not logged in
function showLoginSidebar() {
  document.querySelectorAll('.offcanvas').forEach(offcanvas => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) offcanvasInstance.hide();
  });
  const sidebar = document.getElementById("sidebar");
  const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
  bsCollapse.show();
}


  async function updateOffcanvasContent(test, banner) {




    rightOffcanvas.innerHTML = `
        <div class="offcanvas-header pkgmbl-header">
     <h5 class="offcanvas-title titleof-offcanvas" id="offcanvasRight1Label">
       Package Details
     </h5>
     <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
   </div>
   <div class="offcanvas-body">
     <div class="container">
       <h2 class="offcanvascheckup-card-h">
       ${test.testName}
       </h2>
       <p>Includes ${test.totalTests} ParaMeters</p>
       <a href="#" class="offcanvasbtn-offers">
         <strong>${test.discountPercentage}%off</strong> for a limited period</a>
       <a href="#"  class="offcanvasbtn-cart"  data-id="${test._id}"> 
        <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span> 
        Add To Cart
       </a>
       <div class="offcanvas-homesmpl">
         <img src="images/delivery-doctor.png" alt="" class="offcanvas-homesmplimg" />
         <p class="offcanvas-homesmplp">Home Sample Collecton Available</p>
       </div>
       
       <div class="offcavas-prdmain mt-4 py-3">
         <div class="container">
           <div class="row">
             <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/sample.svg" class="svg-lab" alt="" />
                 <h6 class="types">Sample Type</h6>
                 <span class="smpl-type">${test.sampleType}</span>
               </div>
             </div>

             ${test.fasting ? ` <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Fasting Required</h6>
                 <span class="smpl-type">${test.fastingTime} Hours</span>
               </div>
             </div>` : ` <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Fasting Not Required</h6>
                
               </div>
             </div>`}
            
             <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/report.svg" class="svg-lab" alt="" />
                 <h6 class="types">Report In</h6>
                 <span class="smpl-type">${test.reportTime} Hours</span>
               </div>
             </div>
             <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Tube Type</h6>

                 <span class="smpl-type">${test.tubeType}</span>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="py-3">
         <h2 class="offcanvas-question">What is it for?</h2>
         <p class="offcanvas-answer">
          ${test.description}
         </p>
       </div>

       <div class="d-flex gap-2">
         <svg aria-hidden="true" focusable="false" role="img" fill="none" preserveAspectRatio="xMidYMid meet"
           data-icon="back" viewBox="0 0 22 20" width="22" height="23"
           class="sc-f32db17d-0 sc-c1dcc9aa-0 kzlEmI hhQbhi sc-b9d72297-0 fBJtou">
           <path
             d="M19.0392 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H19.0392C20.1438 19 21.0392 18.1046 21.0392 17V3C21.0392 1.89543 20.1438 1 19.0392 1Z"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
           <path d="M14.3893 7.70223L11.0248 4.98802L7.65039 7.70223V1H14.3893V7.70223Z" stroke="currentColor"
             stroke-linecap="round" stroke-linejoin="round"></path>
         </svg>
         <h5 class="pkg">Package Instructions</h5>
       </div>
       <ul class="age-ul">
         <li><strong>Age Group:</strong> ${test.instruction}</li>
       </ul>

       <img class="adfor-product" src="${baseUrl}/${banner.imageUrl}" alt="" />
     </div>
     <div class="container my-4" style="height: auto">
       <h2 class="included-h">Included Tests</h2>
       <!-- Dropdown -->
         ${test.includedTests.map((test, index) => `
       <div>
         <div class="dropdown-header" data-bs-toggle="collapse" data-bs-target="#dropdownContent${index}" id="dropdown${index}">
           <div class="d-flex align-items-center">
             <img class="drptst-icon" src="images/icon-svg/dropdown/liver (1).png" alt="Icon" />
             <h5>${test.category}</h5>
           </div>
           <i class="fa-solid fa-chevron-down drp-dwnicon" id="icon${index}"></i>
         </div>
         <ul id="dropdownContent${index}" class="collapse dropdown-content dropdown-ul">
           ${test.tests.map(item => `<li>${item}</li>`).join('')}
         </ul>
       </div>
        `).join('')}
       </div>
     </div>
      </div>`

    bottomOffcanvas.innerHTML = `
        <div class="offcanvas-header pkgmbl-header">
     <h5 class="offcanvas-title titleof-offcanvas" id="offcanvasBottomLabel">
       Package Details
     </h5>
     <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
   </div>
   <div class="offcanvas-body">
     <div class="container">
       <h2 class="offcanvascheckup-card-h">
         ${test.testName}
       </h2>
       <p>Includes  ${test.totalTests} ParaMeters</p>
       <a href="#" class="offcanvasbtn-offers">
         <strong>${test.discountPercentage}%off</strong> for a limited period</a>
       <a href="#"  class="offcanvasbtn-cart"  data-id="${test._id}"> 
        <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span> 
        Add To Cart
       </a>
       <div class="offcanvas-homesmpl">
         <img src="images/delivery-doctor.png" alt="" class="offcanvas-homesmplimg" />
         <p class="offcanvas-homesmplp">Home Sample Collecton Available</p>
       </div>
     

       <div class="offcavas-prdmain mt-4 py-3">
         <div class="container">
           <div class="row">
             <div class="col-lg-4 col-md-4 col-sm-6 col-6 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/sample.svg" class="svg-lab" alt="" />
                 <h6 class="types">Sample Type</h6>
                 <span class="smpl-type">${test.sampleType}</span>
               </div>
             </div>

             ${test.fasting ? ` <div class="col-lg-4 col-md-4 col-sm-6 col-6 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Fasting Required</h6>
                 <span class="smpl-type">${test.fastingTime} Hours</span>
               </div>
             </div>` : ` <div class="col-lg-4 col-md-4 col-sm-6 col-6 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Fasting Not Required</h6>
                 
               </div>
             </div>`}
            
             <div class="col-lg-4 col-md-4 col-sm-6 col-6 mt-lg-0 mt-md-0 mt-sm-2 mt-2 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/report.svg" class="svg-lab" alt="" />
                 <h6 class="types">Report In</h6>
                 <span class="smpl-type">${test.reportTime} Hours</span>
               </div>
             </div>
             <div class="col-lg-12 col-md-12 col-sm-6 col-6 mt-2 p-0">
               <div class="text-center align-content-center">
                 <img src="images/icon-svg/product/feest.svg" class="svg-lab" alt="" />
                 <h6 class="types">Tube Type</h6>

                 <span class="smpl-type">${test.tubeType}</span>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div class="py-3">
         <h2 class="offcanvas-question">What is it for?</h2>
         <p class="offcanvas-answer">
           ${test.description}
         </p>
       </div>

       <div class="d-flex gap-2">
         <svg aria-hidden="true" focusable="false" role="img" fill="none" preserveAspectRatio="xMidYMid meet"
           data-icon="back" viewBox="0 0 22 20" width="22" height="23"
           class="sc-f32db17d-0 sc-c1dcc9aa-0 kzlEmI hhQbhi sc-b9d72297-0 fBJtou">
           <path
             d="M19.0392 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H19.0392C20.1438 19 21.0392 18.1046 21.0392 17V3C21.0392 1.89543 20.1438 1 19.0392 1Z"
             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
           <path d="M14.3893 7.70223L11.0248 4.98802L7.65039 7.70223V1H14.3893V7.70223Z" stroke="currentColor"
             stroke-linecap="round" stroke-linejoin="round"></path>
         </svg>
         <h5 class="pkg">Package Instructions</h5>
       </div>
       <ul class="age-ul">
         <li><strong>Age Group:</strong> ${test.instruction}</li>
       </ul>

       <img class="adfor-product" src="${baseUrl}/${banner.imageUrl}" alt="" />
     </div>
     <div class="container my-4" style="height: auto">
       <h2 class="included-h">Included Tests</h2>
       <!-- Dropdown -->
        ${test.includedTests.map((test, index) => `
       <div>
         <div class="dropdown-header" data-bs-toggle="collapse" data-bs-target="#dropdownContent${index}" id="dropdown${index}">
           <div class="d-flex align-items-center">
             <img class="drptst-icon" src="images/icon-svg/dropdown/liver (1).png" alt="Icon" />
             <h5>${test.category}</h5>
           </div>
           <i class="fa-solid fa-chevron-down drp-dwnicon"id="icon${index}"></i>
         </div>
         <ul id="dropdownContent${index}" class="collapse dropdown-content dropdown-ul">
           ${test.tests.map(item => `<li>${item}</li>`).join('')}
         </ul>
       </div>
         `).join('')}
       </div>
     </div>
      </div>`

    document.querySelectorAll(".offcanvasbtn-cart").forEach(button => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();

        const authStatus = await checkAuthStatus();

        if (!authStatus.isAuthenticated) {
          // Close the current offcanvas (Right or Bottom)
          const offcanvasElements = document.querySelectorAll('.offcanvas');
          offcanvasElements.forEach(offcanvas => {
            const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
            if (offcanvasInstance) {
              offcanvasInstance.hide();
            }
          });

          // Open the login sidebar
          const sidebar = document.getElementById("sidebar");
          const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
          bsCollapse.show();
          return;
        }

        // User is authenticated; proceed with adding to cart
        const userId = authStatus.userId;
        const testId = event.target.dataset.id;

        const testItem = {
          userId,
          testId,
        };
        

        const button = event.target;
        const spinner = button.querySelector(".spinner-border");
        button.disabled = true;
        spinner.classList.remove("d-none");  // Show spinner

        try {
          const response = await fetch(`${baseUrl}/api/v1/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(testItem)
          });

          if (response.ok) {
            window.location.href = `cart.html?userId=${userId}`;
          } else {
            const error = await response.json();
            console.error("Failed to add item to cart:", error);
          }
        } catch (error) {
          console.error("Error connecting to backend:", error);
        } finally {
          // Remove spinner and re-enable the button
          button.disabled = false;
          spinner.classList.add("d-none"); // Hide spinner
        }
      });
    });


  }



});








