const supportedPincodes = ['560024', '560045', '560046', '560092', '560094', '560006', '560032', '560080', '560112', '562106'];

document.addEventListener('DOMContentLoaded', () => {
  const savedLocation = localStorage.getItem('selectedLocation');
  const savedPincode = localStorage.getItem('selectedPincode');

  if (savedLocation && savedPincode) {
    updateLocationUI(savedLocation, savedPincode);
  } else {
    fetchLocationOnLoad();
  }
});

// Function to truncate location name
function truncateLocation(location, maxLength = 10) {
  if (!location) return 'Location not found';
  return location.length > maxLength ? location.substring(0, maxLength).trim() + '...' : location;
}

// Function to fetch location on page load
function fetchLocationOnLoad() {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    $('#staticBackdrop').modal('show'); // Open modal if geolocation is not supported
    return;
  }

  // Check permission status first
  navigator.permissions.query({ name: 'geolocation' }).then((result) => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        showToast(
          'Location access is blocked. <a href="chrome://settings/content/location" target="_blank">Enable in browser settings</a>', 
          true
        );
        return;
      }
    });

    // Request location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`${baseUrl}/api/v1/location/get-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then(response => response.json())
          .then(data => {
            const locationData = data.data;
            const pincode = locationData?.postcode || '';
            const displayLocation = locationData?.city || 'Location not found';

            updateLocationUI(displayLocation, pincode);
          })
          .catch(error => {
            console.error('Error getting current location:', error);
            $('#staticBackdrop').modal('show'); // Open pincode modal if fetching fails
          });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          showToast(
            'Location access is denied. Please enable it in your browser settings or enter your pincode manually.', 
            true
          );
          $('#staticBackdrop').modal('show'); // Open pincode modal
        }
      }
    );
  });
}


// Function to show Bootstrap toast message
function showToast(message, isError = false) {
  const toastElement = document.getElementById('locationToast');
  const toastBody = document.getElementById('toastBody');

  toastBody.textContent = message;
  toastBody.style.color = isError ? 'red' : 'black';

  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Function to update the UI and store location in localStorage
function updateLocationUI(displayLocation, pincode) {
  const truncatedLocation = truncateLocation(displayLocation);
  const deliveryAddressElement = document.querySelector('.dlv-addrss');

  const previousPincode = localStorage.getItem('selectedPincode');

  document.querySelectorAll('.slc-addrss').forEach(element => {
    element.textContent = truncatedLocation;
  });

  if (supportedPincodes.includes(pincode)) {
    deliveryAddressElement.textContent = 'Delivery Address';
    deliveryAddressElement.style.color = 'black';

    if (!previousPincode || previousPincode !== pincode) {
      showToast('✅ Service is available at your location!', false);
    }
  } else {
    deliveryAddressElement.textContent = 'Service Not Available';
    deliveryAddressElement.style.color = 'red';

    if (!previousPincode || previousPincode !== pincode) {
      showToast('❌ Service is not available at your location.', true);
    }
  }

  localStorage.setItem('selectedLocation', truncatedLocation);
  localStorage.setItem('selectedPincode', pincode);
}





// Handle "Use Current Location" button click
document.querySelectorAll('.current-l').forEach(button => {
  button.addEventListener('click', fetchLocationOnLoad);
});


// Handle Pincode submission manually
document.querySelector('.pincod-sub').addEventListener('click', () => {
  const pincode = document.querySelector('.inputGroup input').value.trim();
  const errMsg = document.querySelector('.pincode-invalid');
  const submitButton = document.querySelector('.pincod-sub');

  if (pincode.length === 6) {
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Checking...`;

    fetch(`${baseUrl}/api/v1/location/${pincode}`)
      .then(response => response.json())
      .then(data => {
        const displayName = Array.isArray(data.data) ? data.data[0]?.display_name : null;

        if (displayName) {
          const parts = displayName.split(',');
          const displayLocation = parts.slice(0, 2).join(',') || 'Location not found';

          updateLocationUI(displayLocation, pincode);
          $('#staticBackdrop').modal('hide'); // Close modal
        } else {
          errMsg.innerHTML = 'Invalid Pincode';
        }
      })
      .catch(error => {
        console.error('Error fetching location by pincode:', error);
        errMsg.innerHTML = 'Unable to fetch location. Please try again.';
      })
      .finally(() => {
        // Remove loading state
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
      });
  } else {
    errMsg.innerHTML = 'Please enter a valid 6-digit pincode.';
  }
});

