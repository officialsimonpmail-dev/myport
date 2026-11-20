document.addEventListener('DOMContentLoaded', () => {
  
  /* -----------------------------------------
     1. Header Scroll Effect
  ----------------------------------------- */
  const header = document.querySelector('.main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case user loads page scrolled down

  /* -----------------------------------------
     2. Mobile Navigation Toggle
  ----------------------------------------- */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    navToggle.classList.toggle('open');
    mobileNavMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  navToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNavMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  /* -----------------------------------------
     3. Typewriter Effect
  ----------------------------------------- */
  const typeWriterElement = document.getElementById('type-writer');
  if (typeWriterElement) {
    const words = JSON.parse(typeWriterElement.getAttribute('data-words'));
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Deleting characters
        typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Delete faster
      } else {
        // Typing characters
        typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Type standard speed
      }

      // Check word completion states
      if (!isDeleting && charIndex === currentWord.length) {
        // Pause at end of word
        typingSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to next word
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(type, typingSpeed);
    };

    // Initiate typewriter
    setTimeout(type, 500);
  }

  /* -----------------------------------------
     4. Intersection Observer: Active Nav & Scroll Reveal
  ----------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.scroll-reveal');

  // Options for scroll spy active nav
  const spyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies mid-viewport
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Parallel sync for mobile menu links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach(section => spyObserver.observe(section));

  // Options for scroll-reveal fade-ins
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealOptions);

  revealElements.forEach(element => revealObserver.observe(element));

  /* -----------------------------------------
     5. Mouse Tracking Interactive Glow Parallax
  ----------------------------------------- */
  const orbs = {
    orb1: document.getElementById('orb-1'),
    orb2: document.getElementById('orb-2'),
    orb3: document.getElementById('orb-3')
  };

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate displacement ratio from viewport center
    const dx = (mouseX - window.innerWidth / 2) / (window.innerWidth / 2);
    const dy = (mouseY - window.innerHeight / 2) / (window.innerHeight / 2);

    // Apply parallax offset to each orb differently
    if (orbs.orb1) {
      orbs.orb1.style.transform = `translate(${dx * 35}px, ${dy * 35}px)`;
    }
    if (orbs.orb2) {
      orbs.orb2.style.transform = `translate(${dx * -45}px, ${dy * -45}px)`;
    }
    if (orbs.orb3) {
      orbs.orb3.style.transform = `translate(${dx * 20}px, ${dy * -20}px)`;
    }
  });

  /* -----------------------------------------
     6. Project Card Filtering
  ----------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterVal = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Transition animation helper
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          const categories = card.getAttribute('data-category').split(' ');
          
          if (filterVal === 'all' || categories.includes(filterVal)) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }, 300); // Match CSS fade animation durations
      });
    });
  });

  /* -----------------------------------------
     7. Contact Form Handling & Validation
  ----------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const statusModal = document.getElementById('form-status-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  // Input elements
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };

  // Helper validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateInput = (input, condition) => {
    if (condition) {
      input.classList.remove('invalid');
      return true;
    } else {
      input.classList.add('invalid');
      return false;
    }
  };

  // Real-time error removal on input edit
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) {
        let isValid = true;
        if (input.id === 'email') {
          isValid = emailRegex.test(input.value.trim());
        } else {
          isValid = input.value.trim().length > 0;
        }
        
        if (isValid) {
          input.classList.remove('invalid');
        }
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation checks
    const isNameValid = validateInput(inputs.name, inputs.name.value.trim().length > 0);
    const isEmailValid = validateInput(inputs.email, emailRegex.test(inputs.email.value.trim()));
    const isSubjectValid = validateInput(inputs.subject, inputs.subject.value.trim().length > 0);
    const isMessageValid = validateInput(inputs.message, inputs.message.value.trim().length > 0);

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (isFormValid) {
      // Mock submit (simulate API call delay)
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText.textContent;
      
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';

      setTimeout(() => {
        // Show success modal
        statusModal.classList.add('show');
        document.body.classList.add('no-scroll');

        // Reset inputs & buttons
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
      }, 1200);
    }
  });

  // Modal Dismissal
  const closeModal = () => {
    statusModal.classList.remove('show');
    document.body.classList.remove('no-scroll');
  };

  closeModalBtn.addEventListener('click', closeModal);
  statusModal.addEventListener('click', (e) => {
    if (e.target === statusModal) {
      closeModal();
    }
  });

});
