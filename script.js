// Language Toggle Functionality
let currentLang = 'en';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLang = savedLang;
    }
    
    updateLanguage();
    setupMobileMenu();
    setupSmoothScroll();
});

// Language toggle button
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');

langToggle.addEventListener('click', function() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('preferredLanguage', currentLang);
    updateLanguage();
});

function updateLanguage() {
    const html = document.documentElement;
    const body = document.body;
    
    // Update language attribute
    html.setAttribute('lang', currentLang);
    
    // Update direction
    if (currentLang === 'ar') {
        html.setAttribute('dir', 'rtl');
        body.classList.add('rtl');
        langText.textContent = 'EN';
    } else {
        html.setAttribute('dir', 'ltr');
        body.classList.remove('rtl');
        langText.textContent = 'AR';
    }
    
    // Update all text content
    updateTextContent();
}

function updateTextContent() {
    // Get all elements with data-en and data-ar attributes
    const elements = document.querySelectorAll('[data-en][data-ar]');
    
    elements.forEach(element => {
        if (currentLang === 'ar') {
            element.textContent = element.getAttribute('data-ar');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update href attributes for email and phone
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const phoneLink = document.querySelector('a[href^="tel:"]');
    
    if (emailLink) {
        if (currentLang === 'ar') {
            emailLink.textContent = "Marwa.Alzir@gmail.com";
        } else {
            emailLink.textContent = "Marwa.Alzir@gmail.com";
        }
    }
    
    if (phoneLink) {
        if (currentLang === 'ar') {
            phoneLink.textContent = '+1 (234) 567-890';
        } else {
            phoneLink.textContent = '+1 (234) 567-890';
        }
    }
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// Smooth Scroll for Navigation Links
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

