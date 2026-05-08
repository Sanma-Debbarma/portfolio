// --- Navigation Logic ---
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

// Sticky Navbar logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// Helper function to scroll to a section
const scrollToSection = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
};

// Handle Navbar Clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-target');
        
        // Update URL without hash
        const newPath = targetSection === 'home' ? '/' : `/${targetSection}`;
        history.pushState({ section: targetSection }, '', newPath);
        
        scrollToSection(targetSection);
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

// Other scroll links (like "View My Projects" button)
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-target');
        const newPath = `/${targetSection}`;
        history.pushState({ section: targetSection }, '', newPath);
        scrollToSection(targetSection);
    });
});

// --- Intersection Observer for Scroll-to-Navigate ---
let isScrolling = false;
let scrollTimeout;

const observerOptions = {
    root: null,
    threshold: 0.5, // Section must be 50% visible
};

const observerCallback = (entries) => {
    if (isScrolling) return; // Prevent URL updates during manual scroll triggers if needed

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            const currentPath = window.location.pathname;
            const targetPath = sectionId === 'home' ? '/' : `/${sectionId}`;

            // Only update if the path actually changed
            if (currentPath !== targetPath) {
                history.replaceState({ section: sectionId }, '', targetPath);
                updateActiveLink(sectionId);
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

// Function to update active link styling
const updateActiveLink = (sectionId) => {
    navLinks.forEach(link => {
        if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Handle Browser Back/Forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
        scrollToSection(e.state.section);
        updateActiveLink(e.state.section);
    } else {
        // Fallback to home if no state
        scrollToSection('home');
        updateActiveLink('home');
    }
});

// --- Initial Page Load Scroll ---
window.addEventListener('load', () => {
    const initialSection = window.INITIAL_SECTION || 'home';
    if (initialSection !== 'home') {
        // Use a slight timeout to ensure snapping doesn't fight with initial scroll
        setTimeout(() => {
            scrollToSection(initialSection);
            updateActiveLink(initialSection);
        }, 100);
    } else {
        updateActiveLink('home');
    }
});

// --- Dark Mode Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    rootElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    rootElement.setAttribute('data-theme', newTheme);
    themeIcon.classList.replace(newTheme === 'dark' ? 'fa-moon' : 'fa-sun', newTheme === 'dark' ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', newTheme);
});

// --- Contact Form ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = 'var(--accent-color)';
        btn.style.color = '#fff';
        contactForm.reset();
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 3000);
    });
}
