document.addEventListener("DOMContentLoaded", () => {
    const carouselContainer = document.getElementById("carousel-container");
  
    // Fetch data from backend
    fetch(`${baseUrl}/api/v1/category/menage/selected`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch men care data");
        }
        return response.json();
      })
      .then((data) => {
        const category = data.data
        console.log(category);
        
        carouselContainer.innerHTML = "";
  
        // Dynamically generate carousel items
        category.forEach((item) => {
          const carouselItem = `
            <a href="${item.link}" class="test-cardmain">
              <div class="test-card text-center">
                <img class="test-cardimg" src="${baseUrl}/${item.imagePath}" alt="${item.name}" />
                <h4 class="testcard-head">${item.name}</h4>
              </div>
            </a>
          `;
          carouselContainer.innerHTML += carouselItem;
        });
  
        // Reinitialize carousel (if using a library like OwlCarousel)
        $(".carousel-5").owlCarousel({
          items: 3,
          loop: true,
          margin: 10,
          nav: true,
          navText: [
            '<i class="fa-solid fa-chevron-left"></i>',
            '<i class="fa-solid fa-chevron-right"></i>',
          ],
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 },
          },
        });
  
        // Custom navigation buttons
        document.getElementById("manprev2").addEventListener("click", () => {
          $(".carousel-5").trigger("prev.owl.carousel");
        });
  
        document.getElementById("mannext2").addEventListener("click", () => {
          $(".carousel-5").trigger("next.owl.carousel");
        });
      })
      .catch((error) => {
        console.error("Error fetching or rendering men care carousel:", error);
        carouselContainer.innerHTML = `
          <p class="text-danger">Failed to load content. Please try again later.</p>
        `;
      });
  });
  