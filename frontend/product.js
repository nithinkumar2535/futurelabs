

document.addEventListener("DOMContentLoaded", async () => {

  // Get the product ID from the URL
  const params = new URLSearchParams(window.location.search);
  const testId = params.get('id');
  const category = params.get('category')

  if (testId) {

    try {
      const [testDataResponse, similarTestDataResponse] = await Promise.all([
        fetch(`${baseUrl}/api/v1/tests/get-test/${testId}`).then((response) => response.json()),
        fetch(`${baseUrl}/api/v1/tests/similar/${category}`).then((response) => response.json()),

      ])

      const testData = testDataResponse.data
      
      
      const similarTestData = similarTestDataResponse.data

      const filteredSimilarTests = similarTestData?.filter(
        (test) => test._id !== testData._id
      );

      renderTestData(testData),
      renderSimilarTests(filteredSimilarTests)
    } catch (error) {
      console.error("Error loading API data:", error);
    }

    function renderTestData(data) {

      
      const allTests = data.includedTests.flatMap(testGroup => testGroup.tests);
      const threeTests = allTests.slice(0, 3);

      const container = document.getElementById("test-card")
      const rightOffcanvas = document.getElementById("newOffcanvasRight")
      const bottomOffcanvas = document.getElementById("newOffcanvasBottom")
      const overview = document.getElementById("overview-note")
      const risk = document.getElementById("risk-note")

      container.innerHTML = ` <div class="main-products">
              <h5 class="popular">Popular choice</h5>
              <div class="container">
                <span class="d-flex">
                  <svg aria-hidden="true" focusable="false" role="img" fill="none" preserveAspectRatio="xMidYMid meet"
                    data-icon="back" viewBox="0 0 22 20" width="25" height="29"
                    class="sc-f32db17d-0 sc-c1dcc9aa-0 kzlEmI hhQbhi sc-b9d72297-0 fBJtou">
                    <path
                      d="M19.0392 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H19.0392C20.1438 19 21.0392 18.1046 21.0392 17V3C21.0392 1.89543 20.1438 1 19.0392 1Z"
                      stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M14.3893 7.70223L11.0248 4.98802L7.65039 7.70223V1H14.3893V7.70223Z" stroke="currentColor"
                      stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <h2 class="ps-2 checkup-name">${data.testName}</h2>
                </span>
                <p class="chechup-disc">
                  ${threeTests}
                  <span class="toggle-span d-none d-lg-inline-block ms-2" data-bs-toggle="offcanvas"
                    data-bs-target="#newOffcanvasRight" aria-controls="newOffcanvasRight">
                            ${(data.totalTests)}  Tests <i class="fa-solid fa-angle-right"></i>
                  </span>
  
                  <span class="toggle-span d-inline-block d-md-none" data-bs-toggle="offcanvas"
                    data-bs-target="#newOffcanvasBottom" aria-controls="newOffcanvasBottom">
                    Test +  ${(data.totalTests) - 3} Tests <i class="fa-solid fa-angle-right"></i>
                  </span>
  
  
  
  
  
  
                </p>
                <span class="d-flex py-lg-2 py-md-0 py-sm-0 py-0">
                  <h3 class="value">₹${data.offerPrice}</h3>
                  <del class="px-2 real-value   py-lg-2 py-md-0 py-sm-0">₹${data.price}</del>
                  <p class="fw-bolder  py-lg-2 py-md-0 py-sm-0" style="color: #f47779">${data.discountPercentage}% OFF</p>
                </span>
              </div>
  
              <hr />
              <div class="container">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12 col-12  ">
                    <div class="d-flex text-center dddyy">
                      <p>
                        <i class="fa-solid fa-user-shield pe-2"></i>100% Safe And Hygienic
                      </p>
                      <!--  <p class="avlb-time ps-2">25-11-2024, 6:30:00 AM</p> -->
                    </div>
  
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 col-12 ">
                    <div class="d-flex text-center dddyy">
                      <p>
                        <i class="fa-regular fa-rectangle-list"></i> Reports in ${data.reportTime} Hrs
                      </p>
                    </div>
  
                  </div>
                  <div class="col-lg-2 col-md-2 col-sm-12 col-12 p-0 ">
                    <a href="#" class="productbook-cta">Book Now</a>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="main-products-2 mt-4 py-3">
              <div class="container d-lg-block d-md-block d-sm-none d-none">
                <div class="row">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center">
                      <img src="images/icon-svg/product/sample.svg" class="svg-lab" alt="" />
                      <h6 class="types">Sample Type</h6>
                      <span class="smpl-type">${data.sampleType}</span>
                    </div>
                  </div>

                  ${data.fasting ? `<div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center"> <img src="images/icon-svg/product/feest.svg"
                        class="svg-lab" alt="" />
                      <h6 class="types">Fasting Required</h6>
                      <span class="smpl-type">${data.fastingTime} Hours</span>
                    </div>
                  </div>` : `<div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center"> <img src="images/icon-svg/product/feest.svg"
                        class="svg-lab" alt="" />
                      <h6 class="types">Fasting Not Required</h6>
                    </div>
                  </div>`}
                  

                  <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center">
                      <img src="images/icon-svg/product/new-1.svg" class="svg-lab" alt="" />
                      <h6 class="types">Tube Type</h6>
  
                      <span class="smpl-type">${data.tubeType}</span>
                    </div>
  
                  </div>
                </div>
              </div>
  
              <div class="container  d-lg-none d-md-none d-sm-block d-block">
                <div class="row">
                  <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center">
                      <img src="images/icon-svg/product/sample.svg" class="svg-lab" alt="" />
                      <h6 class="types">Sample Type</h6>
                      <span class="smpl-type">${data.sampleType}</span>
                    </div>
  
  
  
                  </div>
                  ${data.fasting ? ` <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center"> <img src="images/icon-svg/product/feest.svg"
                        class="svg-lab" alt="" />
                      <h6 class="types">Fasting Required</h6>
                      <span class="smpl-type"> ${data.fastingTime}<br> Hours</span>
                    </div>
                  </div>` : ` <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center"> <img src="images/icon-svg/product/feest.svg"
                        class="svg-lab" alt="" />
                      <h6 class="types">Fasting Not Required</h6>
                     
                    </div>
                  </div>`}
                 
                  <div class="col-lg-4 col-md-4 col-sm-4 col-4 p-0">
                    <div class="text-center align-content-center">
                      <img src="images/icon-svg/product/new-1.svg" class="svg-lab" alt="" />
                      <h6 class="types">Tube Type</h6>
  
                      <span class="smpl-type">${data.tubeType}</span>
                    </div>
  
                  </div>
                </div>
              </div>
            </div>
            <div class="main-products-3 mt-4">
              <div class="container">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                    <span class="d-flex gap-2">
                      <svg aria-hidden="true" focusable="false" role="img" fill="none" preserveAspectRatio="xMidYMid meet"
                        data-icon="back" viewBox="0 0 22 20" width="22" height="23"
                        class="sc-f32db17d-0 sc-c1dcc9aa-0 kzlEmI hhQbhi sc-b9d72297-0 fBJtou">
                        <path
                          d="M19.0392 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19H19.0392C20.1438 19 21.0392 18.1046 21.0392 17V3C21.0392 1.89543 20.1438 1 19.0392 1Z"
                          stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M14.3893 7.70223L11.0248 4.98802L7.65039 7.70223V1H14.3893V7.70223Z"
                          stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <h5 class="pkg ">Package Includes</h5>
                    </span>
  
                    <ul class="px-5 li-pkg">
                      <li>${allTests[0]}</li>
                      ${allTests.length >= 2 ? ` <li>${allTests[1]}</li>
                      <li>${allTests[2]}</li>` : ""}
                     
                      </span>
                      <span id="toggleMenu" class="toggle-span fw-bolder d-lg-block d-md-none d-sm-none d-none"
                        data-bs-toggle="offcanvas" data-bs-target="#newOffcanvasRight" aria-controls="newOffcanvasRight">
                        Show More <i class="fa-solid fa-angle-down ps-1"></i>
                      </span>
                      <span id="toggleMenu" class="toggle-span fw-bolder d-lg-none d-md-block d-sm-block d-block"
                        data-bs-toggle="offcanvas" data-bs-target="#newOffcanvasBottom"
                        aria-controls="newOffcanvasBottom">
                        Show More <i class="fa-solid fa-angle-down ps-1"></i>
                      </span>
                    </ul>
  
                    <span class="d-flex gap-2">
                      <svg aria-hidden="true" focusable="false" role="img" fill="none" preserveAspectRatio="xMidYMid meet"
                        data-icon="Description" viewBox="0 0 24 24" width="24" height="22"
                        class="sc-f32db17d-0 sc-c1dcc9aa-0 cjEpGv hhQbhi sc-37bb273b-0 cGIcII">
                        <path
                          d="M3.93882 0.821316H20.0292C20.3147 0.819873 20.5976 0.876865 20.8618 0.989017C21.1259 1.10117 21.3661 1.26627 21.5685 1.47484C21.7708 1.68341 21.9314 1.93133 22.041 2.20436C22.1506 2.4774 22.207 2.77016 22.207 3.06584V20.9564C22.207 21.5371 21.9842 22.0941 21.5877 22.5048C21.1912 22.9154 20.6534 23.1461 20.0926 23.1461H3.93882C3.37806 23.1461 2.84026 22.9154 2.44374 22.5048C2.04722 22.0941 1.82446 21.5371 1.82446 20.9564V3.04394C1.82025 2.75362 1.87184 2.46534 1.97621 2.19586C2.08058 1.92638 2.23566 1.68109 2.43241 1.47426C2.62917 1.26743 2.86368 1.10318 3.1223 0.991088C3.38091 0.878993 3.65847 0.821283 3.93882 0.821316V0.821316Z"
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M10.2925 6.98535H18.3588" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                        <path
                          d="M6.59262 8.37672C7.33413 8.37672 7.93525 7.75417 7.93525 6.98621C7.93525 6.21826 7.33413 5.5957 6.59262 5.5957C5.85111 5.5957 5.25 6.21826 5.25 6.98621C5.25 7.75417 5.85111 8.37672 6.59262 8.37672Z"
                          fill="currentColor"></path>
                        <path d="M10.2925 12H18.3588" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                        <path
                          d="M6.59262 13.3914C7.33413 13.3914 7.93525 12.7688 7.93525 12.0009C7.93525 11.2329 7.33413 10.6104 6.59262 10.6104C5.85111 10.6104 5.25 11.2329 5.25 12.0009C5.25 12.7688 5.85111 13.3914 6.59262 13.3914Z"
                          fill="currentColor"></path>
                        <path d="M10.2925 17.0146H18.3588" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                        <path
                          d="M6.59262 18.405C7.33413 18.405 7.93525 17.7825 7.93525 17.0145C7.93525 16.2466 7.33413 15.624 6.59262 15.624C5.85111 15.624 5.25 16.2466 5.25 17.0145C5.25 17.7825 5.85111 18.405 6.59262 18.405Z"
                          fill="currentColor"></path>
                      </svg>
                      <h5 class="pkg">Description</h5>
                    </span>
                    <ul class="m-0 p-2">
  
                      <div class="description-section">
                        <p class="description-content m-0 mrk-dis">
                          ${data.description}
                        </p>
                      </div>
  
  
  
                    </ul>
  
  
  
                  </div>
                </div>
              </div>
      </div>`

      rightOffcanvas.innerHTML = `<div class="offcanvas-header custom-header">
      <h5 class="offcanvas-title custom-title" id="newOffcanvasRightLabel">
        Package Details
      </h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body custom-offcanvas-body">
      <div class="container my-4" style="height: auto">
        <h2 class="included-h">Included Tests</h2>
        <!-- Dropdown -->
        ${data.includedTests.map((test, index) => `
          <div>
          <div class="dropdown-header" data-bs-toggle="collapse" data-bs-target="#dropdownContent${index}"  id="dropdown${index}">
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

        <img src="images/banner.png" height="auto" width="100%" alt="" class="my-5" />

      </div>
      </div>`

      bottomOffcanvas.innerHTML = ` <div class="offcanvas-header custom-header">
      <h5 class="offcanvas-title custom-title" id="newOffcanvasBottomLabel">
        Package Details
      </h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body custom-offcanvas-body">
      <div class="container my-4" style="height: auto">
        <h2 class="included-h">Included Tests</h2>
        <!-- Dropdown -->
         ${data.includedTests.map((test, index) => `
        <div>
          <div class="dropdown-header" data-bs-toggle="collapse" data-bs-target="#dropdownContent${index}" id="dropdown${index}">
            <div class="d-flex align-items-center">
              <img class="drptst-icon" src="images/icon-svg/dropdown/liver (1).png" alt="Icon" />
              <h5>${test.category}</h5>
            </div>
            <i class="fa-solid fa-chevron-down drp-dwnicon"  id="icon${index}"></i>
          </div>
          <ul id="dropdownContent${index}" class="collapse dropdown-content dropdown-ul">
           ${test.tests.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
         `).join('')}
        </div>
        <img src="images/banner.png" height="auto" width="100%" alt="" class="my-5" />
      </div>
      </div>`

      overview.innerHTML = ` <p class="description-content m-0 mrk-dis">
      ${data.overview}</p>`

      risk.innerHTML = ` <p class="description-content m-0 mrk-dis">
                   ${data.risk}
                  </p>
`

    }

    function renderSimilarTests(data) {
      console.log(data);
      const container = document.getElementById("testimonial-card");
  
      // Clear any existing content
      container.innerHTML = "";
    
      // Append new items
      const carouselItems = data.map((test,index) => `
          <div class="checkup-cardmain">
                      <div class="d-flex justify-content-between">
                        <h2 class="checkup-card-h">
                         ${test.testName}
                        </h2>

                        <spam class="checkup-cardprice text-end">
                          ₹${test.offerPrice} <br /><del>₹${test.price}</del></spam>
                      </div>

                      <p class="checkup-card-disc">
                       ${test.description}
                      </p>

                      <div class="checkup-cardmore d-lg-block d-md-none d-sm-none d-none" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight1" aria-controls="offcanvasRight1"  data-bs-id="${test._id}"
            data-index="${index}">
                        know more+ <i class="fa-solid fa-chevron-down"></i>
                      </div>

                      <div class="checkup-cardmore d-lg-none d-md-block d-sm-block d-block"
                       data-bs-id="${test._id}"
            data-index="${index}" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                        know more+ <i class="fa-solid fa-chevron-down"></i>
                      </div>

                      <div class="d-flex justify-content-between">
                        <div class="checkup-cardrta">
                          Report in <span class="checkup-hours">${test.reportTime} Hours</span>

                          <span>|</span>

                          <span class="checkup-cardrta">
                            Test <span class="checkup-test">${test.totalTests}</span>
                          </span>
                        </div>

                        <span class="add-check-up">
                          Add
                          <a href="product.html?id=${test._id}&category=${test.subcategory}" class="checkup-cardadd">
                            <i class="fa-solid fa-plus"></i></a>
                        </span>
                      </div>
      </div>`)
      .join("");


      container.innerHTML = carouselItems;

       // Add click event listeners to update the offcanvas dynamically
       document.querySelectorAll(".checkup-cardmore").forEach((btn) => {
        btn.addEventListener("click", (event) => {
          const index = event.currentTarget.dataset.index;
          const test = data[index];
          updateOffcanvasContent(test);
        });
      });

      

     
      

      
    }

    function updateOffcanvasContent(test) {

      const rightOffcanvas = document.getElementById("offcanvasRight1")
      const bottomOffcanvas = document.getElementById("offcanvasBottom")

     

      rightOffcanvas.innerHTML=  `
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

     bottomOffcanvas.innerHTML =  `
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

  } else {
    console.log("testId not found");

  }
});