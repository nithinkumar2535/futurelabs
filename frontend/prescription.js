document.getElementById('pre-btn').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const whatsappInput = document.getElementById('whatsapp');
    const prescriptionInput = document.getElementById('prescription');
    const messageDiv = document.getElementById('pre-message');
    messageDiv.innerHTML = ''; // Clear previous messages
  
    // Validation flags
    let isValid = true;
    let errorMessage = '';
  
    // Validate WhatsApp Number
    const whatsappNumber = whatsappInput.value.trim();
    const phoneRegex = /^[+]?[0-9]{10,15}$/; // Supports optional "+" and 10-15 digits
    if (!whatsappNumber) {
      isValid = false;
      errorMessage += '<p>Please enter your WhatsApp number.</p>';
    } else if (!phoneRegex.test(whatsappNumber)) {
      isValid = false;
      errorMessage += '<p>Enter a valid WhatsApp number (10-15 digits).</p>';
    }
  
    // Validate Prescription Image Upload
    const file = prescriptionInput.files[0];
    if (!file) {
      isValid = false;
      errorMessage += '<p>Please upload a prescription image.</p>';
    } else if (!file.type.startsWith('image/')) {
      isValid = false;
      errorMessage += '<p>Only image files are allowed for prescription upload.</p>';
    }
  
    // If validation fails, display error messages
    if (!isValid) {
      messageDiv.style.color = 'red';
      messageDiv.innerHTML = errorMessage;
      return; // Stop further execution
    }
  
    // Proceed with form submission if validation passes
    const form = document.getElementById('prescription-form');
    const formData = new FormData(form);
  
   /*  try {
      const response = await fetch('http://localhost:3000/api/v1/prescription/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        messageDiv.style.color = 'green';
        messageDiv.innerHTML = `
          <p><strong>Success:</strong> ${result.message}</p>
        `;
      } else {
        const error = await response.json();
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `
          <p><strong>Error:</strong> ${error.message}</p>
        `;
      }
    } catch (err) {
      console.error('Error:', err);
      messageDiv.style.color = 'red';
      messageDiv.innerHTML = `
        <p><strong>Error:</strong> Failed to upload prescription. Please try again later.</p>
      `;
    } */

      const response = await fetch('http://localhost:3000/api/v1/prescription/uploa', {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      

  });
  