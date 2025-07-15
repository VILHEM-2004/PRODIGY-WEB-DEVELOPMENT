// Portfolio Website JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeSkillBars();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Animation on scroll
function initializeAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    // Observe elements for fade-in animation
    const elementsToAnimate = document.querySelectorAll(
        '.about-content, .skills-content, .project-card, .timeline-item, .contact-content'
    );

    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const progressFill = skillBar.querySelector('.progress-fill');
                    const percentage = progressFill.getAttribute('data-percentage');
                    
                    skillBar.classList.add('animated');
                    progressFill.style.setProperty('--percentage', percentage + '%');
                    progressFill.style.width = percentage + '%';
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form functionality
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Add close functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });

    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

// Remove notification
function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing effect for hero title
function initializeTypingEffect() {
    const roleElement = document.querySelector('.hero-title .role');
    if (roleElement) {
        const roles = ['Full Stack Developer', 'Frontend Specialist', 'UI/UX Designer', 'Problem Solver'];
        let currentRoleIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        function typeRole() {
            const currentRole = roles[currentRoleIndex];
            
            if (isDeleting) {
                roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentCharIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before starting new word
            }

            setTimeout(typeRole, typeSpeed);
        }

        // Start typing effect after page load
        setTimeout(typeRole, 1000);
    }
}

// Initialize typing effect
setTimeout(initializeTypingEffect, 500);

// Parallax effect for hero section
function initializeParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize parallax effect
initializeParallax();

// Project card hover effects
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project cards
initializeProjectCards();

// Dark mode toggle (optional feature)
function initializeDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(darkModeToggle);

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Add dark mode styles
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        .dark-mode {
            --bg-color: #1e293b;
            --text-color: #f1f5f9;
            --card-bg: #334155;
        }
        
        .dark-mode .about,
        .dark-mode .projects,
        .dark-mode .contact {
            background: var(--bg-color);
            color: var(--text-color);
        }
        
        .dark-mode .project-card,
        .dark-mode .contact-form,
        .dark-mode .timeline-content {
            background: var(--card-bg);
            color: var(--text-color);
        }
    `;
    document.head.appendChild(darkModeStyles);
}

// Initialize dark mode
initializeDarkMode();

// Smooth reveal animation for statistics
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    const finalValue = parseInt(statElement.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            statElement.textContent = finalValue + '+';
                            clearInterval(timer);
                        } else {
                            statElement.textContent = Math.floor(currentValue) + '+';
                        }
                    }, 30);
                }
            });
        },
        { threshold: 0.5 }
    );

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Initialize stats animation
animateStats();

// Performance optimization: Debounce scroll events
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
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadImages();

// Add loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    const spinnerStyles = `
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loader-content {
            text-align: center;
            color: #64748b;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = spinnerStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(loader);
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 500);
    });
}

// Show loading animation on page load
if (document.readyState === 'loading') {
    showLoadingAnimation();
}

// Add error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.error('Resource failed to load:', e.target);
    // Optionally show user-friendly error message
});

// Initialize all functionality
console.log('Portfolio website initialized successfully!');