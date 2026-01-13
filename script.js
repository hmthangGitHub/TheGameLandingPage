const iconModal = document.getElementById('iconModal');
const screenshotModal = document.getElementById('screenshotModal');
const thumbGallery = document.getElementById('thumbGallery');
const swipeContainer = document.getElementById('swipeContainer');

// Load metadata and populate page
async function loadMetadata() {
    try {
        const version = "v1"
        const response = await fetch(`assets/${version}/metadata.json`);
        const metadata = await response.json();

        // Set icon path
        document.getElementById('mainIcon').src = `assets/${version}/img/icon.jpg`;

        // Populate page title
        document.getElementById('pageTitle').textContent = metadata.title;

        // Populate app title
        document.getElementById('appTitle').textContent = metadata.title;

        // Populate developer name
        document.getElementById('developerName').textContent = metadata.developer;

        // Populate about text
        document.getElementById('aboutText').textContent = metadata.about;

        // Generate screenshot images based on screenshotCount
        for (let i = 1; i <= metadata.screenshotCount; i++) {
            const filename = `screenshot_${i}.jpg`;
            const imgPath = `assets/${version}/img/${filename}`;
            const index = i - 1;

            // Create thumbnail image
            const thumbImg = document.createElement('img');
            thumbImg.src = imgPath;
            thumbImg.dataset.index = index;
            thumbGallery.appendChild(thumbImg);

            // Create full-size slide for modal
            const slide = document.createElement('div');
            slide.className = 'swipe-slide';
            const fullImg = document.createElement('img');
            fullImg.src = imgPath;
            slide.appendChild(fullImg);
            swipeContainer.appendChild(slide);

            // Open screenshot gallery on click
            thumbImg.onclick = () => {
                screenshotModal.style.display = 'block';
                setTimeout(() => {
                    const screenWidth = swipeContainer.offsetWidth;
                    swipeContainer.scrollTo({
                        left: index * screenWidth,
                        behavior: 'auto'
                    });
                }, 10);
            };
        }
    } catch (error) {
        console.error('Error loading metadata:', error);
    }
}

// Initialize page when DOM is loaded
loadMetadata();

function openIconPreview() {
    const mainImg = document.getElementById('mainIcon');
    const modalImg = document.querySelector('#iconModalContent img');

    // This ensures the modal uses the exact same image currently visible in the header
    modalImg.src = mainImg.src;
    document.getElementById('iconModal').style.display = 'block';
}

function closeAllModals() {
    iconModal.style.display = 'none';
    screenshotModal.style.display = 'none';
}

// Close screenshot modal if clicking background (not image)
swipeContainer.onclick = (e) => {
    if (e.target.tagName !== 'IMG') closeAllModals();
};
