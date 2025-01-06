const supportedPincodes = ['671314', '654321', '110011', '560001']; // Add your pincodes here

// Get the user's current location
document.querySelector('.current-l').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Fetch location data based on coordinates
      fetch('http://localhost:3000/api/v1/location/get-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude })
      })
      .then(response => response.json())
      .then(data => {
        const locationData = data.data;
        const pincode = locationData?.postcode || ''; // Safe access
        const displayLocation = locationData?.city || 'Location not found';

        if (supportedPincodes.includes(pincode)) {
          document.querySelector('.dlv-addrss').textContent = 'Delivery Address'; // Clear any error
        } else {
          document.querySelector('.dlv-addrss').textContent = 'Service not available';
        }
        document.querySelector('.slc-addrss').textContent = displayLocation;
        $('#dropdownMenuButton').dropdown('hide'); // Close dropdown
      })
      .catch(error => {
        console.error('Error getting current location:', error);
        alert('Something went wrong. Please try again later.');
      });
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

// Handle Pincode submission
document.querySelector('.pincod-sub').addEventListener('click', () => {
  const pincode = document.querySelector('.inputGroup input').value.trim();

  if (pincode.length === 6) {
    fetch(`http://localhost:3000/api/v1/location/${pincode}`)
      .then(response => response.json())
      .then(data => {
        const displayName = Array.isArray(data.data) ? data.data[0]?.display_name : null;

        if (displayName) {
          const parts = displayName.split(',');
          const displayLocation = parts.slice(0, 2).join(',') || 'Location not found';

          if (supportedPincodes.includes(pincode)) {
            document.querySelector('.dlv-addrss').textContent = 'Delivery Address'; // Clear any error
          } else {
            document.querySelector('.dlv-addrss').textContent = 'Service not available';
          }
          document.querySelector('.slc-addrss').textContent = displayLocation;
          $('#staticBackdrop').modal('hide'); // Close modal
        } else {
          alert('Invalid Pincode');
        }
      })
      .catch(error => {
        console.error('Error fetching location by pincode:', error);
        document.querySelector('.dlv-addrss').textContent = 'Unable to fetch location. Please try again.';
      });
  } else {
    alert('Please enter a valid 6-digit pincode.');
  }
});
