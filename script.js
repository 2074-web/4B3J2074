const menuToggle = document.querySelector(".nav-toggle");
const navigationLinks = document.querySelector(".nav-links");
const avatar = document.querySelector(".hero-avatar");
const avatarFallback = document.querySelector(".avatar-fallback");

if (menuToggle && navigationLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigationLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigationLinks.classList.toggle("is-open", !isOpen);
  });

  navigationLinks.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

if (avatar && avatarFallback) {
  const showAvatarFallback = () => {
    avatar.hidden = true;
  };

  avatar.addEventListener("error", showAvatarFallback);

  if (avatar.complete && avatar.naturalWidth === 0) {
    showAvatarFallback();
  }
}

const backToTopCat = document.querySelector("#back-to-top-cat");

if (backToTopCat instanceof HTMLButtonElement) {
  const updateBackToTopVisibility = () => {
    backToTopCat.classList.toggle("is-visible", window.scrollY > 300);
  };

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  backToTopCat.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  updateBackToTopVisibility();
}

const portfolioFilters = document.querySelectorAll(".portfolio-filter");
const portfolioCards = document.querySelectorAll(".gallery-card[data-category]");

if (portfolioFilters.length > 0 && portfolioCards.length > 0) {
  portfolioFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedCategory = filterButton.dataset.filter || "all";

      portfolioFilters.forEach((button) => {
        const isSelected = button === filterButton;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });

      portfolioCards.forEach((card) => {
        card.hidden = selectedCategory !== "all" && card.dataset.category !== selectedCategory;
      });
    });
  });
}

const skillsSection = document.querySelector(".skills-section");
if (skillsSection instanceof HTMLElement) {
  const skillCards = skillsSection.querySelectorAll(".skill-card[data-skill-level]");
  const animateSkillLevels = () => {
    skillCards.forEach((card) => {
      const targetLevel = Number(card.dataset.skillLevel);
      const value = card.querySelector(".skill-card-level-value");
      const track = card.querySelector(".skill-card-level-track");
      const fill = card.querySelector(".skill-card-level-fill");

      if (!Number.isFinite(targetLevel)
        || targetLevel < 0
        || targetLevel > 100
        || !(value instanceof HTMLElement)
        || !(track instanceof HTMLElement)
        || !(fill instanceof HTMLElement)) {
        return;
      }

      track.setAttribute("aria-valuenow", String(targetLevel));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        value.textContent = `${targetLevel}%`;
        fill.style.width = `${targetLevel}%`;
        return;
      }

      const startTime = performance.now();
      const duration = 1200;
      const updateValue = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - ((1 - progress) ** 3);
        const currentLevel = Math.round(targetLevel * easedProgress);

        value.textContent = `${currentLevel}%`;
        fill.style.width = `${currentLevel}%`;

        if (progress < 1) {
          window.requestAnimationFrame(updateValue);
        }
      };

      window.requestAnimationFrame(updateValue);
    });
  };

  if ("IntersectionObserver" in window
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const skillProgressObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateSkillLevels();
        observer.disconnect();
      }
    }, { threshold: 0.25 });

    skillProgressObserver.observe(skillsSection);
  } else {
    animateSkillLevels();
  }
}

const revealCards = document.querySelectorAll(".gallery-card");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  });

  revealCards.forEach((card) => {
    card.classList.add("is-scroll-reveal");
    revealObserver.observe(card);
  });
}

const interestCards = document.querySelectorAll(".interest-card[data-preview-src]");
const interestPreview = document.querySelector(".interest-preview");
const interestPreviewImage = interestPreview?.querySelector(".interest-preview-image");
const interestPreviewVideo = interestPreview?.querySelector(".interest-preview-video");
const interestPreviewCaption = interestPreview?.querySelector(".interest-preview-caption");

if (interestPreview instanceof HTMLElement
  && interestPreviewImage instanceof HTMLImageElement
  && interestPreviewVideo instanceof HTMLVideoElement
  && interestPreviewCaption instanceof HTMLElement) {
  document.body.append(interestPreview);
  interestPreviewVideo.pause();
  let activeInterestCard = null;
  let pinnedInterestCard = null;

  const positionInterestPreview = (card) => {
    const cardBounds = card.getBoundingClientRect();
    const previewBounds = interestPreview.getBoundingClientRect();
    const left = Math.max(
      12,
      Math.min(
        cardBounds.left + (cardBounds.width - previewBounds.width) / 2,
        window.innerWidth - previewBounds.width - 12
      )
    );
    const top = Math.max(
      12,
      Math.min(cardBounds.top - previewBounds.height - 16, window.innerHeight - previewBounds.height - 12)
    );

    interestPreview.style.left = `${left}px`;
    interestPreview.style.top = `${top}px`;
  };

  const showInterestPreview = (card) => {
    if (activeInterestCard && activeInterestCard !== card) {
      activeInterestCard.classList.remove("is-flipped");
      activeInterestCard.querySelector(".interest-card-front")?.setAttribute("aria-hidden", "false");
      activeInterestCard.querySelector(".interest-card-back")?.setAttribute("aria-hidden", "true");
    }

    activeInterestCard = card;
    card.classList.add("is-flipped");
    card.querySelector(".interest-card-front")?.setAttribute("aria-hidden", "true");
    card.querySelector(".interest-card-back")?.setAttribute("aria-hidden", "false");
    interestPreviewCaption.textContent = card.dataset.previewCaption || "";
    const isVideoPreview = card.dataset.previewType === "video";
    interestPreviewImage.hidden = isVideoPreview;
    interestPreviewVideo.hidden = !isVideoPreview;

    if (isVideoPreview) {
      interestPreviewImage.removeAttribute("src");
      interestPreviewImage.alt = "";
      if (interestPreviewVideo.getAttribute("src") !== card.dataset.previewSrc) {
        interestPreviewVideo.src = card.dataset.previewSrc;
      }

      const playback = interestPreviewVideo.play();
      if (playback) {
        playback.catch((error) => {
          if (activeInterestCard === card && error.name !== "AbortError") {
            console.error("Unable to play the interest video preview.", error);
          }
        });
      }
    } else {
      interestPreviewVideo.pause();
      interestPreviewImage.src = card.dataset.previewSrc;
      interestPreviewImage.alt = card.dataset.previewAlt || "";
    }

    positionInterestPreview(card);
    interestPreview.classList.add("is-visible");
  };

  const hideInterestPreview = (card, force = false) => {
    if (activeInterestCard !== card
      || (!force && (pinnedInterestCard === card
        || card.matches(":hover")
        || card.contains(document.activeElement)))) {
      return;
    }

    card.classList.remove("is-flipped");
    card.querySelector(".interest-card-front")?.setAttribute("aria-hidden", "false");
    card.querySelector(".interest-card-back")?.setAttribute("aria-hidden", "true");
    activeInterestCard = null;
    interestPreview.classList.remove("is-visible");
    interestPreviewVideo.pause();
  };

  interestCards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      showInterestPreview(card);
    });

    card.addEventListener("pointerleave", () => {
      hideInterestPreview(card);
    });

    card.addEventListener("focusin", () => {
      showInterestPreview(card);
    });

    card.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => hideInterestPreview(card));
    });

    card.addEventListener("click", (event) => {
      if (!window.matchMedia("(hover: none)").matches
        || !(event.target instanceof Element)
        || event.target.closest("a")) {
        return;
      }

      if (pinnedInterestCard === card) {
        pinnedInterestCard = null;
        hideInterestPreview(card, true);
        return;
      }

      pinnedInterestCard = card;
      showInterestPreview(card);
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)
      || event.target.closest(".interest-card[data-preview-src]")) {
      return;
    }

    if (pinnedInterestCard) {
      const card = pinnedInterestCard;
      pinnedInterestCard = null;
      hideInterestPreview(card, true);
    }
  });

  window.addEventListener("scroll", () => {
    if (activeInterestCard) {
      positionInterestPreview(activeInterestCard);
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (activeInterestCard) {
      positionInterestPreview(activeInterestCard);
    }
  });
}

const deskLightbox = document.querySelector("#desk-lightbox");
const deskLightboxImage = deskLightbox?.querySelector(".desk-lightbox-image");
const deskLightboxCaption = deskLightbox?.querySelector(".desk-lightbox-caption");
const deskLightboxClose = deskLightbox?.querySelector(".desk-lightbox-close");
const deskGalleryTriggers = document.querySelectorAll(".desk-gallery-trigger");

if (deskLightbox instanceof HTMLElement
  && deskLightboxImage instanceof HTMLImageElement
  && deskLightboxCaption instanceof HTMLElement
  && deskLightboxClose instanceof HTMLButtonElement) {
  let previouslyFocusedElement = null;

  const closeDeskLightbox = () => {
    deskLightbox.hidden = true;
    document.body.classList.remove("is-lightbox-open");
    deskLightboxImage.removeAttribute("src");
    previouslyFocusedElement?.focus();
  };

  deskGalleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const sourceImage = trigger.querySelector("img");
      if (!(sourceImage instanceof HTMLImageElement)) {
        return;
      }

      previouslyFocusedElement = trigger;
      deskLightboxImage.src = sourceImage.currentSrc || sourceImage.src;
      deskLightboxImage.alt = sourceImage.alt;
      deskLightboxCaption.textContent = sourceImage.alt;
      deskLightbox.hidden = false;
      document.body.classList.add("is-lightbox-open");
      deskLightboxClose.focus();
    });
  });

  deskLightboxClose.addEventListener("click", closeDeskLightbox);
  deskLightbox.addEventListener("click", (event) => {
    if (event.target === deskLightbox) {
      closeDeskLightbox();
    }
  });
  deskLightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeDeskLightbox();
    }
  });
}

const emailCopyButton = document.querySelector(".email-copy-button");
const emailCopyStatus = document.querySelector(".email-copy-status");

if (emailCopyButton && emailCopyStatus) {
  emailCopyButton.addEventListener("click", async () => {
    const email = emailCopyButton.dataset.copyEmail;

    if (!email) {
      emailCopyStatus.textContent = "找不到 Email 地址，請使用上方連結寄信。";
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();

        if (!copied) {
          throw new Error("瀏覽器未能複製 Email。");
        }
      }

      emailCopyStatus.textContent = "Email 已複製到剪貼簿。";
    } catch (error) {
      emailCopyStatus.textContent = "複製失敗，請手動選取 Email 地址。";
      console.error("Unable to copy email address.", error);
    }
  });
}

const customCursor = document.querySelector(".custom-cursor");
const customCursorLabel = customCursor?.querySelector(".custom-cursor-label");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const cursorMotionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (customCursor instanceof HTMLElement
  && customCursorLabel instanceof HTMLElement
  && finePointer.matches
  && cursorMotionAllowed) {
  document.documentElement.classList.add("has-custom-cursor");

  let cursorFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (!cursorFrame) {
      cursorFrame = window.requestAnimationFrame(() => {
        customCursor.style.setProperty("--cursor-x", `${pointerX}px`);
        customCursor.style.setProperty("--cursor-y", `${pointerY}px`);
        cursorFrame = 0;
      });
    }
  });

  document.addEventListener("pointerleave", () => {
    customCursor.classList.remove("is-hovering");
    customCursorLabel.textContent = "";
    customCursor.style.setProperty("--cursor-x", "-100px");
    customCursor.style.setProperty("--cursor-y", "-100px");
  });

  document.addEventListener("pointerover", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const hoverTarget = event.target.closest(
      ".gallery-card, .gallery-image-link, .desk-gallery-trigger, button, a"
    );
    customCursor.classList.toggle("is-hovering", Boolean(hoverTarget));
    customCursorLabel.textContent = hoverTarget ? "VIEW" : "";
  });

  document.addEventListener("pointerout", (event) => {
    if (!(event.target instanceof Element) || !(event.relatedTarget instanceof Node)) {
      return;
    }

    if (!event.relatedTarget.isConnected) {
      customCursor.classList.remove("is-hovering");
      customCursorLabel.textContent = "";
      return;
    }

    const target = event.target.closest(
      ".gallery-card, .gallery-image-link, .desk-gallery-trigger, button, a"
    );
    const nextTarget = event.relatedTarget instanceof Element
      ? event.relatedTarget.closest(".gallery-card, .gallery-image-link, .desk-gallery-trigger, button, a")
      : null;

    if (target && !target.contains(event.relatedTarget)) {
      customCursor.classList.toggle("is-hovering", Boolean(nextTarget));
      customCursorLabel.textContent = nextTarget ? "VIEW" : "";
    }
  });
}

if (finePointer.matches && cursorMotionAllowed) {
  const avatarFrame = document.querySelector(".avatar-frame");

  if (avatarFrame instanceof HTMLElement) {
    avatarFrame.addEventListener("pointermove", (event) => {
      const bounds = avatarFrame.getBoundingClientRect();
      const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

      avatarFrame.style.setProperty("--avatar-offset-x", `${(offsetX * 15).toFixed(2)}px`);
      avatarFrame.style.setProperty("--avatar-offset-y", `${(offsetY * 15).toFixed(2)}px`);
      avatarFrame.style.setProperty("--avatar-tilt-x", `${(-offsetY * 4).toFixed(2)}deg`);
      avatarFrame.style.setProperty("--avatar-tilt-y", `${(offsetX * 4).toFixed(2)}deg`);
    });

    avatarFrame.addEventListener("pointerleave", () => {
      avatarFrame.style.removeProperty("--avatar-offset-x");
      avatarFrame.style.removeProperty("--avatar-offset-y");
      avatarFrame.style.removeProperty("--avatar-tilt-x");
      avatarFrame.style.removeProperty("--avatar-tilt-y");
    });
  }

  const tiltCards = document.querySelectorAll(".gallery-card");
  const maxTilt = 5;

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (relativeX - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - relativeY) * maxTilt * 2;

      card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--shadow-x", `${(rotateY * 1.5).toFixed(2)}px`);
      card.style.setProperty("--shadow-y", `${(14 + rotateX * 1.5).toFixed(2)}px`);
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--shadow-x");
      card.style.removeProperty("--shadow-y");
    });
  });

  const magneticElements = document.querySelectorAll(
    ".project-link-btn, .hero-actions .button, .contact-submit, .cat-fixed"
  );

  magneticElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * 0.12;
      const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * 0.12;

      element.style.setProperty("--magnetic-x", `${Math.max(-8, Math.min(8, offsetX)).toFixed(2)}px`);
      element.style.setProperty("--magnetic-y", `${Math.max(-8, Math.min(8, offsetY)).toFixed(2)}px`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.removeProperty("--magnetic-x");
      element.style.removeProperty("--magnetic-y");
    });
  });
}