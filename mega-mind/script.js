const portrait = document.querySelector(".portrait");
const pupils = [...document.querySelectorAll(".pupil")];
const eyeAnchors = [
  { x: 0.405, y: 0.516 },
  { x: 0.613, y: 0.488 },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

if (portrait && pupils.length === eyeAnchors.length) {
  window.addEventListener("pointermove", (event) => {
    const bounds = portrait.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;

    const lightX = clamp(pointerX * 100, 0, 100);
    const lightY = clamp(pointerY * 100, 0, 100);
    const tiltX = clamp((pointerX - 0.5) * 3.2, -1.8, 1.8);
    const tiltY = clamp((0.5 - pointerY) * 3.2, -1.8, 1.8);
    portrait.style.setProperty("--light-x", `${lightX}%`);
    portrait.style.setProperty("--light-y", `${lightY}%`);
    portrait.style.setProperty("--tilt-x", `${tiltX}deg`);
    portrait.style.setProperty("--tilt-y", `${tiltY}deg`);

    pupils.forEach((pupil, index) => {
      const eye = eyeAnchors[index];
      const offsetX = clamp((pointerX - eye.x) * 0.09, -0.03, 0.03);
      const offsetY = clamp((pointerY - eye.y) * 0.085, -0.024, 0.024);

      pupil.style.left = `${(eye.x + offsetX) * 100}%`;
      pupil.style.top = `${(eye.y + offsetY) * 100}%`;
    });
  }, { passive: true });
}

const aboutPortrait = document.querySelector(".about-portrait");

if (aboutPortrait) {
  const aboutSection = aboutPortrait.closest(".about-page");
  const aboutEyes = [...aboutPortrait.querySelectorAll(".about-eye")];
  const aboutEyeAnchors = [
    { x: 0.405, y: 0.54 },
    { x: 0.615, y: 0.52 },
  ];
  const speechBubble = aboutPortrait.querySelector(".about-speech");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const messages = [
    "Yo! Stop staring at me!",
    "You finally found me!",
    "This developer is built different!",
    "Click me again… if you dare!",
    "Welcome to the madness!",
  ];
  let messageIndex = 0;
  let glitchTimer;
  let speechTimer;

  aboutSection?.addEventListener("pointermove", (event) => {
    const bounds = aboutPortrait.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pointerX = (event.clientX - bounds.left) / bounds.width;
    const pointerY = (event.clientY - bounds.top) / bounds.height;

    aboutEyes.forEach((eye, index) => {
      const anchor = aboutEyeAnchors[index];
      const offsetX = clamp((pointerX - anchor.x) * bounds.width * 0.08, -bounds.width * 0.025, bounds.width * 0.025);
      const offsetY = clamp((pointerY - anchor.y) * bounds.height * 0.07, -bounds.height * 0.02, bounds.height * 0.02);
      eye.style.setProperty("--eye-x", `${offsetX}px`);
      eye.style.setProperty("--eye-y", `${offsetY}px`);
    });
  }, { passive: true });

  const blink = () => {
    if (reducedMotion.matches) return;
    aboutPortrait.classList.add("is-blinking");
    setTimeout(() => aboutPortrait.classList.remove("is-blinking"), 190);
    setTimeout(blink, Math.random() < 0.14 ? 250 : 2600 + Math.random() * 3200);
  };

  setTimeout(blink, 1800 + Math.random() * 2600);

  const activateAboutPortrait = () => {
    const redEyesActive = aboutPortrait.classList.toggle("is-red-eyes");
    aboutPortrait.setAttribute("aria-pressed", String(redEyesActive));
    if (speechBubble) {
      speechBubble.textContent = messages[messageIndex % messages.length];
      speechBubble.classList.add("is-visible");
      messageIndex += 1;
      clearTimeout(speechTimer);
      speechTimer = setTimeout(() => speechBubble.classList.remove("is-visible"), 4200);
    }

    clearTimeout(glitchTimer);
    aboutPortrait.classList.remove("is-glitching");
    void aboutPortrait.offsetWidth;
    aboutPortrait.classList.add("is-glitching");
    glitchTimer = setTimeout(() => aboutPortrait.classList.remove("is-glitching"), 460);
  };

  aboutPortrait.addEventListener("click", activateAboutPortrait);
  aboutPortrait.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateAboutPortrait();
    }
  });
}

const contactSection = document.querySelector(".contact-page");

if (contactSection) {
  const contactHeading = contactSection.querySelector(".contact-heading");
  const contactPortrait = contactSection.querySelector(".contact-portrait");
  const contactEyes = [...contactSection.querySelectorAll(".contact-eye")];
  const contactEyeAnchors = [
    { x: 0.405, y: 0.54 },
    { x: 0.615, y: 0.52 },
  ];
  const contactTargets = [...contactSection.querySelectorAll(".contact-eye-target")];
  const contactForm = contactSection.querySelector(".contact-form");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastPointer;
  let seenTimer;

  const scrambleContactHeading = () => {
    if (!contactHeading || reducedMotion.matches) return;
    const pieces = [...contactHeading.querySelectorAll("[data-final]")];
    const glitchCharacters = "01/<>#%░▒▓";
    const startTime = performance.now();
    const duration = 880;

    const updateFrame = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      pieces.forEach((piece) => {
        const finalText = piece.dataset.final;
        const revealed = Math.floor(finalText.length * progress);
        piece.textContent = [...finalText].map((character, index) => {
          if (character === " " || index < revealed) return character;
          return glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
        }).join("");
      });

      if (progress < 1) {
        requestAnimationFrame(updateFrame);
      } else {
        pieces.forEach((piece) => { piece.textContent = piece.dataset.final; });
      }
    };

    requestAnimationFrame(updateFrame);
  };

  const revealContact = () => {
    if (contactSection.classList.contains("is-entered")) return;
    contactSection.classList.add("is-entered");
    if (reducedMotion.matches) return;

    contactSection.classList.add("is-glitching");
    scrambleContactHeading();
    setTimeout(() => contactSection.classList.remove("is-glitching"), 900);
  };

  if ("IntersectionObserver" in window) {
    const contactObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        revealContact();
        contactObserver.disconnect();
      }
    }, { threshold: 0.3 });
    contactObserver.observe(contactSection);
  } else {
    revealContact();
  }

  const lookAt = (clientX, clientY) => {
    if (!contactPortrait) return;
    const bounds = contactPortrait.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pointerX = clamp((clientX - bounds.left) / bounds.width, 0, 1);
    const pointerY = clamp((clientY - bounds.top) / bounds.height, 0, 1);
    contactEyes.forEach((eye, index) => {
      const anchor = contactEyeAnchors[index];
      const offsetX = clamp((pointerX - anchor.x) * bounds.width * 0.09, -bounds.width * 0.03, bounds.width * 0.03);
      const offsetY = clamp((pointerY - anchor.y) * bounds.height * 0.085, -bounds.height * 0.024, bounds.height * 0.024);
      eye.style.setProperty("--contact-eye-x", `${offsetX}px`);
      eye.style.setProperty("--contact-eye-y", `${offsetY}px`);
    });
  };

  contactSection.addEventListener("pointermove", (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
    lookAt(event.clientX, event.clientY);
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover)").matches) return;
    const bounds = contactSection.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    contactSection.style.setProperty("--contact-x", `${x}%`);
    contactSection.style.setProperty("--contact-y", `${y}%`);
  }, { passive: true });

  contactTargets.forEach((target) => {
    const lookAtTarget = () => {
      const bounds = target.getBoundingClientRect();
      lookAt(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    };
    target.addEventListener("pointerenter", lookAtTarget);
    target.addEventListener("pointerleave", () => {
      if (lastPointer) lookAt(lastPointer.x, lastPointer.y);
    });
    target.addEventListener("focus", lookAtTarget);
    target.addEventListener("blur", () => {
      if (lastPointer) lookAt(lastPointer.x, lastPointer.y);
    });
  });

  if (contactPortrait) {
    const blink = () => {
      if (reducedMotion.matches) return;
      contactPortrait.classList.add("is-blinking");
      setTimeout(() => contactPortrait.classList.remove("is-blinking"), 190);
      setTimeout(blink, Math.random() < 0.14 ? 250 : 2600 + Math.random() * 3200);
    };
    setTimeout(blink, 1700 + Math.random() * 2600);

    contactPortrait.addEventListener("click", () => {
      const alertActive = contactPortrait.classList.toggle("is-alert");
      contactPortrait.setAttribute("aria-pressed", String(alertActive));
      contactPortrait.classList.add("has-seen", "is-glitching");
      clearTimeout(seenTimer);
      seenTimer = setTimeout(() => {
        contactPortrait.classList.remove("has-seen", "is-glitching");
      }, 1200);
    });
    contactPortrait.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        contactPortrait.click();
      }
    });
  }

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = contactForm.querySelector(".contact-form-status");
    const nameField = contactForm.elements.namedItem("name");
    const emailField = contactForm.elements.namedItem("email");
    const messageField = contactForm.elements.namedItem("message");
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    status.classList.remove("is-error");
    if (!name || !email || emailField.validity.typeMismatch || !message) {
      status.textContent = "Please add your name, a valid email address, and your message.";
      status.classList.add("is-error");
      const firstInvalid = !name ? nameField : (!email || emailField.validity.typeMismatch) ? emailField : messageField;
      firstInvalid.focus();
      firstInvalid.reportValidity();
      return;
    }

    const channel = event.submitter?.value || "gmail";
    const fullMessage = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    let destination;

    if (channel === "whatsapp") {
      destination = new URL("https://wa.me/2349012259258");
      destination.searchParams.set("text", fullMessage);
      status.textContent = "WhatsApp opened with your message ready. Tap Send to send it.";
    } else {
      destination = new URL("https://mail.google.com/mail/");
      destination.searchParams.set("view", "cm");
      destination.searchParams.set("fs", "1");
      destination.searchParams.set("to", "chideraudoh58@gmail.com");
      destination.searchParams.set("su", `Message from ${name}`);
      destination.searchParams.set("body", fullMessage);
      status.textContent = "Gmail opened with your message ready to review and send.";
    }

    window.open(destination.href, "_blank", "noopener,noreferrer");
  });
}

const progressBar = document.querySelector(".scroll-progress span");

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();
