
    
      // Get the button
      var mybutton = document.getElementById("scrollBtn");

      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      };
      
      // When the user clicks on the button, scroll to the top of the document
      function scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }





            // Add rotation effect when dropdown is toggled
 document.querySelectorAll(".dropdown-header").forEach((header) => {
  header.addEventListener("click", () => {
    const icon = header.querySelector("i");
    icon.classList.toggle("rotate");
  });
});

/* Smooth Scroll Event Script */
$(document).ready(function () {
  let lastScrollTop = 0;
  const scrollThreshold = 50;

  const smoothScroll = () => {
    let scrollTop = $("#offcanvasBottom .offcanvas-body").scrollTop();

    // Add smooth background color transition when scrolling
    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      $("#offcanvasBottom").addClass("new-offcanvas-body");
    } else if (scrollTop < lastScrollTop && scrollTop < scrollThreshold) {
      $("#offcanvasBottom").removeClass("new-offcanvas-body");
    }

    lastScrollTop = scrollTop;
    requestAnimationFrame(smoothScroll);
  };

  // Initialize smooth scrolling
  smoothScroll();
});


















          /* search */
      // Desktop
      const uniqueSearchInput = document.getElementById("unique-search-input");
      const uniqueDropdownMenu = document.getElementById(
        "unique-dropdown-menu"
      );

      // Mobile
      const uniqueSearchInputMobile = document.getElementById(
        "unique-search-input-mobile"
      );
      const uniqueDropdownMenuMobile = document.getElementById(
        "unique-dropdown-menu-mobile"
      );

      // Desktop functionality
      uniqueSearchInput.addEventListener("focus", () => {
        uniqueDropdownMenu.classList.add("show");
      });

      uniqueSearchInput.addEventListener("blur", () => {
        setTimeout(() => uniqueDropdownMenu.classList.remove("show"), 200);
      });

      uniqueDropdownMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
          uniqueSearchInput.value = event.target.textContent;
          uniqueDropdownMenu.classList.remove("show");
        }
      });

      // Mobile functionality
      uniqueSearchInputMobile.addEventListener("focus", () => {
        uniqueDropdownMenuMobile.classList.add("show");
      });

      uniqueSearchInputMobile.addEventListener("blur", () => {
        setTimeout(
          () => uniqueDropdownMenuMobile.classList.remove("show"),
          200
        );
      });

      uniqueDropdownMenuMobile.addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
          uniqueSearchInputMobile.value = event.target.textContent;
          uniqueDropdownMenuMobile.classList.remove("show");
        }
      });