// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getRemoteConfig, fetchAndActivate, getValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-remote-config.js";
import { getDatabase, ref, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAIU_KLl1Zt3ZwiiaWM3AaM17cI0-EFik",
    authDomain: "thegame-f06cf.firebaseapp.com",
    projectId: "thegame-f06cf",
    storageBucket: "thegame-f06cf.firebasestorage.app",
    messagingSenderId: "817544093644",
    appId: "1:817544093644:web:0030a1cc7a9537816d0769",
    measurementId: "G-WDT5EXJJNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
const db = getDatabase(app);

const iconModal = document.getElementById('iconModal');
const screenshotModal = document.getElementById('screenshotModal');
const thumbGallery = document.getElementById('thumbGallery');
const swipeContainer = document.getElementById('swipeContainer');

// Store version for analytics
let currentVersion = null;

// Load metadata and populate page
async function loadMetadata() {
    try {
        // Fetch and activate remote config
        await fetchAndActivate(remoteConfig);

        // Get version from remote config
        const versionValue = getValue(remoteConfig, 'landing_page_version');
        console.log(versionValue.asNumber());
        let version = `v${versionValue.asNumber() || 1}`;
        currentVersion = version; // Store version for analytics
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

        // Hide loading indicator and show content
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

        // Set up install button event listener
        setupInstallButton();
    } catch (error) {
        console.error('Error loading metadata:', error);
        // Hide loading indicator even on error
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    }
}

// Install button click handler
function setupInstallButton() {
    const installBtn = document.querySelector('.install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (currentVersion && analytics) {
                logEvent(analytics, 'install', {
                    landing_page_version: currentVersion,
                });
            }
            // Show install popup
            showInstallPopup();
        });
    }

    // Handle form submission
    const installPopupForm = document.getElementById('installPopupForm');
    if (installPopupForm) {
        installPopupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value;
            console.log('Email submitted:', email);

            // Write to Realtime Database subscribers collection using email as ID
            try {
                // Sanitize email to use as key (replace invalid characters)
                const emailKey = email.replace(/[.#$\[\]]/g, '_');
                const subscriberRef = ref(db, `subscribers/${emailKey}`);
                await set(subscriberRef, {
                    email: email,
                    landing_page_version: currentVersion || 'v1',
                    timestamp: serverTimestamp(),
                    createdAt: new Date().toISOString()
                });
                console.log('Subscriber added to Realtime Database');
                // The Cloud Function triggered by this write will handle sending the beautiful email


            } catch (error) {
                console.error('Error adding subscriber to Realtime Database:', error);
            }

            if (currentVersion && analytics) {
                logEvent(analytics, 'submit_email', {
                    landing_page_version: currentVersion,
                });
            }

            // Close the install popup
            closeInstallPopup();

            // Show badge popup first
            showBadgePopup(email);
        });
    }

    // Close popup when clicking overlay
    const installPopup = document.getElementById('installPopup');
    if (installPopup) {
        installPopup.addEventListener('click', (e) => {
            if (e.target === installPopup) {
                closeInstallPopup();
            }
        });
    }

    // Close badge popup when clicking anywhere (overlay or content)
    const badgePopup = document.getElementById('badgePopup');
    if (badgePopup) {
        badgePopup.addEventListener('click', (e) => {
            // Close when clicking anywhere on the badge popup
            const badgeEmailDisplay = document.getElementById('badgeEmailDisplay');
            const email = badgeEmailDisplay ? badgeEmailDisplay.textContent : '';
            closeBadgePopup(email);
        });
    }
}

function showInstallPopup() {
    const installPopup = document.getElementById('installPopup');
    if (installPopup) {
        installPopup.style.display = 'block';
    }
}

function closeInstallPopup() {
    const installPopup = document.getElementById('installPopup');
    if (installPopup) {
        installPopup.style.display = 'none';
    }
}

function showBadgePopup(email) {
    const badgePopup = document.getElementById('badgePopup');
    const badgeEmailDisplay = document.getElementById('badgeEmailDisplay');

    if (badgePopup && badgeEmailDisplay) {
        badgeEmailDisplay.textContent = email;
        badgePopup.style.display = 'block';
    }
}

function closeBadgePopup(email) {
    const badgePopup = document.getElementById('badgePopup');
    const badgeEmailDisplay = document.getElementById('badgeEmailDisplay');

    // Get email from badge display if not provided
    if (!email && badgeEmailDisplay) {
        email = badgeEmailDisplay.textContent;
    }

    if (badgePopup) {
        badgePopup.style.display = 'none';
    }

    // Show confirmation message after badge closes
    const installButton = document.getElementById('installButton');
    const emailConfirmation = document.getElementById('emailConfirmation');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    if (installButton && emailConfirmation && userEmailDisplay && email) {
        installButton.style.display = 'none';
        userEmailDisplay.textContent = email;
        emailConfirmation.style.display = 'block';
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

// Make functions globally accessible for inline onclick handlers
window.openIconPreview = openIconPreview;
window.closeAllModals = closeAllModals;
window.closeInstallPopup = closeInstallPopup;
window.closeBadgePopup = closeBadgePopup;

// Close screenshot modal if clicking background (not image)
swipeContainer.onclick = (e) => {
    if (e.target.tagName !== 'IMG') closeAllModals();
};
