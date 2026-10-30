document.addEventListener('DOMContentLoaded', () => {

  // --- Fix Horizontal Scroll: clamp any element wider than viewport ---
  // This runs once on load and catches any overflow CSS missed
  const fixOverflow = () => {
    const docWidth = document.documentElement.offsetWidth;
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      // Skip fixed/absolute positioned elements (they don't cause scroll)
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'absolute') return;
      if (rect.right > docWidth + 2) {
        el.style.maxWidth = '100%';
        el.style.overflowX = 'hidden';
      }
    });
  };
  fixOverflow();
  // --- Scroll Reveal Animations (Intersection Observer) ---
  // Inject reveal classes dynamically to avoid bulk HTML modifications
  document.querySelectorAll('section .section-header').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.services-grid > .service-card').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 3;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
  document.querySelectorAll('.portfolio-grid > .portfolio-card').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 3;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
  document.querySelectorAll('.guarantees-grid > .guarantee-card').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 3;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
  document.querySelectorAll('.timeline-item').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.contact-details > .detail-item').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 2;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
  document.querySelectorAll('.contact-info, .contact-form-panel').forEach((el, idx) => {
    el.classList.add('reveal');
    if (idx > 0) el.classList.add('reveal-delay-1');
  });
  document.querySelectorAll('.testimonials-grid > .testimonial-card').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 3;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });
  document.querySelectorAll('.stats-grid > .stat-card').forEach((el, idx) => {
    el.classList.add('reveal');
    const delay = idx % 4;
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Header Scroll Effect & Navigation Highlight ---
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Scroll header styling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy active link updater
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 160)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- Mobile Navigation Full-Screen Overlay ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-links');
  const navBackdrop = document.getElementById('nav-backdrop');

  function openNav() {
    navMenu.classList.add('active');
    menuToggle.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeNav() {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = ''; // unlock scroll
  }

  menuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) closeNav();
    else openNav();
  });

  // Click backdrop to close
  if (navBackdrop) navBackdrop.addEventListener('click', closeNav);

  // Close when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // --- Background Hover Cursor Glow ---
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorGlow) {
    if (window.innerWidth > 1024) {
      cursorGlow.style.display = 'block';
    } else {
      cursorGlow.style.display = 'none';
    }
  }

  document.addEventListener('mousemove', (e) => {
    if (cursorGlow && window.innerWidth > 1024) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }
  });
  // --- Background Hover Cursor Glow & SVG Cat Follower ---
  const cursorCat = document.getElementById('cursor-cat');
  const pupilLeft = document.getElementById('cat-pupil-left');
  const pupilRight = document.getElementById('cat-pupil-right');

  // Initialize display states
  if (window.innerWidth > 1024) {
    if (cursorGlow) cursorGlow.style.display = 'block';
    if (cursorCat) cursorCat.style.display = 'block';
  } else {
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (cursorCat) {
      cursorCat.style.display = 'block';
      cursorCat.style.opacity = '1';
    }
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let catX = mouseX;
  let catY = mouseY;
  const speed = 0.07;
  let firstMove = true;
  let isRunning = false;
  let runTimeout = null;

  // Mobile random wandering variables
  let mobileTargetX = window.innerWidth / 2;
  let mobileTargetY = window.innerHeight / 2;
  let isWandering = false;
  let wanderTimeout = null;

  const chooseNewWanderTarget = () => {
    if (window.innerWidth <= 1024) {
      // Pick a random target within viewport, keeping margin from edges (e.g. 15%)
      const marginX = window.innerWidth * 0.15;
      const marginY = window.innerHeight * 0.15;
      mobileTargetX = marginX + Math.random() * (window.innerWidth - 2 * marginX);
      mobileTargetY = marginY + Math.random() * (window.innerHeight - 2 * marginY);
      isWandering = true;
      if (cursorCat) cursorCat.classList.add('running');
    }
  };

  // Start wandering on mobile
  if (window.innerWidth <= 1024) {
    chooseNewWanderTarget();
  }

  // Global move/touch updates
  const updateCoordinates = (clientX, clientY) => {
    mouseX = clientX;
    mouseY = clientY;

    if (firstMove) {
      catX = mouseX;
      catY = mouseY;
      firstMove = false;
      if (cursorCat) cursorCat.style.opacity = '1';
    }
  };

  document.addEventListener('mousemove', (e) => {
    updateCoordinates(e.clientX, e.clientY);

    if (cursorGlow && window.innerWidth > 1024) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    if (window.innerWidth > 1024) {
      if (!isRunning) {
        isRunning = true;
        if (cursorCat) cursorCat.classList.add('running');
      }
      clearTimeout(runTimeout);
      runTimeout = setTimeout(() => {
        isRunning = false;
        if (cursorCat) cursorCat.classList.remove('running');
      }, 150);
    }
  });

  // Touch event listeners for mobile cat control
  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      if (window.innerWidth <= 1024) {
        mobileTargetX = e.touches[0].clientX;
        mobileTargetY = e.touches[0].clientY;
        isWandering = true;
        if (cursorCat) cursorCat.classList.add('running');
        clearTimeout(wanderTimeout);
      }
    }
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      if (window.innerWidth <= 1024) {
        mobileTargetX = e.touches[0].clientX;
        mobileTargetY = e.touches[0].clientY;
        isWandering = true;
        if (cursorCat) cursorCat.classList.add('running');
        clearTimeout(wanderTimeout);
      }
    }
  }, { passive: true });

  function animateCat() {
    if (window.innerWidth > 1024) {
      const dx = mouseX - catX;
      const dy = mouseY - catY;

      catX += dx * speed;
      catY += dy * speed;

      if (cursorCat) {
        cursorCat.style.left = `${catX}px`;
        cursorCat.style.top = `${catY}px`;

        // Face direction of movement
        if (dx > 2) {
          cursorCat.style.transform = 'translate(-50%, -50%) scaleX(1)';
        } else if (dx < -2) {
          cursorCat.style.transform = 'translate(-50%, -50%) scaleX(-1)';
        }

        if (pupilLeft && pupilRight) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const nx = (dx / dist) * 1.2;
            const ny = (dy / dist) * 1.0;
            pupilLeft.setAttribute('cx', 22.5 + nx);
            pupilLeft.setAttribute('cy', 23.5 + ny);
            pupilRight.setAttribute('cx', 32.5 + nx);
            pupilRight.setAttribute('cy', 23.5 + ny);
          } else {
            pupilLeft.setAttribute('cx', 22.5);
            pupilLeft.setAttribute('cy', 23.5);
            pupilRight.setAttribute('cx', 32.5);
            pupilRight.setAttribute('cy', 23.5);
          }
        }
      }
    } else {
      // Mobile random wandering interpolation
      if (isWandering) {
        const dx = mobileTargetX - catX;
        const dy = mobileTargetY - catY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Face direction on mobile
        if (dx > 2) {
          cursorCat.style.transform = 'translate(-50%, -50%) scaleX(1)';
        } else if (dx < -2) {
          cursorCat.style.transform = 'translate(-50%, -50%) scaleX(-1)';
        }

        // Slower walk speed on mobile
        const walkSpeed = 0.025;
        catX += dx * walkSpeed;
        catY += dy * walkSpeed;

        if (cursorCat) {
          cursorCat.style.left = `${catX}px`;
          cursorCat.style.top = `${catY}px`;
        }

        // Keep pupils looking toward target on mobile
        if (pupilLeft && pupilRight && dist > 5) {
          const nx = (dx / dist) * 0.8;
          const ny = (dy / dist) * 0.7;
          pupilLeft.setAttribute('cx', 22.5 + nx);
          pupilLeft.setAttribute('cy', 23.5 + ny);
          pupilRight.setAttribute('cx', 32.5 + nx);
          pupilRight.setAttribute('cy', 23.5 + ny);
        }

        // If target reached on mobile
        if (dist < 10) {
          isWandering = false;
          if (cursorCat) cursorCat.classList.remove('running');
          
          // Wait random time (2 to 4 seconds) then wander again
          clearTimeout(wanderTimeout);
          wanderTimeout = setTimeout(() => {
            chooseNewWanderTarget();
          }, 2000 + Math.random() * 2000);
        }
      } else {
        // If resting, look towards last touched position
        if (pupilLeft && pupilRight && cursorCat) {
          const dx = mouseX - catX;
          const dy = mouseY - catY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 15) {
            const nx = (dx / dist) * 1.2;
            const ny = (dy / dist) * 1.0;
            pupilLeft.setAttribute('cx', 22.5 + nx);
            pupilLeft.setAttribute('cy', 23.5 + ny);
            pupilRight.setAttribute('cx', 32.5 + nx);
            pupilRight.setAttribute('cy', 23.5 + ny);
          } else {
            pupilLeft.setAttribute('cx', 22.5);
            pupilLeft.setAttribute('cy', 23.5);
            pupilRight.setAttribute('cx', 32.5);
            pupilRight.setAttribute('cy', 23.5);
          }
        }
      }
    }

    requestAnimationFrame(animateCat);
  }

  requestAnimationFrame(animateCat);
  // --- Interactive Tech Stack Details ---
  const stackItems = document.querySelectorAll('.stack-item');
  const detailsBox = document.getElementById('tech-details-box');
  const detailsTitle = document.getElementById('tech-details-title');
  const detailsDesc = document.getElementById('tech-details-desc');

  const techData = {
    figma: {
      title: "Figma (UI/UX & Design Systems)",
      desc: "I design complete, responsive website layouts, application dashboards, brand style guides, and click-through wireframes in Figma first. This lets you inspect and approve visual elements before I write a single line of code, reducing project revisions."
    },
    photoshop: {
      title: "Adobe Photoshop (Graphic Assets)",
      desc: "I use Photoshop to create high-resolution marketing banners, social media posters, flyer templates, and raster modifications. This gives your branding mockups a high-fidelity look that is ready for both digital publish and physical print."
    },
    illustrator: {
      title: "Adobe Illustrator (Vector Branding)",
      desc: "I design scalable logos, vector business card graphics, corporate letterheads, and print layouts in Illustrator. Since vectors are resolution-independent, your designs will remain perfectly sharp and clear from small mobile icons to billboard sizes."
    },
    javascript: {
      title: "JavaScript ES6+ (Frontend Interactivity)",
      desc: "I write vanilla, modern JavaScript to build interactive widgets, multi-step calculation engines (like the project cost estimator below), modal overlays, and smooth event listeners. This results in clean, fast load times without bulky frame dependencies."
    },
    css: {
      title: "CSS3 & Responsive Design Systems",
      desc: "I construct design systems using CSS Variables, Flexbox, and Grid for pixel-perfect layouts. I also design responsive media queries so your site looks spectacular on all screen widths, from small mobile screens to large desktop monitors."
    },
    ai: {
      title: "Generative AI Media & Content Decks",
      desc: "I harness advanced AI models to generate marketing video scripts, edit cinematic media clips, generate custom design themes, and outline academic assignments. I also design corporate slides, pitches, and academic presentation decks."
    },
    wordpress: {
      title: "WordPress (CMS Development)",
      desc: "I develop custom WordPress sites, configure plugins (WooCommerce for e-commerce, Elementor/Divi for page layout styling), manage hosting migrations, and implement SEO dashboards. This is ideal for businesses that want a fully editable dashboard to manage content independently."
    }
  };

  stackItems.forEach(item => {
    item.addEventListener('click', () => {
      const tech = item.getAttribute('data-tech');
      const data = techData[tech];
      
      if (data) {
        // Remove active class from all other items and add to clicked
        stackItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Smooth text change effect: quick fade-out, update text, fade-in
        detailsBox.style.opacity = '0.3';
        detailsBox.style.transform = 'translateY(5px)';
        
        setTimeout(() => {
          detailsTitle.innerText = data.title;
          detailsDesc.innerText = data.desc;
          
          // Apply custom accent color highlight based on tech profiles
          if (tech === 'figma') detailsTitle.style.color = '#ff7262';
          else if (tech === 'photoshop') detailsTitle.style.color = '#31a8ff';
          else if (tech === 'illustrator') detailsTitle.style.color = '#ff9a00';
          else if (tech === 'javascript') detailsTitle.style.color = '#f7df1e';
          else if (tech === 'css') detailsTitle.style.color = '#1572b6';
          else if (tech === 'ai') detailsTitle.style.color = 'var(--secondary)';
          else if (tech === 'wordpress') detailsTitle.style.color = '#21759b';
          
          detailsBox.style.opacity = '1';
          detailsBox.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });

  // --- Portfolio Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(button => button.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Portfolio Lightbox / Modal Image Viewer ---
  const modal = document.getElementById('portfolio-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('modal-close');
  const imgContainers = document.querySelectorAll('.portfolio-img-container');

  imgContainers.forEach(container => {
    container.addEventListener('click', () => {
      const img = container.querySelector('img');
      if (img) {
        modalImg.src = img.getAttribute('src');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
    }, 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });



  // --- Contact Form → WhatsApp Integration ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();

    // Build a clean WhatsApp message
    const waText =
      `👋 *New Project Inquiry*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Service:* ${service}\n\n` +
      `*Message:*\n${message}`;

    // Encode and open WhatsApp
    const waNumber = '923146813808'; // +92 326 1055329
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    // Show success toast
    toast.classList.add('show');
    contactForm.reset();
    setTimeout(() => toast.classList.remove('show'), 4000);

    // Open WhatsApp in new tab after brief delay (so user sees toast)
    setTimeout(() => window.open(waUrl, '_blank'), 600);
  });

  // --- Dynamic Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number');
  const countSpeed = 80; // Speed factor (higher is slower)

  const countUp = (el) => {
    const target = +el.getAttribute('data-target');
    const hasPercent = el.getAttribute('data-percent') === 'true';
    let current = 0;
    
    // Clear initial state
    el.innerText = '0';

    const updateVal = () => {
      const increment = target / countSpeed;
      if (current < target) {
        current += increment;
        el.innerText = Math.ceil(current);
        setTimeout(updateVal, 20);
      } else {
        el.innerText = target + (hasPercent ? '%' : '+');
      }
    };
    updateVal();
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // Count once
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => statsObserver.observe(stat));

  // --- Submit Review Form Interaction ---
  const writeReviewBtn = document.getElementById('write-review-btn');
  const reviewPanel = document.getElementById('review-form-panel');
  const reviewForm = document.getElementById('review-submit-form');
  const testimonialsGrid = document.querySelector('.testimonials-grid');

  if (writeReviewBtn && reviewPanel) {
    writeReviewBtn.addEventListener('click', () => {
      if (reviewPanel.style.display === 'none' || !reviewPanel.style.display) {
        reviewPanel.style.display = 'block';
        setTimeout(() => {
          reviewPanel.style.transform = 'translateY(0)';
          reviewPanel.style.opacity = '1';
        }, 10);
        writeReviewBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Close Review Form
        `;
      } else {
        reviewPanel.style.transform = 'translateY(20px)';
        reviewPanel.style.opacity = '0';
        setTimeout(() => {
          reviewPanel.style.display = 'none';
        }, 400);
        writeReviewBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Write a Review
        `;
      }
    });
  }

  const appendReviewToGrid = (review) => {
    const starString = '⭐'.repeat(review.rating);
    const cardHtml = `
      <div class="testimonial-card glass-panel reveal active">
        <div class="stars">${starString}</div>
        <p class="testimonial-text">${review.text}</p>
        <div class="client-info">
          <h4 class="client-name">${review.name}</h4>
          <span class="client-role">${review.role}</span>
        </div>
      </div>
    `;
    if (testimonialsGrid) {
      testimonialsGrid.insertAdjacentHTML('beforeend', cardHtml);
    }
  };

  // --- Admin Mode and Review Management ---
  let isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  const checkAdminStatus = () => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
    updateDeleteButtons();
  };

  const showToast = (title, msg) => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.querySelector('div:first-child').innerText = title;
      toast.querySelector('div:last-child').innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  };

  // Toggle Admin Mode by double clicking the TAD Crown Logo
  const logoImg = document.querySelector('.logo');
  if (logoImg) {
    logoImg.addEventListener('dblclick', () => {
      if (isAdmin) {
        isAdmin = false;
        sessionStorage.removeItem('isAdmin');
        checkAdminStatus();
        showToast("Admin Mode Deactivated", "Review delete options are now locked.");
      } else {
        const pass = prompt("Enter admin passcode to manage reviews:");
        if (pass === 'tahri@tt41') {
          isAdmin = true;
          sessionStorage.setItem('isAdmin', 'true');
          checkAdminStatus();
          showToast("Admin Mode Activated", "You can now delete reviews using the trash icon.");
        } else if (pass !== null) {
          alert("Incorrect passcode!");
        }
      }
    });
  }

  const getDeletedStaticIndexes = () => {
    const data = localStorage.getItem('deleted-static-reviews');
    return data ? JSON.parse(data) : [];
  };

  const deleteReview = (card) => {
    const index = card.getAttribute('data-index');
    if (index !== null) {
      // Deleting a static review
      const idx = parseInt(index);
      const deletedList = getDeletedStaticIndexes();
      deletedList.push(idx);
      localStorage.setItem('deleted-static-reviews', JSON.stringify(deletedList));
    } else {
      // Deleting a user-submitted review
      const name = card.querySelector('.client-name').innerText.trim();
      const text = card.querySelector('.testimonial-text').innerText.trim();
      const saved = localStorage.getItem('client-reviews');
      if (saved) {
        let reviews = JSON.parse(saved);
        reviews = reviews.filter(r => !(r.name === name && r.text === text));
        localStorage.setItem('client-reviews', JSON.stringify(reviews));
      }
    }

    card.remove();
    showToast("Review Deleted", "The review was permanently deleted from the layout.");
    updateReviewVisibility();
  };

  const updateDeleteButtons = () => {
    document.querySelectorAll('.testimonial-card').forEach(card => {
      if (!card.querySelector('.delete-review-btn')) {
        const btn = document.createElement('button');
        btn.className = 'delete-review-btn';
        btn.innerHTML = '🗑️';
        btn.title = 'Delete Review';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm("Are you sure you want to delete this review?")) {
            deleteReview(card);
          }
        });
        card.appendChild(btn);
      }
    });
  };

  const updateReviewVisibility = () => {
    const cards = document.querySelectorAll('.testimonial-card');
    const limit = 3;
    const moreBtnContainer = document.getElementById('more-reviews-btn-container');
    const moreBtn = document.getElementById('more-reviews-btn');

    if (cards.length > limit) {
      if (moreBtnContainer) moreBtnContainer.style.display = 'block';
      const isExpanded = moreBtn ? moreBtn.getAttribute('data-expanded') === 'true' : false;

      cards.forEach((card, idx) => {
        if (idx >= limit) {
          card.style.display = isExpanded ? 'flex' : 'none';
        } else {
          card.style.display = 'flex';
        }
      });
    } else {
      if (moreBtnContainer) moreBtnContainer.style.display = 'none';
      cards.forEach(card => card.style.display = 'flex');
    }
  };

  // View More / View Less Toggle Button
  const moreReviewsBtn = document.getElementById('more-reviews-btn');
  if (moreReviewsBtn) {
    moreReviewsBtn.addEventListener('click', () => {
      const isExpanded = moreReviewsBtn.getAttribute('data-expanded') === 'true';
      if (isExpanded) {
        moreReviewsBtn.setAttribute('data-expanded', 'false');
        moreReviewsBtn.innerText = 'View More Reviews';
      } else {
        moreReviewsBtn.setAttribute('data-expanded', 'true');
        moreReviewsBtn.innerText = 'View Less Reviews';
      }
      updateReviewVisibility();
    });
  }

  const loadSavedReviews = () => {
    // 1. Hide/remove deleted static reviews
    const deletedList = getDeletedStaticIndexes();
    document.querySelectorAll('.testimonial-card[data-index]').forEach(card => {
      const idx = parseInt(card.getAttribute('data-index'));
      if (deletedList.includes(idx)) {
        card.remove();
      }
    });

    // 2. Load custom user reviews
    const saved = localStorage.getItem('client-reviews');
    if (saved) {
      const reviews = JSON.parse(saved);
      reviews.forEach(review => {
        appendReviewToGrid(review);
      });
    }

    // 3. Update visibility and admin options
    updateDeleteButtons();
    updateReviewVisibility();
    checkAdminStatus();
  };

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('review-name').value.trim();
      const role = document.getElementById('review-role').value.trim();
      const rating = parseInt(document.getElementById('review-stars').value);
      const text = document.getElementById('review-text').value.trim();

      const reviewData = { name, role, rating, text };

      // Append to UI
      appendReviewToGrid(reviewData);

      // Save to localStorage
      const saved = localStorage.getItem('client-reviews');
      const reviews = saved ? JSON.parse(saved) : [];
      reviews.push(reviewData);
      localStorage.setItem('client-reviews', JSON.stringify(reviews));

      // Asynchronously send to FormSubmit (forwarding to Gmail)
      const formData = new FormData(reviewForm);
      fetch("https://formsubmit.co/ajax/tahireee9@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log("Email sent successfully: ", data);
      })
      .catch(error => {
        console.error("Error sending review email: ", error);
      });

      // Update lists layout & options
      updateDeleteButtons();
      updateReviewVisibility();
      checkAdminStatus();

      // Show success toast
      showToast("Review Submitted!", "Thank you! Your review is saved and sent to Tahir's email.");

      // Close Form Panel
      reviewForm.reset();
      if (reviewPanel) {
        reviewPanel.style.transform = 'translateY(20px)';
        reviewPanel.style.opacity = '0';
        setTimeout(() => {
          reviewPanel.style.display = 'none';
        }, 400);
      }
      if (writeReviewBtn) {
        writeReviewBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Write a Review
        `;
      }
    });
  }



  // Run initial loading logic
  loadSavedReviews();
});

