
let allTestData = []

document.addEventListener("DOMContentLoaded", async () => {
  
  try {
    // Fetch all APIs simultaneously
    const [mainBanner, lessPrice, ads, vitalOrganData, womenAgeData, womenCareData, menAgeData, menCareData, lifeStyleData, specialPackageData, singleTestData,] = await Promise.all([
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
    renderSpecialCare(specialPackageData, ads)
    renderSingleTest(singleTestData, ads)


  } catch (error) {
    console.error("Error loading API data:", error);
    // Handle fallback UI
  }
});

function renderMainBanners(data) {

  const banners = data ? data.data : []
  


  banners.forEach((banner, index) => {
    const card = document.createElement('div');
    card.className = 'cardo';

    const box = document.createElement('div');
    box.className = 'box';

    const img = document.createElement('img');
    img.className = 'owlimg';
    img.src = `${baseUrl}/${banner.imageUrl}`
    img.alt = banner.title;
    img.loading = 'lazy';

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
  const categories = data ? data.data : []

  container.innerHTML = categories.map(category => `
        <div class="col-lg-4 col-md-4 col-sm-6 col-6 mt-lg-4 mt-md-3 mt-sm-2 mt-2">
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
  const banners = data ? data.data : []

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
      nav: false,
      dots: true, 
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
  const container = document.querySelector(".organ-carousel");
  const categories = data?.data || [];

  // Clear previous content and build a single `.carousel4` container
  container.innerHTML = `
    <div class="carousel4 owl-carousel owl-theme">
      ${categories
        .map(
          (organ) => `
        <a href="vital-organ.html?tab=${encodeURIComponent(organ.name)}" class="carousel4-card">
          <img
            src="${baseUrl}/${organ.imagePath}"
            class="carousel4-img"
            alt="${organ.name}"
          />
          <p class="carousel4-title">${organ.name}</p>
        </a>
      `
        )
        .join('')}
    </div>
  `;

  // Reinitialize Owl Carousel
  $(".carousel4").owlCarousel({
    loop: true,
    margin: 10,
    nav: false, // Removed controls
    dots: false, // Removed dots
    autoplay: true,
    responsive: {
      0: { items: 3 },
      600: { items: 5 },
      1000: { items: 6 },
    },
  });
}


function renderWomenAgeData(data) {
  const container = document.querySelector(".women-carousel");
  const categories = data?.data || [];

  // Clear previous content and build a single `.carousel-5` container
  container.innerHTML = `
    <div class="carousel-5 owl-carousel" id="woman-carousel">
      ${categories
        .map(
          (item) => `
        <a href="woman-care.html?tab=${encodeURIComponent(item.name)}" class="test-cardmain">
          <div class="test-card text-center">
            <img class="test-cardimg" src="${baseUrl}/${item.imagePath}" alt="${item.name}" />
            <h4 class="testcard-head">${item.name}</h4>
          </div>
        </a>
      `
        )
        .join('')}
    </div>
    <div class="womancustom-nav">
      <button id="womanprev2" class="wmnnav-btn" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button id="womannext2" class="wmnnav-btn" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;

  // Initialize Owl Carousel
  const owl = $('.carousel-5').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    autoplay: true,
    responsive: {
      0: { items: 2 },
      600: { items: 4 },
      1000: { items: 4 },
    },
  });

  // Custom navigation
  const prevButton = document.getElementById("womanprev2");
  const nextButton = document.getElementById("womannext2");

  // Ensure buttons exist before adding event listeners
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      owl.trigger("prev.owl.carousel");
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      owl.trigger("next.owl.carousel");
    });
  }
}



function renderWomenCareData(data) {
  const container = document.getElementById("women-care-section");
  const categories = data ? data.data : []

  container.innerHTML = categories.map(item => `
    <div class="col-lg-3 col-md-3 col-sm-6 col-6 my-lg-4 my-md-3 my-sm-1 my-1">
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
  const container = document.querySelector(".dynamic-carousel");
  const categories = data ? data.data : [];

  // Clear previous content and build a single `.carousel-5` container
  container.innerHTML = `
    <div class="carousel-5 owl-carousel" id="man-carousel">
      ${categories
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
        .join('')}
    </div>
    <div class="womancustom-nav">
      <button id="manprev2" class="wmnnav-btn" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button id="mannext2" class="wmnnav-btn" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;

  // Initialize Owl Carousel
  const owl = $(".carousel-5").owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    autoplay: true,
    responsive: {
      0: { items: 2 },
      600: { items: 4 },
      1000: { items: 4 },
    },
  });

  // Custom navigation logic
  const prevButton = document.getElementById("manprev2");
  const nextButton = document.getElementById("mannext2");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      owl.trigger("prev.owl.carousel");
    });
  } else {
    console.warn("Previous button with ID 'manprev2' not found.");
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      owl.trigger("next.owl.carousel");
    });
  } else {
    console.warn("Next button with ID 'mannext2' not found.");
  }
}



function renderMenCare(data) {
  const container = document.getElementById("card-container");
  const categories = data ? data.data : []

  container.innerHTML = categories
    .map(
      (item) => `
          <div class="col-lg-3 col-md-3 col-sm-6 col-6 my-lg-4 my-md-3 my-sm-1 my-1">
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
  const container = document.querySelector(".life-carousel");
  const categories = data ? data.data : [];

  // Accumulate the content to avoid overwriting innerHTML in the loop
  let carouselContent = categories
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
    .join(""); // Join all items together

  // Set the accumulated content into the container
  container.innerHTML = `
    <div class="carousel-6 owl-carousel">
      ${carouselContent}
    </div>
    <div class="lyfcustom-nav">
      <button id="lyfprev2" class="lyfnav-btn" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button id="lyfnext2" class="lyfnav-btn" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;

  // Initialize OwlCarousel after content is added
  const owl = $(".carousel-6").owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    autoplay: true,
    responsive: {
      0: { items: 2 },
      600: { items: 4 },
      1000: { items: 6 },
    },
  });

  // Attach custom navigation events to the buttons
  const prevButton = document.getElementById("lyfprev2");
  const nextButton = document.getElementById("lyfnext2");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      owl.trigger("prev.owl.carousel");
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      owl.trigger("next.owl.carousel");
    });
  }
}


function renderSpecialCare(data, bannerData) {
  const carousel = document.querySelector(".special-carousel");
  const products = data?.data || [];
  const banner = bannerData.data[0];
  

  // Build carousel items
  let carouselContent = `
    <div class="owl-carousel-2 owl-carousel owl-theme">
  `;

  products.forEach((product, index) => {
    carouselContent += `
      <div class="prd-cardo item"> 
          <div class="product-card">
              <h5 class="product-title">${product.testName}</h5>
              <div class="product-content">
                  <div class="odiv">
                      <p class="p-0 m-0">${product.totalTests || "0"} Tests</p>
                  </div>
                  <div class="d-lg-block d-md-none d-sm-none d-none tdiv view-card" 
                    data-bs-id="${product._id}"
                    data-index="${index}"
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasRight1" 
                    aria-controls="offcanvasRight1">know more+ <i class="fa-solid fa-angle-right"></i>
                  </div>
                  <div class="tdiv d-lg-none d-md-block d-sm-block d-block view-card" 
                    data-bs-id="${product._id}"
                    data-index="${index}"
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasBottom" 
                    aria-controls="offcanvasBottom">know more+ <i class="fa-solid fa-angle-right"></i>
                  </div>
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
      </div>
    `;
  });

  carouselContent += `
    </div>
    <div class="prdcustom-nav">
      <button id="prev2" class="prdnav-btn" aria-label="Previous slide">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button id="next2" class="prdnav-btn" aria-label="Next slide">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;

  // Set the carousel content
  carousel.innerHTML = carouselContent;

  // Initialize OwlCarousel
  const owl2 = $(".owl-carousel-2").owlCarousel({
    margin: 20,
    loop: true,
    nav: false,
    autoplay: true,
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      1000: { items: 3 },
    },
  });

  // Custom Navigation for OwlCarousel

  $("#next2").click(() => owl2.trigger("next.owl.carousel"));
  $("#prev2").click(() => owl2.trigger("prev.owl.carousel"));

  // Mouse hover opacity logic for carousel items
  $(".prd-cardo").hover(
    function () {
      $(".prd-cardo").css("opacity", "0.3");
      $(this).css("opacity", "1");
    },
    function () {
      $(".prd-cardo").css("opacity", "1");
    }
  );

  document.querySelectorAll(".view-card").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.currentTarget.dataset.index;
      const test = products[index];
      updateOffcanvasContent(test, banner);


    });
  });
}


  function renderSingleTest(data, Banner) {
    const carousel = document.querySelector(".singleTest-carousel");
    carousel.innerHTML = ""; // Clear existing cards
  
    const cards = data && data.data ? data.data : [];
    const banner = Banner && Banner.data && Banner.data[1] ? Banner.data[1] : null;
  
    // Build carousel items
    let carouselContent = `
      <div class="carousel7 owl-carousel owl-theme">
    `;
    carouselContent += cards
      .map((test, index) => `
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
                    <img class="newcard-svg" src="images/icon-svg/newcard/lab.png" alt="Lab Icon" />
                    <div class="d-block rt-newcard">
                      <h5>${test.totalTests} Tests</h5>
                      <h6>Included</h6>
                    </div>
                  </div>
                  
                </div>
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                  <div class="d-flex">
                    <img class="newcard-svg" src="images/icon-svg/newcard/research.png" alt="Research Icon" />
                    <div class="d-block rt-newcard">
                      <h5>Reports within</h5>
                      <h6>${test.reportTime}</h6>
                    </div>
                  </div>
                </div>
             
                <div class="col-lg-6 col-md-6 col-sm-6 col-6 pt-4">
                  <a href="product.html?id=${test._id || ''}&category=${test.category || ''}" class="cart-newcard">Add to Cart</a>
                </div>
                   <div class="col-lg-6 col-md-6 col-sm-6 col-6 pt-4">
                  <div
                    class="view-newcard d-lg-block d-md-none d-sm-none d-none"
                    data-bs-id="${test._id || ''}"
                    data-index="${index}"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight1"
                    aria-controls="offcanvasRight1"
                  >
                    View Details
                  </div>
                  <div
                    class="view-newcard d-lg-none d-md-block d-sm-block d-block"
                    data-bs-id="${test._id || ''}"
                    data-index="${index}"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasBottom"
                    aria-controls="offcanvasBottom"
                  >
                    View Details
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `)
      .join(""); // Join all items together
  
    carouselContent += `</div>
      <div class="newcardcustom-nav">
        <button id="newcardprev2" class="newcardnav-btn" aria-label="Previous slide">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button id="newcardnext2" class="newcardnav-btn" aria-label="Next slide">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>`;
  
    // Set the accumulated content into the container
    carousel.innerHTML = carouselContent;
  
    // Destroy and reinitialize OwlCarousel after content is added
    $(".carousel7").trigger("destroy.owl.carousel"); // Destroy existing instance (if any)
    $(".carousel7").owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      nav: false, // Don't use Owl's built-in navigation
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
      },
    });
  
    // Attach custom navigation events to the buttons
    const prevButton = document.getElementById("newcardprev2");
    const nextButton = document.getElementById("newcardnext2");
  
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        $(".carousel7").trigger("prev.owl.carousel");
      });
    }
  
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        $(".carousel7").trigger("next.owl.carousel");
      });
    }
  
    // Mouse hover opacity logic
    $(".carousel7")
      .on("mouseenter", ".new-cardo", function () {
        $(".new-cardo").css("opacity", "0.3");
        $(this).css("opacity", "1");
      })
      .on("mouseleave", ".new-cardo", function () {
        $(".new-cardo").css("opacity", "1");
      });
  
    // Bind click events for "View Details"
    document.querySelectorAll(".view-newcard").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const index = event.currentTarget.dataset.index;
        const test = cards[index];
        if (typeof updateOffcanvasContent === "function") {
          updateOffcanvasContent(test, banner);
        } else {
          console.error("updateOffcanvasContent function is not defined.");
        }
      });
    });
  }
  


function updateOffcanvasContent(test, banner) {


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












