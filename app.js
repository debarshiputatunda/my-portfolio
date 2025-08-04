// Modern Portfolio JavaScript - FIXED VERSION

// Main class controlling the portfolio's interactive features
class ModernPortfolio {
  constructor() {
    // Track current section, loading state, and scroll progress
    this.currentSection = 'home';
    this.isLoading = true;
    this.scrollProgress = 0;
    
    // CRITICAL FIX: Lock body scroll immediately
    document.body.classList.add('loading');
    
    this.init();
  }

  // Initialize event listeners and components
  init() {
    // CRITICAL FIX: Ensure sections are properly hidden before any transitions
    this.initializeSectionDisplay();
    
    // Add a small delay to ensure CSS is fully loaded
    setTimeout(() => {
      this.setupEventListeners();
      this.initializeComponents();
      this.handlePageLoad();
    }, 50);
  }

  // CRITICAL FIX: New method to properly initialize section display
  initializeSectionDisplay() {
    document.querySelectorAll('.section').forEach(section => {
      if (!section.classList.contains('active')) {
        // Hide inactive sections completely
        section.style.display = 'none';
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.visibility = 'hidden';
        section.style.position = 'relative';
      } else {
        // Show active section properly
        section.style.display = 'block';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.visibility = 'visible';
        section.style.position = 'relative';
        section.style.zIndex = '10';
      }
    });

    // Force layout recalculation
    document.body.offsetHeight;
  }

  // Set up all event listeners for UI interactions
  setupEventListeners() {
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Navigation links and section buttons
    document.querySelectorAll('.nav-link, [data-section]').forEach(link => {
      link.addEventListener('click', (e) => this.handleNavigation(e));
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Window scroll and resize events
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', () => this.scrollToTop());
    }
    
    // Project filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.filterProjects(e));
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    // Form validation on blur/input
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.clearFieldError(e.target));
    });
  }

  // Initialize scroll progress, intersection observer, skill bars, typing, parallax
  initializeComponents() {
    this.initScrollProgress();
    this.initIntersectionObserver();
    this.initSkillBars();
    this.initTypingAnimation();
    this.setupParallaxEffects();
  }

  // Handle initial page load: hide loader, animate hero
  handlePageLoad() {
    // CRITICAL FIX: Reduced delay and proper sequence
    setTimeout(() => {
      this.hideLoader();
      this.animateOnLoad();
    }, 800); // Reduced from 1000ms
  }

  // CRITICAL FIX: Completely rewritten hideLoader method
  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      // Start fade out
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';

      // CRITICAL: Remove loader completely and unlock scroll in one action
      setTimeout(() => {
        loader.style.display = 'none';
        
        // Force scroll to top BEFORE unlocking
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Unlock body scroll
        document.body.classList.remove('loading');
        
        // Force layout recalculation
        document.body.offsetHeight;
      }, 200); // Reduced from 300ms
    }
    this.isLoading = false;
  }

  // Animate hero content and skill bars on load
  animateOnLoad() {
    // Animate each child of hero-content with a stagger
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });

    // Animate skill bars after hero
    setTimeout(() => this.animateSkillBars(), 1000);
  }

  // Toggle between dark and light theme
  toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Animate theme transition
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  }

  // Handle navigation link or button click
  handleNavigation(e) {
    e.preventDefault();
    const target = e.target.closest('[data-section]');
    if (!target) return;
    
    const sectionName = target.getAttribute('data-section');
    this.navigateToSection(sectionName);
  }

  // CRITICAL FIX: Improved section navigation with proper display handling
  navigateToSection(sectionName) {
    if (this.currentSection === sectionName) return;
    
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeNavLink = document.querySelector(`[data-section="${sectionName}"].nav-link`);
    if (activeNavLink) {
      activeNavLink.classList.add('active');
    }
    
    // Get current and target sections
    const currentSectionEl = document.getElementById(this.currentSection);
    const targetSectionEl = document.getElementById(sectionName);
    
    if (currentSectionEl && targetSectionEl) {
      // Hide current section immediately
      currentSectionEl.style.opacity = '0';
      currentSectionEl.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        // Remove active class and hide completely
        currentSectionEl.classList.remove('active');
        currentSectionEl.style.display = 'none';
        currentSectionEl.style.visibility = 'hidden';
        
        // Show target section
        targetSectionEl.classList.add('active');
        targetSectionEl.style.display = 'block';
        targetSectionEl.style.visibility = 'visible';
        
        // Animate new section in
        setTimeout(() => {
          targetSectionEl.style.opacity = '1';
          targetSectionEl.style.transform = 'translateY(0)';
          
          // Trigger section-specific animations
          this.triggerSectionAnimations(sectionName);
        }, 50);
      }, 200);
    }
    
    this.currentSection = sectionName;
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Run animations for specific sections
  triggerSectionAnimations(sectionName) {
    switch (sectionName) {
      case 'home':
        this.animateSkillBars();
        break;
      case 'projects':
        this.animateProjectCards();
        break;
      case 'achievements':
        this.animateTimeline('.timeline-item');
        break;
      case 'career':
        this.animateTimeline('.career-item');
        break;
      case 'contact':
        this.animateContactElements();
        break;
    }
  }

  // Toggle mobile navigation menu
  toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const toggle = document.getElementById('mobileMenuToggle');
    
    if (nav && toggle) {
      nav.classList.toggle('mobile-open');
      toggle.classList.toggle('active');
    }
  }

  // Handle scroll: update progress bar, back-to-top, parallax
  handleScroll() {
    // Don't handle scroll during loading
    if (this.isLoading) return;
    
    this.updateScrollProgress();
    this.updateBackToTopButton();
    this.handleParallaxEffects();
  }

  // Update scroll progress bar width
  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
  }

  // Show/hide back-to-top button based on scroll position
  updateBackToTopButton() {
    const backToTop = document.getElementById('backToTop');
    const scrollY = window.pageYOffset;
    
    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  // Scroll smoothly to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Initialize scroll progress bar to 0
  initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  // Set up intersection observer for animating elements on scroll
  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Animate skill bars when skills section is visible
          if (entry.target.classList.contains('skills-preview')) {
            this.animateSkillBars();
          }
        }
      });
    }, observerOptions);

    // Observe timeline, career, project cards, and skills
    document.querySelectorAll('.timeline-item, .career-item, .project-card, .skills-preview').forEach(el => {
      observer.observe(el);
    });
  }

  // Set initial styles for hero content and skill bars
  initSkillBars() {
    document.querySelectorAll('.hero-content > *').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
    });
  }

  // Animate skill bars to their respective widths
  animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
      const progressBar = item.querySelector('.skill-progress');
      const level = parseInt(item.getAttribute('data-level')) || 0;
      
      if (progressBar) {
        setTimeout(() => {
          progressBar.style.width = `${level}%`;
        }, index * 200);
      }
    });
  }

  // Typing animation for hero intro text
  initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = "Hello, I'm Debarshi Putatunda";
    const speed = 80;
    let i = 0;
    
    typingText.innerHTML = '';
    
    const typeWriter = () => {
      if (i < text.length) {
        typingText.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };
    
    setTimeout(typeWriter, 1500);
  }

  // Prepare parallax background shapes
  setupParallaxEffects() {
    this.parallaxElements = document.querySelectorAll('.bg-shapes .dot, .bg-shapes .shape');
  }

  // Move parallax shapes based on scroll
  handleParallaxEffects() {
    if (!this.parallaxElements || this.isLoading) return;
    
    const scrollY = window.pageYOffset;
    const parallaxSpeed = 0.3; // Reduced for better performance
    
    this.parallaxElements.forEach((element, index) => {
      const yPos = -(scrollY * parallaxSpeed * (index + 1) * 0.2);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Filter project cards by category
  filterProjects(e) {
    const filterBtn = e.target;
    const filter = filterBtn.getAttribute('data-filter');
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    filterBtn.classList.add('active');
    
    // Show/hide project cards by category
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.classList.add('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
      }
    });
  }

  // Animate visible project cards in
  animateProjectCards() {
    const cards = document.querySelectorAll('.project-card:not(.hidden)');
    
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  // Animate timeline or career items in sequence
  animateTimeline(selector) {
    const items = document.querySelectorAll(selector);
    
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate');
      }, index * 200);
    });
  }

  // Animate contact info and form
  animateContactElements() {
    const elements = document.querySelectorAll('.contact-info, .contact-form');
    
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // Handle contact form submission
  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const isValid = this.validateForm(form);
    
    if (isValid) {
      this.submitForm(new FormData(form));
    }
  }

  // Validate all fields in the form
  validateForm(form) {
    const fields = form.querySelectorAll('.form-control');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Validate a single field, show error if invalid
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = field.parentNode.querySelector('.form-error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (!value) {
      isValid = false;
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Display error
    if (errorElement) {
      errorElement.textContent = errorMessage;
      field.classList.toggle('error', !isValid);
    }
    
    return isValid;
  }

  // Clear error message for a field
  clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = '';
      field.classList.remove('error');
    }
  }

  // Simulate form submission and show notification
  async submitForm(formData) {
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showNotification('Message sent successfully!', 'success');
      const form = document.getElementById('contactForm');
      if (form) form.reset();
      
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  // Show a notification message (success, error, info)
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#00d4ff'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Handle window resize for responsive adjustments
  handleResize() {
    this.updateParallaxElements();
  }

  // Reset parallax transforms on mobile
  updateParallaxElements() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && this.parallaxElements) {
      this.parallaxElements.forEach(element => {
        element.style.transform = 'none';
      });
    }
  }

  // Static initializer for the class
  static init() {
    return new ModernPortfolio();
  }
}

// Additional UI/animation effects
class AnimationEffects {
  // Add magnetic hover effect to buttons
  static addHoverEffects() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Animate text elements as they enter viewport
  static addTextAnimations() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
      });
    });
    
    textElements.forEach(el => observer.observe(el));
  }

  // Add floating particle background effect (desktop only)
  static addParticleEffect() {
    // Skip if mobile
    if (window.innerWidth <= 768) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 30; i++) { // Reduced from 50
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(0, 212, 255, 0.3);
        border-radius: 50%;
        animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      particleContainer.appendChild(particle);
    }
  }
}

// CRITICAL FIX: Improved initialization sequence
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Load saved theme BEFORE any layout operations
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Initialize main portfolio logic with proper timing
    setTimeout(() => {
      const portfolio = ModernPortfolio.init();
      
      // Add effects after core initialization
      setTimeout(() => {
        AnimationEffects.addHoverEffects();
        AnimationEffects.addTextAnimations();
        AnimationEffects.addParticleEffect();
      }, 500);
    }, 100);
    
    // Inject critical CSS fixes
    const style = document.createElement('style');
    style.textContent = `
      /* CRITICAL LOADER FIXES */
      body.loading {
        overflow: hidden !important;
        height: 100vh !important;
      }
      
      .loader {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: var(--bg-primary) !important;
      }
      
      /* CRITICAL SECTION DISPLAY FIXES */
      .section {
        display: none !important;
        position: relative !important;
        width: 100% !important;
        min-height: auto !important;
      }
      
      .section.active {
        display: block !important;
        opacity: 1 !important;
        transform: translateY(0) !important;
        visibility: visible !important;
      }
      
      /* BACKGROUND FIXES */
      .hero-bg-global {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 0 !important;
        pointer-events: none !important;
      }
      
      /* MAIN CONTENT POSITIONING */
      #page-wrapper {
        position: relative !important;
        z-index: 10 !important;
        min-height: 100vh !important;
      }
      
      .main {
        position: relative !important;
        z-index: 10 !important;
        padding-top: 70px !important;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .form-control.error {
        border-color: #ff4757;
        box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
      }
      
      .nav.mobile-open {
        display: flex;
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background: var(--bg-secondary);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--glass-border);
        z-index: 998;
      }
      
      .nav.mobile-open .nav-list {
        flex-direction: column;
        width: 100%;
        padding: 2rem;
        gap: 1rem;
      }
      
      .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }
      
      .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
      
      .contact-info,
      .contact-form {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }
      
      @media (max-width: 768px) {
        .contact-content {
          grid-template-columns: 1fr;
        }
        
        .particles {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    
  } catch (error) {
    console.error('Error initializing portfolio:', error);
    // Fallback: force hide loader and unlock body
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
    document.body.classList.remove('loading');
  }
});

// Polyfill for smooth scrolling in older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScrollPolyfill = document.createElement('script');
  smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/smoothscroll.min.js';
  document.head.appendChild(smoothScrollPolyfill);
}

// CRITICAL FIX: Improved background height management
function updateBackgroundHeight() {
  const bgElements = [
    document.querySelector('.hero-bg-global'),
    document.querySelector('.scatter-animation')
  ];
  
  const contentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  
  bgElements.forEach(bg => {
    if (bg) {
      bg.style.height = contentHeight + 'px';
    }
  });
}

// Update background height when needed
window.addEventListener('load', updateBackgroundHeight);
window.addEventListener('resize', updateBackgroundHeight);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernPortfolio, AnimationEffects };
}