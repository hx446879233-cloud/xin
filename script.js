document.documentElement.classList.add("js-enabled");

const revealItems = document.querySelectorAll(".reveal");

const revealVisibleNow = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      item.classList.add("is-visible");
    }
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
  requestAnimationFrame(revealVisibleNow);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("aria-hidden", "true");
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close image preview">×</button>
  <img alt="">
  <div class="lightbox-caption"></div>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxClose = lightbox.querySelector(".lightbox-close");

const openLightbox = (image) => {
  const figure = image.closest("figure");
  const caption = figure?.querySelector("figcaption")?.textContent?.trim() || image.alt || "";
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || caption || "Portfolio image preview";
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

document.querySelectorAll(".image-frame img, .cover-visual img").forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});
