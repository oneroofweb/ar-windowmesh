/**
 * AR Window Mesh - Interactive Client Scripts
 * Technology Stack: Bootstrap 5.3 + Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Bootstrap Tooltips / Popovers if any (safe check)
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // 2. Explicit Mobile Offcanvas Toggle Handler (Guaranteed visibility)
  const offcanvasEl = document.getElementById('mobileOffcanvasNav');
  const offcanvasTogglers = document.querySelectorAll('[data-bs-toggle="offcanvas"][data-bs-target="#mobileOffcanvasNav"], .navbar-toggler');
  const offcanvasCloseButtons = document.querySelectorAll('[data-bs-dismiss="offcanvas"]');

  function openMobileMenu() {
    if (!offcanvasEl) return;
    if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      bsOffcanvas.show();
    } else {
      offcanvasEl.classList.add('show');
      offcanvasEl.style.visibility = 'visible';
      document.body.classList.add('overflow-hidden');
      let backdrop = document.querySelector('.custom-offcanvas-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'offcanvas-backdrop fade show custom-offcanvas-backdrop';
        backdrop.style.zIndex = '1055';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', closeMobileMenu);
      }
    }
  }

  function closeMobileMenu() {
    if (!offcanvasEl) return;
    if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
    offcanvasEl.classList.remove('show');
    setTimeout(() => {
      if (!offcanvasEl.classList.contains('show')) {
        offcanvasEl.style.visibility = '';
      }
    }, 280);
    document.body.classList.remove('overflow-hidden');
    const backdrop = document.querySelector('.custom-offcanvas-backdrop');
    if (backdrop) backdrop.remove();
  }

  offcanvasTogglers.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    });
  });

  offcanvasCloseButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileMenu();
    });
  });

  // 3. Smooth Scrolling & Mobile Navbar auto-close
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .nav-link-custom, .offcanvas-nav-item, a[href^="#"]');
  const navbarCollapse = document.getElementById('mainNavbarContent');
  
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile navbar collapse if open
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }

          // Close offcanvas if open
          closeMobileMenu();

          // Smooth scroll to destination with dynamic header offset
          const isMobile = window.innerWidth < 992;
          const headerOffset = isMobile ? 80 : 95;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 3. Inspection Booking Form Handler & WhatsApp Link Generator
  const inspectionForm = document.getElementById('inspection-form');
  const formSuccessMsg = document.getElementById('form-success-msg');
  const whatsappBookingBtn = document.getElementById('whatsapp-booking-btn');

  if (inspectionForm) {
    inspectionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Retrieve form values
      const fullName = document.getElementById('client-name')?.value || 'Customer';
      const phone = document.getElementById('client-phone')?.value || '';
      const location = document.getElementById('client-location')?.value || 'Lucknow / UP';
      const systemType = document.getElementById('client-system')?.value || 'Pleated Mosquito Mesh';
      const notes = document.getElementById('client-notes')?.value || 'None';

      // Show animated success alert
      if (formSuccessMsg) {
        formSuccessMsg.classList.remove('d-none');
        formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Configure direct WhatsApp forwarding button
      if (whatsappBookingBtn) {
        const whatsappText = encodeURIComponent(
          `*New Site Inspection Request*\n` +
          `• *Name:* ${fullName}\n` +
          `• *Phone:* ${phone}\n` +
          `• *Location:* ${location}\n` +
          `• *System Required:* ${systemType}\n` +
          `• *Notes/Dimensions:* ${notes}`
        );
        whatsappBookingBtn.href = `https://wa.me/917007267401?text=${whatsappText}`;
      }

      // Optional: Reset form fields after brief delay
      setTimeout(() => {
        inspectionForm.reset();
      }, 500);
    });
  }

  // 4. Hero Video & YouTube Iframe Intelligent Handler
  const heroIframe = document.getElementById('heroYoutubeIframe');
  const heroFacade = document.getElementById('heroVideoFacade');
  const heroPlayBtn = document.getElementById('hero-video-play-btn');
  const heroContainer = document.getElementById('heroVideoContainer');

  function extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const cleanUrl = url.trim();
    if (!cleanUrl) return null;

    // Detect YouTube ID from standard formats:
    // • https://www.youtube.com/watch?v=VIDEO_ID
    // • https://youtu.be/VIDEO_ID
    // • https://www.youtube.com/embed/VIDEO_ID
    // • https://www.youtube.com/shorts/VIDEO_ID
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = cleanUrl.match(regExp);

    if (match && match[1]) {
      return match[1];
    }
    // Direct 11-char YouTube ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return cleanUrl;
    }
    return null;
  }

  function applyYouTubeVideo(videoUrlOrId, autoPlay = false) {
    if (!heroIframe) return;

    let embedUrl = '';
    if (typeof videoUrlOrId === 'string' && videoUrlOrId.includes('youtube.com/embed/')) {
      embedUrl = videoUrlOrId;
      if (autoPlay && !embedUrl.includes('autoplay=1')) {
        embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
      }
    } else {
      const videoId = extractYouTubeId(videoUrlOrId);
      if (!videoId) return;
      const autoplayParam = autoPlay ? '&autoplay=1' : '';
      embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${autoplayParam}`;
    }

    if (heroIframe.getAttribute('src') !== embedUrl) {
      heroIframe.setAttribute('src', embedUrl);
    }

    if (heroFacade) {
      heroFacade.classList.add('is-hidden');
    }
    if (heroContainer) {
      heroContainer.classList.add('has-video');
    }
  }

  function setupHeroVideo() {
    if (!heroIframe) return;

    // Check if an initial link is inserted in src or data-src
    const currentSrc = heroIframe.getAttribute('src') || heroIframe.getAttribute('data-src') || '';
    const initialVideoId = extractYouTubeId(currentSrc);

    if (initialVideoId) {
      // YouTube link detected: make YouTube iframe visible properly!
      applyYouTubeVideo(currentSrc, false);
    } else {
      // No link inserted: preserve current cover facade exactly as it is
      if (heroFacade) {
        heroFacade.classList.remove('is-hidden');
      }
      if (heroContainer) {
        heroContainer.classList.remove('has-video');
      }
    }

    // Interactive Play button handler
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const src = heroIframe.getAttribute('src') || '';
        const videoId = extractYouTubeId(src);

        if (videoId) {
          // If video already configured, play with autoplay
          applyYouTubeVideo(videoId, true);
        } else {
          // Quick prompt for convenience so user can paste any YouTube link
          const userLink = prompt(
            'Insert YouTube Video Link or ID:\n(e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)',
            ''
          );
          if (userLink) {
            const parsedId = extractYouTubeId(userLink);
            if (parsedId) {
              applyYouTubeVideo(parsedId, true);
            } else {
              alert('Please enter a valid YouTube video URL or ID.');
            }
          }
        }
      });
    }
  }

  setupHeroVideo();

  // 5. Dynamic Header Elevation & Active Nav ScrollSpy for the 5 items
  const mainHeader = document.querySelector('.main-header');
  const sections = [
    { id: 'home', link: '#home' },
    { id: 'about-us', link: '#about-us' },
    { id: 'products-catalog', link: '#products-catalog' },
    { id: 'why-choose-us', link: '#why-choose-us' },
    { id: 'quick-booking', link: '#quick-booking' }
  ];

  window.addEventListener('scroll', function () {
    // Header shadow
    if (window.scrollY > 30) {
      mainHeader.classList.add('shadow-sm');
    } else {
      mainHeader.classList.remove('shadow-sm');
    }

    // ScrollSpy active state
    let currentSectionId = 'home';
    const scrollPos = window.scrollY + 140;

    sections.forEach(function (sec) {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = sec.id;
        }
      }
    });

    // Update desktop and mobile links
    document.querySelectorAll('.nav-link-custom, .offcanvas-nav-item').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  console.log('AR Window Mesh Application Initialized with 5 Navigation Links.');
});
