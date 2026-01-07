// ===================================
// INITIALIZATION
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 100,
    delay: 100,
  });

  // Initialize all features
  initMobileMenu();
  initSmoothScroll();
  initNavbarScroll();
  initContactForm();
  initLazyLoading();
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !navMenu) return;

  // Toggle menu on button click
  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (
      !isClickInsideMenu &&
      !isClickOnToggle &&
      navMenu.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Close menu on window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just "#"
      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";
    const navbarHeight = navbar.offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// ===================================
// CONTACT FORM HANDLING
// ===================================
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();

    // Validate form
    if (!validateForm(name, phone, service, message)) {
      return;
    }

    // Build WhatsApp message
    let whatsappMessage = `*Solicitud de Presupuesto*%0A%0A`;
    whatsappMessage += `*Nombre:* ${encodeURIComponent(name)}%0A`;
    whatsappMessage += `*Teléfono:* ${encodeURIComponent(phone)}%0A`;

    if (email) {
      whatsappMessage += `*Email:* ${encodeURIComponent(email)}%0A`;
    }

    whatsappMessage += `*Servicio:* ${encodeURIComponent(service)}%0A%0A`;
    whatsappMessage += `*Mensaje:*%0A${encodeURIComponent(message)}`;

    // Open WhatsApp with the message
    const whatsappURL = `https://wa.me/5493415411770?text=${whatsappMessage}`;
    window.open(whatsappURL, "_blank");

    // Show success message
    showFormMessage(
      "¡Mensaje enviado! Te redirigiremos a WhatsApp...",
      "success"
    );

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
    }, 2000);
  });
}

// ===================================
// FORM VALIDATION
// ===================================
function validateForm(name, phone, service, message) {
  // Validate name
  if (name.length < 2) {
    showFormMessage("Por favor, ingresa tu nombre completo.", "error");
    document.getElementById("name").focus();
    return false;
  }

  // Validate phone
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.length < 8) {
    showFormMessage("Por favor, ingresa un teléfono válido.", "error");
    document.getElementById("phone").focus();
    return false;
  }

  // Validate service
  if (!service) {
    showFormMessage("Por favor, selecciona un servicio.", "error");
    document.getElementById("service").focus();
    return false;
  }

  // Validate message
  if (message.length < 10) {
    showFormMessage(
      "Por favor, describe tu necesidad con más detalle.",
      "error"
    );
    document.getElementById("message").focus();
    return false;
  }

  return true;
}

// ===================================
// FORM MESSAGE DISPLAY
// ===================================
function showFormMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message form-message-${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        animation: slideIn 0.3s ease;
        ${
          type === "success"
            ? "background: #d4edda; color: #155724; border: 1px solid #c3e6cb;"
            : "background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;"
        }
    `;

  // Insert message at the top of the form
  const form = document.getElementById("contactForm");
  form.insertBefore(messageDiv, form.firstChild);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

// ===================================
// LAZY LOADING FOR IMAGES
// ===================================
function initLazyLoading() {
  // Check if IntersectionObserver is supported
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");

            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              img.classList.add("loaded");
            }

            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    // Observe all images with data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }
}

// ===================================
// PHONE NUMBER FORMATTING
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      // Remove all non-digit characters
      let value = e.target.value.replace(/\D/g, "");

      // Limit to reasonable phone number length
      if (value.length > 15) {
        value = value.slice(0, 15);
      }

      e.target.value = value;
    });
  }
});

// ===================================
// SCROLL TO TOP FUNCTIONALITY
// ===================================
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Show/hide scroll to top button based on scroll position
window.addEventListener("scroll", function () {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (scrollTopBtn) {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }
});

// ===================================
// CLICK TO CALL - TRACK ANALYTICS
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  // Track phone clicks (for analytics integration)
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Here you can add analytics tracking
      console.log("Phone call initiated:", this.href);

      // Example: Google Analytics tracking
      if (typeof gtag !== "undefined") {
        gtag("event", "click", {
          event_category: "Contact",
          event_label: "Phone Call",
          value: this.href,
        });
      }
    });
  });

  // Track WhatsApp clicks
  const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');

  whatsappLinks.forEach((link) => {
    link.addEventListener("click", function () {
      console.log("WhatsApp chat initiated:", this.href);

      // Example: Google Analytics tracking
      if (typeof gtag !== "undefined") {
        gtag("event", "click", {
          event_category: "Contact",
          event_label: "WhatsApp",
          value: this.href,
        });
      }
    });
  });
});

// ===================================
// SERVICE CARD ANIMATIONS
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // Add ripple effect or additional animations here if needed
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// ===================================
// PRICING CARD ANIMATIONS
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  const pricingCards = document.querySelectorAll(".pricing-card");

  pricingCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// ===================================
// FORM INPUT FOCUS EFFECTS
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group select, .form-group textarea"
  );

  formInputs.forEach((input) => {
    // Add focus class to parent form-group
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");

      // Add filled class if input has value
      if (this.value.trim() !== "") {
        this.parentElement.classList.add("filled");
      } else {
        this.parentElement.classList.remove("filled");
      }
    });
  });
});

// ===================================
// PREVENT FORM RESUBMISSION
// ===================================
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// ===================================
// KEYBOARD ACCESSIBILITY
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  // Add keyboard navigation for cards
  const interactiveCards = document.querySelectorAll(
    ".service-card, .pricing-card, .guarantee-card"
  );

  interactiveCards.forEach((card) => {
    // Make cards focusable
    if (!card.hasAttribute("tabindex")) {
      card.setAttribute("tabindex", "0");
    }

    // Add keyboard support
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        // Find the first link in the card and click it
        const link = this.querySelector("a");
        if (link) {
          link.click();
        }
      }
    });
  });
});

// ===================================
// ADD CSS ANIMATIONS
// ===================================
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    .form-group.focused label {
        color: var(--primary-color);
    }
    
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
    }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You can add error reporting service here
});

// ===================================
// CONSOLE LOG - DEVELOPMENT INFO
// ===================================
console.log(
  "%c🌡️ Refrigeración Delegar",
  "font-size: 20px; font-weight: bold; color: #1E88E5;"
);
console.log(
  "%cDesarrollado con ❤️ por @Binadevs",
  "font-size: 14px; color: #FF6B35;"
);
console.log(
  "%cPara consultas técnicas: 341 5411770",
  "font-size: 12px; color: #2C3E50;"
);
