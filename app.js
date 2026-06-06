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
  window.addEventListener('resize', fixOverflow);

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

  // --- Background Hover Cursor Glow & SVG Cat Follower ---
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorCat = document.getElementById('cursor-cat');
  const pupilLeft = document.getElementById('cat-pupil-left');
  const pupilRight = document.getElementById('cat-pupil-right');

  if (window.innerWidth > 1024) {
    cursorGlow.style.display = 'block';
    if (cursorCat) cursorCat.style.display = 'block';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let catX = mouseX;
    let catY = mouseY;
    const speed = 0.07;
    let firstMove = true;
    let isRunning = false;
    let runTimeout = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorGlow.style.left = `${mouseX}px`;
      cursorGlow.style.top = `${mouseY}px`;

      if (firstMove) {
        catX = mouseX;
        catY = mouseY;
        firstMove = false;
        if (cursorCat) cursorCat.style.opacity = '1';
      }

      // Add running animation class when mouse moves fast
      if (!isRunning) {
        isRunning = true;
        if (cursorCat) cursorCat.classList.add('running');
      }
      clearTimeout(runTimeout);
      runTimeout = setTimeout(() => {
        isRunning = false;
        if (cursorCat) cursorCat.classList.remove('running');
      }, 150);
    });

    function animateCat() {
      const dx = mouseX - catX;
      const dy = mouseY - catY;

      catX += dx * speed;
      catY += dy * speed;

      if (cursorCat) {
        // Center the cat on its position (SVG is 54x54, so offset by -27 via CSS translate(-50%,-50%))
        cursorCat.style.left = `${catX}px`;
        cursorCat.style.top = `${catY}px`;

        // Animate pupils to look toward where the cat is going (toward mouse)
        if (pupilLeft && pupilRight) {
          // Direction vector from cat to mouse (normalized, small range for subtle effect)
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const nx = (dx / dist) * 1.2; // max 1.2px shift
            const ny = (dy / dist) * 1.0;
            pupilLeft.setAttribute('cx', 22.5 + nx);
            pupilLeft.setAttribute('cy', 23.5 + ny);
            pupilRight.setAttribute('cx', 32.5 + nx);
            pupilRight.setAttribute('cy', 23.5 + ny);
          } else {
            // Reset pupils to center
            pupilLeft.setAttribute('cx', 22.5);
            pupilLeft.setAttribute('cy', 23.5);
            pupilRight.setAttribute('cx', 32.5);
            pupilRight.setAttribute('cy', 23.5);
          }
        }
      }

      requestAnimationFrame(animateCat);
    }

    requestAnimationFrame(animateCat);
  }

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
    const waNumber = '923146813808'; // +92 314 6813808
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    // Show success toast
    toast.classList.add('show');
    contactForm.reset();
    setTimeout(() => toast.classList.remove('show'), 4000);

    // Open WhatsApp in new tab after brief delay (so user sees toast)
    setTimeout(() => window.open(waUrl, '_blank'), 600);
  });
});

