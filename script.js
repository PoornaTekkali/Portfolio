emailjs.init("6L-UNvFYBvQr5IIva"); 

const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;
let menuOpen = false;

const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

menuBtn.addEventListener('click', () => {
    if(!menuOpen) {
        menuBtn.classList.add('open');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        
        if (window.matchMedia('(max-width: 768px)').matches) {
            body.style.overflow = 'hidden';
            navMenu.style.overflowY = 'auto';
            navMenu.style.maxHeight = 'calc(100vh - 60px)';
        }
        
        menuOpen = true;
    } else {
        closeMenu();
    }
});

function closeMenu() {
    menuBtn.classList.remove('open');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = '';
    menuOpen = false;
}

overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

function preventZoom(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}

function fixViewportMeta() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    } else {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewportMeta);
    }
}

function toggleTab(element, tabId) {
    const tabContainer = element.closest('.tab-container');
    const allTabLinks = tabContainer.querySelectorAll('.tab-link');
    const allTabContents = tabContainer.querySelectorAll('.tab-content');
    const isActive = element.classList.contains('active');
    
    allTabLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    allTabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    if (!isActive) {
        element.classList.add('active');
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
        }
    }
}

function activateTabBySection(sectionName) {
    const tabLink = document.querySelector(`.tab-link[data-tab="${sectionName}"]`);
    
    if (tabLink) {
        const tabId = tabLink.getAttribute('data-content-id');
        
        if (tabId) {
            const tabContainer = tabLink.closest('.tab-container');
            if (tabContainer) {
                const allTabLinks = tabContainer.querySelectorAll('.tab-link');
                const allTabContents = tabContainer.querySelectorAll('.tab-content');
                
                allTabLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                allTabContents.forEach(content => {
                    content.style.display = 'none';
                });
            }
            
            tabLink.classList.add('active');
            const selectedContent = document.getElementById(tabId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
            }
        }
    }
}

function setupHeaderNavigation() {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            const targetSection = href.split('#')[1];
            
            if (targetSection) {
                const sectionElement = document.getElementById(targetSection);
                if (sectionElement) {
                    sectionElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
            
            const tabSection = this.getAttribute('data-section');
            if (tabSection) {
                setTimeout(() => {
                    activateTabBySection(tabSection);
                }, 500);
            }
        });
    });
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section, div[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            if (!section.getAttribute('id')) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function handleSubmit(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    emailjs.send('service_dfz2aeo', 'template_9thkbbp', templateParams)
        .then(function(response) {
            formStatus.textContent = "Thank you for your message! I will get back to you soon.";
            formStatus.className = "form-status success";
            event.target.reset();
        }, function(error) {
            formStatus.textContent = "Sorry, there was an error sending your message. Please try again.";
            formStatus.className = "form-status error";
            console.log('EmailJS error:', error);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        });
    
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Create certificate modal
    const certModal = document.createElement('div');
    certModal.id = 'certificate-modal';
    certModal.innerHTML = `
        <div class="certificate-modal-wrapper">
            <div class="certificate-modal-close">&times;</div>
            <div class="certificate-modal-content">
                <img class="certificate-modal-image" src="" alt="Certificate">
            </div>
        </div>
    `;
    document.body.appendChild(certModal);

    // Select elements
    const modal = document.getElementById('certificate-modal');
    const modalClose = modal.querySelector('.certificate-modal-close');
    const modalImage = modal.querySelector('.certificate-modal-image');
    const modalWrapper = modal.querySelector('.certificate-modal-wrapper');

    // Get all certificate images
    const certImages = document.querySelectorAll('.certifications-grid img');

    // Function to open modal
    function openModal(imgSrc, imgAlt) {
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt;
        modal.style.display = 'flex';
        
        // Slight delay to ensure transition works
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        
        // Wait for transition before hiding
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Add click event to each certificate image
    certImages.forEach(img => {
        img.addEventListener('click', function() {
            openModal(this.src, this.alt);
        });
    });

    // Close modal when clicking close button
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Prevent modal close when clicking on image or close button
    modalWrapper.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});