// Translation system
let translations = {};
let currentLang = 'en';

// Language configuration
const languages = {
  en: { name: 'English', dir: 'ltr', font: 'Playfair Display' },
  ar: { name: 'العربية', dir: 'rtl', font: 'Cairo' },
  nl: { name: 'Nederlands', dir: 'ltr', font: 'Playfair Display' }
};

// Load translation file
async function loadTranslations(lang) {
  try {
    const response = await fetch(`translations/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    translations[lang] = await response.json();
    return translations[lang];
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // Fallback to English if translation fails
    if (lang !== 'en') {
      return await loadTranslations('en');
    }
    return {};
  }
}

// Get nested translation value by key path (e.g., "nav.home")
function getTranslation(key, lang = currentLang) {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key "${key}" not found for language "${lang}"`);
      return key; // Return key if translation not found
    }
  }
  
  return value || key;
}

// Update all elements with data-i18n attributes
function updateTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else if (element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', translation);
    } else {
      element.textContent = translation;
    }
  });
}

// Update language and direction
async function setLanguage(lang) {
  if (!languages[lang]) {
    console.error(`Language "${lang}" is not supported`);
    return;
  }

  // Load translation if not already loaded
  if (!translations[lang]) {
    await loadTranslations(lang);
  }

  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);

  const langConfig = languages[lang];
  const html = document.documentElement;
  const body = document.body;

  // Update HTML attributes
  html.setAttribute('lang', lang);
  html.setAttribute('dir', langConfig.dir);

  // Update body class for RTL
  body.classList.toggle('rtl', langConfig.dir === 'rtl');

  // Update font family
  if (lang === 'ar') {
    body.style.fontFamily = "'Cairo', 'Amiri', sans-serif";
  } else {
    body.style.fontFamily = "'Playfair Display', serif";
  }

  // Update language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = lang;
  }

  // Update all translations
  updateTranslations();
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Check for saved language preference
  const savedLang = localStorage.getItem('preferredLanguage');
  const initialLang = (savedLang && languages[savedLang]) ? savedLang : 'en';

  // Load initial language translation
  await loadTranslations(initialLang);
  
  // Set initial language
  await setLanguage(initialLang);

  // Setup language selector
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', async function(e) {
      const newLang = e.target.value;
      await setLanguage(newLang);
    });
  }

  // Setup mobile menu
  setupMobileMenu();
  
  // Setup smooth scroll
  setupSmoothScroll();
});

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
      const isClickOnLangSelect = document.getElementById('langSelect')?.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnToggle && !isClickOnLangSelect && navMenu.classList.contains('active')) {
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
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;
        
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
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  }
});
