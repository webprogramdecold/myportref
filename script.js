/**
 * Accessible Portfolio Site
 * JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
        });
    }
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Set the main to have an id for the skip link
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
        main.setAttribute('tabindex', '-1');
    }
    
    // Handle project detail modals
    setupModals();
    
    // Handle URL parameters for direct navigation to projects
    handleURLParameters();
    
    // Add keyboard navigation for portfolio items
    addKeyboardNavigation();
});

/**
 * Set up modals for project details
 */
function setupModals() {
    const detailBtns = document.querySelectorAll('.details-btn');
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal || !modalTitle || !modalContent) {
        return;
    }
    
    // Open modal when detail button is clicked
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const projectContent = document.getElementById(`project-${projectId}`);
            
            if (projectContent) {
                // Clone the content to show in modal
                const clonedContent = projectContent.cloneNode(true);
                
                // Remove the heading as we'll use it for the modal title
                const heading = clonedContent.querySelector('h2');
                if (heading) {
                    modalTitle.textContent = heading.textContent;
                    heading.remove();
                }
                
                // Clear previous content and add new content
                modalContent.innerHTML = '';
                modalContent.appendChild(clonedContent);
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Set focus to close button
                closeModal.focus();
                
                // Add modal to history so back button works
                const state = { modalOpen: true, projectId: projectId };
                history.pushState(state, '', `?project=${projectId}`);
                
                // Set ARIA attributes
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });
    
    // Close modal functions
    function closeModalFunction() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Return focus to the button that opened it
        const projectId = modalContent.querySelector('.project-detail-content')?.id.replace('project-', '');
        if (projectId) {
            const btn = document.querySelector(`.details-btn[data-project="${projectId}"]`);
            if (btn) {
                btn.focus();
            }
        }
        
        // Update URL
        history.pushState({}, '', window.location.pathname);
        
        // Set ARIA attributes
        modal.setAttribute('aria-hidden', 'true');
    }
    
    // Close modal when X button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunction);
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunction();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
    
    // Handle browser back button
    window.addEventListener('popstate', function() {
        if (modal.style.display === 'block') {
            closeModalFunction();
        } else {
            handleURLParameters();
        }
    });
}

/**
 * Handle URL parameters for direct navigation to projects
 */
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectParam = urlParams.get('project');
    
    if (projectParam) {
        const detailBtn = document.querySelector(`.details-btn[data-project="${projectParam}"]`);
        if (detailBtn) {
            detailBtn.click();
        }
    }
}

/**
 * Add keyboard navigation for portfolio items
 */
function addKeyboardNavigation() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach((item, index) => {
        // Make the entire portfolio item focusable
        item.setAttribute('tabindex', '0');
        
        // Open project details with Enter or Space
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const detailBtn = this.querySelector('.details-btn');
                if (detailBtn) {
                    detailBtn.click();
                }
            }
        });
    });
}

/**
 * Set active navigation based on scroll position
 */
window.addEventListener('scroll', function() {
    // Debounce the scroll event
    if (!window.requestAnimationFrame) {
        return;
    }
    
    const setActiveNav = function() {
        const sections = document.querySelectorAll('section[id]');
        let scrollPosition = window.scrollY + 100; // Adjust for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('#nav-links a').forEach(link => {
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    };
    
    window.requestAnimationFrame(setActiveNav);
}); 