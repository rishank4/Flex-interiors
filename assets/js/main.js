/**
 * Flex Interiors — Architectural Interiors
 * Master Interactive Logic & Dynamic Binding
 * ==========================================================================
 */

(function () {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicConfig();
    initNavbar();
    initMobileDrawer();
    initScrollProgress();
    initBackToTop();
    initScrollReveal();
    initHeroSlider();
    initCounters();
    initPortfolioFilter();
    initLightbox();
    initAccordion();
    initTestimonialsSlider();
    initContactForm();
  });

  /* ==========================================================================
     1. Centralized Config Binding & Business Hours
     ========================================================================== */
  function initDynamicConfig() {
    const config = window.FLEX_CONFIG;
    if (!config) return;

    // Direct phone links
    document.querySelectorAll('[data-config="phone"]').forEach(el => {
      el.textContent = config.contact.phone;
      if (el.tagName === 'A') el.href = `tel:${config.contact.phoneRaw}`;
    });

    // Direct email links
    document.querySelectorAll('[data-config="email"]').forEach(el => {
      el.textContent = config.contact.email;
      if (el.tagName === 'A') el.href = `mailto:${config.contact.email}`;
    });

    // WhatsApp links
    document.querySelectorAll('[data-config="whatsapp"]').forEach(el => {
      el.textContent = config.contact.whatsappDisplay;
      if (el.tagName === 'A') {
        el.href = `https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent("Hello Flex Interiors, I would like to inquire about architectural interior design services.")}`;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    });

    // Full Address
    document.querySelectorAll('[data-config="address"]').forEach(el => {
      el.textContent = config.contact.address.full;
    });

    // Copyright year
    document.querySelectorAll('[data-config="year"]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });

    // Social profiles
    document.querySelectorAll('[data-config-social]').forEach(el => {
      const network = el.getAttribute('data-config-social');
      if (config.socials[network]) {
        el.href = config.socials[network];
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    });

    // Google Maps iframe source & Directions link
    const mapFrame = document.querySelector('[data-config="map-frame"]');
    if (mapFrame && config.contact.googleMapsEmbedUrl) {
      mapFrame.src = config.contact.googleMapsEmbedUrl;
    }
    const directionsLink = document.querySelector('[data-config="directions"]');
    if (directionsLink && config.contact.googleMapsDirectionsUrl) {
      directionsLink.href = config.contact.googleMapsDirectionsUrl;
      directionsLink.target = "_blank";
      directionsLink.rel = "noopener noreferrer";
    }

    // Business Hours highlighting
    highlightBusinessHours(config.businessHours);
  }

  function highlightBusinessHours(hoursList) {
    const hoursContainer = document.querySelector('#business-hours-body');
    const statusPill = document.querySelector('#studio-status-pill');
    if (!hoursContainer || !hoursList) return;

    const now = new Date();
    const currentDayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let html = '';
    let isOpenNow = false;

    hoursList.forEach(item => {
      const isToday = item.dayIndex === currentDayIndex;
      if (isToday) {
        if (item.openMin > 0 && currentMinutes >= item.openMin && currentMinutes < item.closeMin) {
          isOpenNow = true;
        }
      }
      html += `
        <tr class="${isToday ? 'is-today' : ''}" data-day="${item.dayIndex}">
          <td>${item.day}</td>
          <td>${item.hours}</td>
        </tr>
      `;
    });

    hoursContainer.innerHTML = html;

    if (statusPill) {
      if (isOpenNow) {
        statusPill.className = 'status-pill open';
        statusPill.innerHTML = '● Open Now';
      } else {
        statusPill.className = 'status-pill closed';
        statusPill.innerHTML = '○ Studio Closed';
      }
    }
  }

  /* ==========================================================================
     2. Smart Navbar & Active Link
     ========================================================================== */
  function initNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 80;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      // Add blurred background on scroll
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide on scroll down, show on scroll up
      if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
          header.classList.add('header-hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
          header.classList.remove('header-hidden');
        }
      } else {
        header.classList.remove('header-hidden');
      }

      lastScroll = Math.max(0, currentScroll);
    }, { passive: true });

    // Active page highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     3. Full-screen Mobile Drawer
     ========================================================================== */
  function initMobileDrawer() {
    const menuToggle = document.querySelector('.menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    if (!menuToggle || !drawer) return;

    function openDrawer() {
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      document.body.classList.add('drawer-open');
    }

    function closeDrawer() {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      document.body.classList.remove('drawer-open');
    }

    menuToggle.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close on link click
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close if window is resized past 1024px
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /* ==========================================================================
     4. Scroll Progress & Back to Top
     ========================================================================== */
  function initScrollProgress() {
    const progressBar = document.querySelector('#scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  function initBackToTop() {
    const topBtn = document.querySelector('#back-to-top');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 450) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
    }, { passive: true });

    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-up');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add('in-view'));
    }
  }

  /* ==========================================================================
     6. Home Hero Ken Burns Slider
     ========================================================================== */
  function initHeroSlider() {
    const slider = document.querySelector('.hero-slider-section');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prevBtn = slider.querySelector('.hero-prev');
    const nextBtn = slider.querySelector('.hero-next');

    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;
    const intervalTime = 6500;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, intervalTime);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startTimer();
      });
    });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    // Initial start
    startTimer();
  }

  /* ==========================================================================
     7. Animated Metric Counters
     ========================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (!counters.length) return;

    let animated = false;

    function runCounters() {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * target);
          counter.textContent = `${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = `${target}${suffix}`;
          }
        }

        requestAnimationFrame(update);
      });
    }

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
          animated = true;
          runCounters();
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(statsBar);
    } else {
      runCounters();
    }
  }

  /* ==========================================================================
     8. Portfolio Filter & URL Hash Sync
     ========================================================================== */
  function initPortfolioFilter() {
    const filterContainer = document.querySelector('.portfolio-filters');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterContainer || !projectCards.length) return;

    const filterBtns = filterContainer.querySelectorAll('.filter-btn');

    // Calculate real-time counts
    const counts = { all: projectCards.length };
    projectCards.forEach(card => {
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      counts[category] = (counts[category] || 0) + 1;
    });

    filterBtns.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const countEl = btn.querySelector('.filter-count');
      if (countEl && counts[filter] !== undefined) {
        countEl.textContent = `(${counts[filter]})`;
      }
    });

    function applyFilter(category) {
      filterBtns.forEach(btn => {
        const match = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('active', match);
      });

      projectCards.forEach(card => {
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        applyFilter(cat);
        // Sync URL Hash
        if (cat === 'all') {
          history.replaceState(null, '', window.location.pathname);
        } else {
          window.location.hash = cat;
        }
      });
    });

    // Check URL hash on load
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && counts[hash]) {
      applyFilter(hash);
    } else {
      applyFilter('all');
    }
  }

  /* ==========================================================================
     9. Interactive Accessible Lightbox
     ========================================================================== */
  function initLightbox() {
    const lightbox = document.querySelector('#lightbox-modal');
    const triggers = document.querySelectorAll('[data-lightbox]');
    if (!lightbox || !triggers.length) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxMeta = lightbox.querySelector('.lightbox-meta');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Build project array from visible triggers
    let projects = [];
    let currentIndex = 0;

    function buildProjectList() {
      projects = [];
      triggers.forEach(card => {
        if (card.style.display !== 'none') {
          const img = card.querySelector('img');
          const title = card.querySelector('.project-title')?.textContent || 'Architectural Project';
          const cat = card.querySelector('.project-category')?.textContent || '';
          const loc = card.querySelector('.project-location')?.textContent || '';
          projects.push({
            src: card.getAttribute('data-full-img') || img?.src || '',
            alt: img?.alt || title,
            title: title,
            meta: `${cat} — ${loc}`
          });
        }
      });
    }

    function openLightbox(index) {
      buildProjectList();
      if (!projects[index]) return;
      currentIndex = index;
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function updateLightboxContent() {
      const item = projects[currentIndex];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxTitle.textContent = item.title;
      lightboxMeta.textContent = item.meta;
    }

    function nextProject() {
      if (!projects.length) return;
      currentIndex = (currentIndex + 1) % projects.length;
      updateLightboxContent();
    }

    function prevProject() {
      if (!projects.length) return;
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      updateLightboxContent();
    }

    triggers.forEach((card) => {
      card.addEventListener('click', () => {
        buildProjectList();
        const clickedSrc = card.getAttribute('data-full-img') || card.querySelector('img')?.src;
        const index = projects.findIndex(p => p.src === clickedSrc);
        openLightbox(index >= 0 ? index : 0);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextProject);
    prevBtn.addEventListener('click', prevProject);

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextProject();
      if (e.key === 'ArrowLeft') prevProject();
    });
  }

  /* ==========================================================================
     10. FAQ Accordion
     ========================================================================== */
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        accordionItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBody = other.querySelector('.accordion-body');
            if (otherBody) otherBody.style.maxHeight = null;
            other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          body.style.maxHeight = `${body.scrollHeight + 30}px`;
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ==========================================================================
     11. Testimonials Carousel
     ========================================================================== */
  function initTestimonialsSlider() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = carousel.querySelectorAll('.testimonial-dot');
    const prevBtn = carousel.querySelector('.testimonial-prev');
    const nextBtn = carousel.querySelector('.testimonial-next');
    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function next() {
      showSlide((currentIndex + 1) % slides.length);
    }

    function prev() {
      showSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    function start() {
      stop();
      timer = setInterval(next, 7000);
    }

    function stop() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    start();
  }

  /* ==========================================================================
     12. Contact Form & Multi-Channel Delivery
     ========================================================================== */
  function initContactForm() {
    const form = document.querySelector('#consultation-form');
    if (!form) return;

    const config = window.FLEX_CONFIG || {};

    // 1. Service pre-selection from URL parameter "?service=..."
    const urlParams = new URLSearchParams(window.location.search);
    const requestedService = urlParams.get('service');
    const serviceInput = form.querySelector('#selected-service-input');
    const serviceChips = form.querySelectorAll('.service-chip');

    if (requestedService && serviceChips.length) {
      const match = Array.from(serviceChips).find(chip =>
        chip.getAttribute('data-value').toLowerCase() === requestedService.toLowerCase() ||
        chip.textContent.trim().toLowerCase() === requestedService.toLowerCase()
      );
      if (match) {
        match.classList.add('selected');
        if (serviceInput) serviceInput.value = match.getAttribute('data-value');
      }
    }

    // Chip click handler
    serviceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        serviceChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (serviceInput) {
          serviceInput.value = chip.getAttribute('data-value');
        }
      });
    });

    // 2. Input elements
    const nameInput = form.querySelector('#client-name');
    const phoneInput = form.querySelector('#client-phone');
    const emailInput = form.querySelector('#client-email');
    const messageInput = form.querySelector('#client-message');
    const consentInput = form.querySelector('#client-consent');
    const honeypotInput = form.querySelector('#hp-check');
    const submitBtn = form.querySelector('#form-submit-btn');
    const whatsappBtn = form.querySelector('#whatsapp-submit-btn');
    const notificationBox = document.querySelector('#form-notification');

    // Helper: validate fields
    function validateForm() {
      let isValid = true;
      let firstErrorField = null;

      function setError(input, condition) {
        if (condition) {
          input.classList.add('has-error');
          isValid = false;
          if (!firstErrorField) firstErrorField = input;
        } else {
          input.classList.remove('has-error');
        }
      }

      // Name >= 2 chars
      setError(nameInput, !nameInput.value.trim() || nameInput.value.trim().length < 2);

      // Phone 8 to 15 digits
      const phoneClean = phoneInput.value.replace(/[\s\-\(\)\+]/g, '');
      setError(phoneInput, !/^\d{8,15}$/.test(phoneClean));

      // Email valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setError(emailInput, !emailRegex.test(emailInput.value.trim()));

      // Message >= 10 chars
      setError(messageInput, !messageInput.value.trim() || messageInput.value.trim().length < 10);

      // Consent
      if (consentInput && !consentInput.checked) {
        consentInput.classList.add('has-error');
        isValid = false;
        if (!firstErrorField) firstErrorField = consentInput;
      } else if (consentInput) {
        consentInput.classList.remove('has-error');
      }

      if (firstErrorField) {
        firstErrorField.focus();
      }

      return isValid;
    }

    // Helper: collect form payload
    function getFormPayload() {
      const selectedMode = form.querySelector('input[name="preferredContact"]:checked')?.value || 'WhatsApp';
      const projectType = form.querySelector('#project-type')?.value || 'Not specified';
      const budget = form.querySelector('#project-budget')?.value || 'Not specified';
      const timeline = form.querySelector('#project-timeline')?.value || 'Not specified';

      return {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        service: serviceInput ? serviceInput.value : 'General Architectural Consultation',
        projectType: projectType,
        budget: budget,
        timeline: timeline,
        preferredContact: selectedMode,
        message: messageInput.value.trim()
      };
    }

    // 3. Direct "Send via WhatsApp" Button Handler
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = getFormPayload();
        const waNumber = config.contact ? config.contact.whatsappNumber : '15553894200';

        const waText =
`*New Consultation Request — Flex Interiors*
---------------------------------------
*Client:* ${data.name}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Service:* ${data.service}
*Project Type:* ${data.projectType}
*Budget:* ${data.budget}
*Preferred Start:* ${data.timeline}
*Preferred Contact:* ${data.preferredContact}

*Project Brief:*
${data.message}`;

        const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }

    // 4. FormSubmit AJAX Delivery + Fallback
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot spam check
      if (honeypotInput && honeypotInput.value.trim() !== '') {
        console.warn('Spam submission detected and stopped.');
        return;
      }

      if (!validateForm()) return;

      const data = getFormPayload();
      const endpoint = (config.form && config.form.endpoint) ? config.form.endpoint : 'https://formsubmit.co/ajax/concierge@flexinteriors.com';
      const recipient = (config.form && config.form.recipientEmail) ? config.form.recipientEmail : 'concierge@flexinteriors.com';
      const timeoutMs = (config.form && config.form.timeoutMs) || 12000;

      // Loading state
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting Request...';

      // Abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Interior Project Consultation: ${data.name}`,
            _template: 'table',
            _captcha: 'false',
            "Full Name": data.name,
            "Phone / WhatsApp": data.phone,
            "Email Address": data.email,
            "Selected Service": data.service,
            "Project Type": data.projectType,
            "Estimated Budget": data.budget,
            "Timeline": data.timeline,
            "Preferred Contact": data.preferredContact,
            "Project Brief": data.message
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // Success
          showSuccessNotification(data.name);
          form.reset();
          serviceChips.forEach(c => c.classList.remove('selected'));
          if (serviceInput) serviceInput.value = '';
        } else {
          throw new Error('Server returned non-200 status');
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Submission failed or timed out:', err);
        showFallbackNotification(data, recipient);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });

    function showSuccessNotification(clientName) {
      if (!notificationBox) return;
      const firstName = clientName.split(' ')[0] || 'Client';
      notificationBox.className = 'form-notification success';
      notificationBox.innerHTML = `
        <h4 style="color: #1B5E20; margin-bottom: 8px;">Thank You, ${firstName}.</h4>
        <p style="color: #2E7D32; font-size: 14px;">Your project consultation request has been received. Our principal design team will review your architectural brief and contact you within 24 business hours.</p>
      `;
      notificationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showFallbackNotification(data, recipient) {
      if (!notificationBox) return;

      const subject = encodeURIComponent(`Inquiry from ${data.name}: ${data.service}`);
      const body = encodeURIComponent(
`Full Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Service: ${data.service}
Project Type: ${data.projectType}
Budget: ${data.budget}
Timeline: ${data.timeline}

Project Brief:
${data.message}`
      );
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      notificationBox.className = 'form-notification error';
      notificationBox.innerHTML = `
        <h4 style="color: #B71C1C; margin-bottom: 8px;">Direct Transmission Backup</h4>
        <p style="color: #C62828; font-size: 14px; margin-bottom: 12px;">We encountered a network delay sending directly from the browser. Your brief has been prepared for dispatch.</p>
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary" style="margin-right: 10px;">Send via Email Client</a>
        <a href="https://wa.me/${config.contact?.whatsappNumber || '15553894200'}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">Send via WhatsApp</a>
      `;
      notificationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Automatically trigger mailto fallback
      window.location.href = mailtoUrl;
    }
  }

})();

