
let allTestData = []

document.addEventListener("DOMContentLoaded", async () => {
    try {
      // Fetch all APIs simultaneously
      const [mainBanner,lessPrice, ads, vitalOrganData, womenAgeData, womenCareData, menAgeData, menCareData, lifeStyleData, specialPackageData, singleTestData, allTestData ] = await Promise.all([
        fetch(`${baseUrl}/api/v1/mainbanners/get`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/lessPrice/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/bottombanners/get`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/organ/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/womenage/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/women/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/menage/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/men/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/category/lifestyle/selected`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/tests/selected/Special Care Packages`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/tests/selected/Single Test`).then((res) => res.json()),
        fetch(`${baseUrl}/api/v1/tests/get`).then((res) => res.json()),
        

      ]);
  
      // Render each section
      renderMainBanners(mainBanner)
      renderLessPrice(lessPrice);
      renderAds(ads);
      renderVitalOrgans(vitalOrganData)
      renderWomenAgeData(womenAgeData);
      renderWomenCareData(womenCareData);
      renderMenAgeData(menAgeData)
      renderMenCare(menCareData)
      renderLifeStyle(lifeStyleData)
      renderSpecialCare(specialPackageData)
      renderSingleTest(singleTestData)
      renderTestList(allTestData)
      
    } catch (error) {
      console.error("Error loading API data:", error);
      // Handle fallback UI
    }
  });

  function renderMainBanners(data) {
   
    const banners = data? data.data : []
    console.log(banners);
    

    banners.forEach((banner, index) => {
      const card = document.createElement('div');
      card.className = 'cardo';

      const box = document.createElement('div');
      box.className = 'box';

      const img = document.createElement('img');
      img.className = 'owlimg';
      img.src =`${baseUrl}/${banner.imageUrl}`
      img.alt =banner.title;

       // Add event listener for navigation
    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${banner.test}&category=${banner.category}`; // Replace 'testUrl' with the actual key containing the test URL
    });


      box.appendChild(img);
      card.appendChild(box);
      carousel.appendChild(card);
    });
  }

  function renderLessPrice(data) {
    const container = document.getElementById("categories-container");
    const categories = data? data.data : []
    
    container.innerHTML = categories.map(category => `
        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
          <a href="checkups.html?tab=${encodeURIComponent(category.name)}">
            <div class="test-cardmain">
              <div class="test-card text-center">
                <img
                  class="test-cardimg"
                  src="${baseUrl}/${category.imagePath}"
                  alt="${category.name}"
                />
                <h4 class="testcard-head">${category.name}</h4>
              </div>
            </div>
          </a>
        </div>
    `).join('');
  }

  function renderAds(data) {
    const container = document.getElementById('carousel-container');
    const banners = data? data.data : []
    
    // Clear previous items to avoid appending multiple times if this is called again
    container.innerHTML = ''; 

    // Add carousel class to the container if not already added
    if (!container.classList.contains('owl-carousel')) {
        container.classList.add('owl-carousel');
    }

    banners.forEach(banner => {
        const imgItem = document.createElement('div');
        imgItem.classList.add('carousel3-imgitem');

        const imgElement = document.createElement('img');
        imgElement.src = `${baseUrl}/${banner.imageUrl}`;
        imgElement.alt = banner.title;

        imgItem.appendChild(imgElement);
        container.appendChild(imgItem);
    });

    // Reinitialize Owl Carousel only if not already initialized
    if (!container.owlCarousel) {
        $(".owl-carousel").owlCarousel({
            margin: 20,
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            nav: false, // Disable built-in navigation buttons
            responsive: {
                0: {
                    items: 1, // 1 item per slide for small screens
                },
                600: {
                    items: 2, // 2 items per slide for medium screens
                },
                1000: {
                    items: 3, // 3 items per slide for large screens
                },
            },
        });
    }
}

function renderVitalOrgans(data) {
  const container = document.getElementById("organ-carousel");
  const categories = data? data.data : []

  // Clear previous content
  container.innerHTML = categories.map(organ => `
    <a href="vital-organ.html?tab=${encodeURIComponent(organ.name)}" class="carousel4-card">
      <img
        src="${baseUrl}/${organ.imagePath}"
        class="carousel4-img"
        alt="${organ.name}"
      />
      <p class="carousel4-title">${organ.name}</p>
    </a>
  `).join('');

  // Add the carousel4 class to the container if it's not already present
  if (!container.classList.contains('carousel4')) {
    container.classList.add('carousel4');
  }

  // Reinitialize Owl Carousel
  $(".carousel4").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      1000: { items: 5 }
    }
  });
}

function renderWomenAgeData(data) {
  const container = document.getElementById("woman-carousel");
  const categories = data? data.data : []

  // Clear previous content
  container.innerHTML = categories.map(item => `
    <a href="woman-care.html?tab=${encodeURIComponent(item.name)}" class="test-cardmain">
      <div class="test-card text-center">
        <img class="test-cardimg" src="${baseUrl}/${item.imagePath}" alt="${item.name}" />
        <h4 class="testcard-head">${item.name}</h4>
      </div>
    </a>
  `).join('');

  // Add the carousel-5 class to the container if it's not already added
  if (!container.classList.contains('carousel-5')) {
    container.classList.add('carousel-5');
  }

  // Initialize Owl Carousel
  $('.carousel-5').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  });

  // Custom navigation
  const prevButton = document.getElementById("womanprev2");
  const nextButton = document.getElementById("womannext2");

  // Ensure buttons exist before adding event listeners
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      $('.carousel-5').trigger('prev.owl.carousel');
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      $('.carousel-5').trigger('next.owl.carousel');
    });
  }
}

function renderWomenCareData(data) {
  const container = document.getElementById("women-care-section");
  const categories = data? data.data : []
  
  container.innerHTML = categories.map(item => `
    <div class="col-lg-3 col-md-3 col-sm-6 col-6">
      <a href="woman-care.html?tab=${encodeURIComponent(item.name)}">
        <div class="test-cardmain">
          <div class="test-card text-center">
            <img
              class="test-cardimg"
              src="${baseUrl}/${item.imagePath}"
              alt="${item.name}"
            />
            <h4 class="testcard-head">${item.name}</h4>
          </div>
        </div>
      </a>
    </div>
  `).join('');
}

function renderMenAgeData(data) {
  const container = document.getElementById("dynamic-carousel");
  const categories = data? data.data : []

  container.innerHTML = categories
    .map(
      (item) => `
        <a href="men-care.html?tab=${encodeURIComponent(item.name)}" class="test-cardmain">
          <div class="test-card text-center">
            <img class="test-cardimg" src="${baseUrl}/${item.imagePath}" alt="${item.name}" />
            <h4 class="testcard-head">${item.name}</h4>
          </div>
        </a>
      `
    )
    .join("");

  // Ensure Owl Carousel is available
  if (typeof $ === "undefined" || typeof $.fn.owlCarousel === "undefined") {
    console.error("Owl Carousel or jQuery is not loaded.");
    return;
  }

  $(".carousel-5").owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 },
    },
  });

  // Attach custom navigation events
  const prevButton = document.getElementById("manprev2");
  const nextButton = document.getElementById("mannext2");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      $(".carousel-5").trigger("prev.owl.carousel");
    });
  } else {
    console.warn("Previous button with ID 'manprev2' not found.");
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      $(".carousel-5").trigger("next.owl.carousel");
    });
  } else {
    console.warn("Next button with ID 'mannext2' not found.");
  }
}


function renderMenCare(data) {
  const container = document.getElementById("card-container");
  const categories = data? data.data : []
  
  container.innerHTML = categories
        .map(
          (item) => `
          <div class="col-lg-3 col-md-3 col-sm-6 col-6">
            <a href="men-care.html?tab=${encodeURIComponent(item.name)}">
              <div class="test-cardmain">
                <div class="test-card text-center">
                  <img class="test-cardimg" src="${baseUrl}/${item.imagePath}" alt="${item.name}" />
                  <h4 class="testcard-head">${item.name}</h4>
                </div>
              </div>
            </a>
          </div>
        `
        )
        .join("");
}

function renderLifeStyle(data) {
  const container = document.querySelector(".carousel-6");
  const categories = data? data.data : []

  container.innerHTML = categories
  .map(
    (item) => `
    <div class="lyf-cardmain">
      <a href="lyfestyle-health-checkup.html?tab=${encodeURIComponent(item.name)}" class="lyf-card text-center">
        <img 
          class="lyf-cardimg" 
          src="${baseUrl}/${item.imagePath || 'placeholder.svg'}" 
          alt="${item.name || 'Unnamed'}" 
        />
        <h4 class="lyf-head">${item.name || 'Unnamed'}</h4>
      </a>
    </div>
  `
  )
  .join("");

// Initialize Owl Carousel
$(".carousel-6").owlCarousel({
  loop: true,
  margin: 10,
  nav: false,
  responsive: {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 3 },
  },
});

// Attach custom navigation events
const prevButton = document.getElementById("lyfprev2");
const nextButton = document.getElementById("lyfnext2");

if (prevButton) {
  prevButton.addEventListener("click", () => {
    $(".carousel-6").trigger("prev.owl.carousel");
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    $(".carousel-6").trigger("next.owl.carousel");
  });
}
 
}

function renderSpecialCare(data) {
  const carousel = document.getElementById('product-carousel');
  const products = data? data.data : []

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'prd-cardo item'; // "item" class is important for OwlCarousel
            card.innerHTML = `
                <div class="product-card">
                    <h5 class="product-title">${product.testName}</h5>
                    <div class="product-content">
                        <div class="odiv">
                            <p class="p-0 m-0">${product.testCount} Tests</p>
                        </div>
                        <div class="d-lg-block d-md-none d-sm-none d-none tdiv" 
                             data-bs-toggle="offcanvas" 
                             data-bs-target="#offcanvasRight1" 
                             aria-controls="offcanvasRight1">know more+ <i class="fa-solid fa-angle-right"></i></div>
                        <div class="tdiv d-lg-none d-md-block d-sm-block d-block" 
                             data-bs-toggle="offcanvas" 
                             data-bs-target="#offcanvasBottom" 
                             aria-controls="offcanvasBottom">know more+ <i class="fa-solid fa-angle-right"></i></div>
                        <div class="thdiv d-flex">
                            <div class="col">
                                <p class="m-0 fw-bold thdiv-p">Exclusive offer</p>
                                <span class="fw-bolder">₹${product.offerPrice}</span>
                                <del class="thdiv-del">₹${product.price}</del>
                            </div>
                        </div>
                        <div class="fdiv">
                            <a href="product.html?id=${product._id}&category=${product.category}" class="book-cta">Book Now</a>
                        </div>
                    </div>
                </div>
            `;
            carousel.appendChild(card);
        });

        // Initialize the carousel
        $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            items: 3, // Number of items visible at once
            responsive: {
                0: { items: 1 }, // 1 item for small screens
                600: { items: 2 }, // 2 items for medium screens
                1000: { items: 3 } // 3 items for large screens
            }
        });
 
}

function renderSingleTest(data) {
  const carousel = document.querySelector(".carousel7");
  carousel.innerHTML = ""; // Clear existing cards
  const cards = data? data.data : []
  

 
 
    carousel.innerHTML = cards.map((test, index) =>  `
    <div class="new-cardo">
      <div class="newcard-main">
        <div class="newcard-titlemain">
          <div class="row">
            <div class="col-lg-8 col-md-8 col-sm-8 col-8">
              <h5 class="newcard-title">${test.testName}</h5>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-4 px-lg-auto px-md-1 px-sm-auto px-auto">
              <div class="d-flex justify-content-end">
                <p class="newcard-test">${test.totalTests} Tests</p>
              </div>
              <div class="d-flex justify-content-end">
                <div class="d-block">
                  <span class="fw-bolder newcard-price">
                    <del>₹${test.price}</del> ₹${test.offerPrice}
                  </span>
                  <br />
                  <div class="newcard-offer">${test.discountPercentage}% OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="newcard-content">
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
              <div class="d-flex">
                <img class="newcard-svg" src="images/icon-svg/newcard/research.png" alt="" />
                <div class="d-block rt-newcard">
                  <h5>Reports with in</h5>
                  <h6>${test.reportTime}</h6>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
              <div class="d-flex">
                <img class="newcard-svg" src="images/icon-svg/newcard/lab.png" alt="" />
                <div class="d-block rt-newcard">
                  <h5>${test.totalTests} Test</h5>
                  <h6>included</h6>
                </div>
              </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-6 pt-4">
            <div
              class="view-newcard d-lg-block d-md-none d-sm-none d-none"
              data-bs-id="${test._id}"
              data-index="${index}"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight1"
              aria-controls="offcanvasRight1"
            >
              View Details
            </div>

          <div
            class="view-newcard d-lg-none d-md-block d-sm-block d-block"
            data-bs-id="${test._id}"
            data-index="${index}"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasBottom"
            aria-controls="offcanvasBottom"
          >
            View Details
          </div>
              
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-6 pt-4">
              <a href="product.html?id=${test._id}&category=${test.category}" class="cart-newcard">Add to Cart</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  document.querySelectorAll(".view-newcard").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.currentTarget.dataset.index;
      const test = cards[index];
      updateOffcanvasContent(test);
      
      
    });
  });
   

  

    


   
     
    
};

function updateOffcanvasContent(test) {
 

  const rightOffcanvas = document.getElementById("offcanvasRight1")
  const bottomOffcanvas = document.getElementById("offcanvasBottom")



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
 <a href="#" class="offcanvasbtn-cart"> Add To Cart</a>
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

 <img class="adfor-product" src="images/banners/banner1.png" alt="" />
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
 <a href="#" class="offcanvasbtn-cart"> Add To Cart</a>
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

 <img class="adfor-product" src="images/banners/banner1.png" alt="" />
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
}

function renderTestList(data) {
  const tests = data.data
  console.log(tests);
  
  const searchInput = document.getElementById('unique-search-input')[0].value.toLowerCase();
  if (!searchInput) {
    // If search input is empty, clear the test list
    displayTestList([]);
    return;
  }
  const filteredTests = tests.filter(test => test.testName.toLowerCase().includes(searchInput));
  displayTestList(filteredTests);
}

function displayTestList (filteredTests) {
  

  const testListContainer = document.getElementById('test-list')[0];
  testListContainer.innerHTML = ''; // Clear previous content

  if (filteredTests.length === 0) {
    testListContainer.innerHTML = 'No tests found';
    return;
  }
  filteredTests.forEach(test => {
    const testElement = document.createElement('div');
    testElement.textContent = test.testName;
    testElement.style.cursor = 'pointer'; // Make it look clickable
    testElement.addEventListener('click', () => navigateToTestPage(test._id));
    testListContainer.appendChild(testElement);
  });
}



function navigateToTestPage(testId) {
  window.location.href = `/test/${testId}`; // Navigate to the test page
}





  
