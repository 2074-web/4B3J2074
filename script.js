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

const portfolioFilters = document.querySelectorAll(".portfolio-filter");
const portfolioCards = document.querySelectorAll(".gallery-card[data-category]");

if (portfolioFilters.length > 0 && portfolioCards.length > 0) {
  portfolioFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedCategory = filterButton.dataset.filter;

      portfolioFilters.forEach((button) => {
        const isSelected = button === filterButton;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });

      portfolioCards.forEach((card) => {
        const matchesFilter = selectedCategory === "all" || card.dataset.category === selectedCategory;
        card.hidden = !matchesFilter;
      });
    });
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