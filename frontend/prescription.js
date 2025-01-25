document.getElementById('prescriptionForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission and page refresh
    console.log('Form submitted and preventDefault called');

    const whatsappInput = document.getElementById('whatsapp');
    const prescriptionInput = document.getElementById('prescription');
    const messageDiv = document.getElementById('pre-message');
    messageDiv.innerHTML = ''; // Clear previous messages

    let isValid = true;
    let errorMessage = '';

    try {
        // Check authentication status
        const { isAuthenticated } = await checkAuthStatus();
        console.log('Authentication Status:', isAuthenticated);

        if (!isAuthenticated) {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                const bsCollapse = new bootstrap.Collapse(sidebar, { toggle: false });
                bsCollapse.show();
            }
            return;
        }

        // Validate WhatsApp Number
        const whatsappNumber = whatsappInput.value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(whatsappNumber)) {
            isValid = false;
            errorMessage += `<p>Enter a valid 10-digit WhatsApp number.</p>`;
        }

        // Validate Prescription Image
        const file = prescriptionInput.files[0];
        if (!file) {
            isValid = false;
            errorMessage += '<p>Please upload a prescription image.</p>';
        } else if (!file.type || !file.type.startsWith('image/')) {
            isValid = false;
            errorMessage += '<p>Only image files are allowed for prescription upload.</p>';
        } else if (file.size > 5 * 1024 * 1024) { // 5MB file size limit
            isValid = false;
            errorMessage += '<p>File size should be less than 5MB.</p>';
        }

        // Display errors if validation fails
        if (!isValid) {
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = errorMessage;
            return;
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('whatsapp', whatsappNumber);
        formData.append('prescription', file);

        let response;
        try {
            response = await fetch(`${baseUrl}/api/v1/prescription/upload`, {
                method: 'POST',
                body: formData,
            });

            console.log('Response received:', response);

            // Check for a valid response
            if (!response.ok) {
                const errorDetails = await response.json();
                messageDiv.style.color = 'red';
                messageDiv.innerHTML = `<p><strong>Error:</strong> ${errorDetails.message || 'Unknown server error.'}</p>`;
                return;
            }

            const result = await response.json();
            console.log('API Result:', result);

            messageDiv.style.color = 'green';
            messageDiv.innerHTML = `
                <p><strong>Success:</strong> ${result.message}</p>
            `;
        } catch (fetchError) {
            console.error('Fetch Error:', fetchError);
            messageDiv.style.color = 'red';
            messageDiv.innerHTML = `
                <p><strong>Error:</strong> Network error. Please check your connection and try again.</p>
            `;
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
        messageDiv.style.color = 'red';
        messageDiv.innerHTML = `
            <p><strong>Error:</strong> Failed to upload prescription. Please try again later.</p>
        `;
    }
});
