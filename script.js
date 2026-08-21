document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check system preferences or local storage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i') || themeToggle;
        if (theme === 'dark') {
            icon.innerHTML = '☀️'; // Show Sun in dark mode
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.innerHTML = '🌙'; // Show Moon in light mode
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
            const isOpen = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Scrollspy navigation highlight
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // Dynamic Typing Effect
    const typeTarget = document.querySelector('.typing-text');
    if (typeTarget) {
        const words = ['Python Full Stack Developer', 'BCA Student', 'Software Builder', 'Quick Learner'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeTarget.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 50;
            } else {
                typeTarget.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 120;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 1500; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500; // Pause before starting next word
            }

            setTimeout(type, delay);
        }

        setTimeout(type, 1000);
    }

    // Interactive Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state for buttons
                filterButtons.forEach(button => button.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Contact Form Submission & Custom Toast Notification
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');

            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(emailInput.value)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Mock successful submit
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';

            setTimeout(() => {
                showToast('Thank you! Your message was sent successfully.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const icon = type === 'success' ? '✅' : '❌';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-msg">${message}</span>
        `;

        document.body.appendChild(toast);

        // Force reflow
        toast.offsetHeight;

        // Add active state
        toast.classList.add('show');

        // Automatically remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // Resume Modal Logic
    const resumeModal = document.getElementById('resume-modal');
    const heroResumeBtn = document.getElementById('hero-resume-btn');
    const navResumeBtn = document.getElementById('nav-resume-btn');
    const navResumeLink = document.getElementById('nav-resume-link');
    const closeResumeBtn = document.getElementById('close-resume-btn');
    const printResumeBtn = document.getElementById('print-resume-btn');
    const resumeOverlay = document.querySelector('.resume-modal-overlay');

    function openResume(e) {
        if (e) e.preventDefault();
        if (resumeModal) {
            resumeModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    function closeResume() {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }

    if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
    if (navResumeBtn) navResumeBtn.addEventListener('click', openResume);
    if (navResumeLink) navResumeLink.addEventListener('click', openResume);
    if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);
    if (resumeOverlay) resumeOverlay.addEventListener('click', closeResume);

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
            closeResume();
        }
    });

    // Print/Save PDF Handler
    if (printResumeBtn) {
        printResumeBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
