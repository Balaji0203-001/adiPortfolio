// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Portfolio filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic form validation
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        let isValid = true;

        formInputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // Email validation
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                emailInput.classList.add('error');
                isValid = false;
            }
        }

        // Phone validation
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
            const phonePattern = /^[0-9+\- ]{10,15}$/;
            if (!phonePattern.test(phoneInput.value)) {
                phoneInput.classList.add('error');
                isValid = false;
            }
        }

        if (!isValid) {
            showNotification('Please fill all required fields correctly', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send notification to Telegram
        sendTelegramNotification(data);

        // Show success message
        showNotification('Thank you! We will contact you as soon as possible.', 'success');
        contactForm.reset();
    });
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to send Telegram notification
function sendTelegramNotification(data) {
    const botToken = '7937048364:AAHSugchtDqVT2CkPy07bZ992iLFPq9s7OY'; // Replace with your bot token
    const chatId = '1810053499'; // Replace with your chat ID

    const message = `New Contact Form Submission:\n\nName: ${data.name || 'Not provided'}\nEmail: ${data.email || 'Not provided'}\nPhone: ${data.phone || 'Not provided'}\nService: ${data.service || 'Not selected'}\nMessage: ${data.message || 'No message'}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Telegram notification sent:', result);
    })
    .catch(error => {
        console.error('Error sending Telegram notification:', error);
        showNotification('Could not send your message. Please try again later.', 'error');
    });
}

// Mobile menu toggle (for responsive design)
const mobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuBtn = document.createElement('button');
    menuBtn.classList.add('menu-btn');
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    document.querySelector('.header-content').appendChild(menuBtn);

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');

        if (menuBtn.classList.contains('active')) {
            menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
};

// Initialize mobile menu for smaller screens
if (window.innerWidth <= 768) {
    mobileMenu();
}

// Resize event listener
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !document.querySelector('.menu-btn')) {
        mobileMenu();
    } else if (window.innerWidth > 768 && document.querySelector('.menu-btn')) {
        document.querySelector('.menu-btn').remove();
        document.querySelector('nav').classList.remove('active');
    }
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .package-card, .contact-info, .contact-form');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .portfolio-item, .about-content, .package-card, .contact-info, .contact-form').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            opacity: 0;
            transform: translateY(20px);
            transition: 0.3s ease;
            z-index: 1000;
            max-width: 300px;
        }
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        .notification.success {
            background-color: #28a745;
        }
        .notification.error {
            background-color: #dc3545;
        }
        .form-control.error {
            border: 1px solid #dc3545;
        }
        nav.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #d10054, #8e0041);
            padding: 20px;
        }
        nav.active ul {
            flex-direction: column;
            align-items: center;
        }
        nav.active ul li {
            margin: 10px 0;
        }
        .menu-btn {
            display: none;
            background: transparent;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        @media (max-width: 768px) {
            nav {
                display: none;
            }
            .menu-btn {
                display: block;
            }
        }
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Call animation function on load and scroll
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.src; // Start loading the image
                    imageObserver.unobserve(image);
                }
            });
        });
        
        images.forEach(image => {
            imageObserver.observe(image);
        });
    }
});

// Add automatic copyright year update
document.addEventListener('DOMContentLoaded', () => {
    const copyrightYear = document.querySelector('.footer-bottom p');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2025', currentYear);
    }
});
