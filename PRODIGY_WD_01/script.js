// Banking Website JavaScript - Interactive Navigation and Features

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const loginForm = document.getElementById('login-form');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeForms();
    initializeInteractiveElements();
});

// Navigation functionality with scroll and hover effects
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Enhanced hover effects for navigation links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.15)';
        });

        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Scroll effects for navbar color and style changes
function initializeScrollEffects() {
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Add parallax effect to hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollY < hero.offsetHeight) {
            const parallaxRate = scrollY * 0.5;
            hero.style.transform = `translateY(${parallaxRate}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Initial call
    updateNavbar();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.style.transform = '';
                link.style.boxShadow = '';
            });
            
            // Add active class to current link
            if (correspondingLink) {
                correspondingLink.classList.add('active');
                correspondingLink.style.transform = 'translateY(-2px)';
                correspondingLink.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.2)';
            }
        }
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Special animation for statistics
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .location-card, .contact-item, .stat-item, .banking-card'
    );

    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Observe stat numbers for counting animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animate numbers counting up
function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^\d]/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        current += increment;
        step++;
        
        if (step >= steps) {
            current = number;
            clearInterval(timer);
        }
        
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber + suffix;
    }, duration / steps);
}

// Form handling
function initializeForms() {
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmission(this);
        });
    }

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLoginSubmission(this);
        });
    }

    // Real-time form validation
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle contact form submission
function handleContactSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        form.reset();
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }, 2000);
}

// Handle login form submission
function handleLoginSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const username = formData.get('username');
    const password = formData.get('password');

    // Basic validation
    if (!username || !password) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Signing In...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    // Simulate login (replace with actual authentication)
    setTimeout(() => {
        // For demo purposes, show success message
        showNotification('Login functionality would redirect to your account dashboard.', 'info');
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }, 1500);
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(e);

    // Validation rules
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            break;
        
        case 'tel':
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
            break;
        
        case 'password':
            if (value && value.length < 6) {
                isValid = false;
                errorMessage = 'Password must be at least 6 characters long.';
            }
            break;
    }

    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none; 
                border: none; 
                color: white; 
                font-size: 1.25rem; 
                cursor: pointer; 
                margin-left: 1rem;
                padding: 0;
                line-height: 1;
            ">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Interactive elements enhancement
function initializeInteractiveElements() {
    // Enhanced service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.boxShadow = '0 25px 70px rgba(30, 64, 175, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Banking card 3D effect
    const bankingCard = document.querySelector('.banking-card');
    if (bankingCard) {
        bankingCard.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        bankingCard.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = '';
            }
        });
    });

    // Dropdown menu enhanced interactions
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeout;

        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeout);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });

        dropdown.addEventListener('mouseleave', function() {
            timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedUpdateNavLink = debounce(updateActiveNavLink, 10);
window.addEventListener('scroll', debouncedUpdateNavLink);

// Preload critical resources
function preloadResources() {
    // Preload critical fonts
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Initialize resource preloading
preloadResources();

// Smooth page load animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message for developers
console.log(`
🏦 SecureBank Website
============================
Built with vanilla HTML, CSS, and JavaScript
Features:
- Interactive navigation with scroll effects
- Responsive design
- Form validation
- Smooth animations
- Accessibility features

Contact: support@securebank.com
`);

// Export functions for potential external use
window.BankingWebsite = {
    showNotification,
    updateActiveNavLink,
    animateNumber
};