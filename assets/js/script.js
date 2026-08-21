'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
// NOTE: this portfolio doesn't currently have a testimonials section in the HTML,
// so these elements are null. Everything below is guarded with an "if" so a
// missing section doesn't crash the rest of the script (crashing here was
// silently breaking the resume preview code further down the file).
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

if (modalContainer && overlay) {

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // add click event to all modal items
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }

  // add click event to modal close button
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);

}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
// NOTE: your HTML form uses id="contact-form" / class="form-input" / class="form-btn",
// not the data-form / data-form-input / data-form-btn attributes this block expects,
// so these are also guarded. Your inline <script> in index.html already handles the
// actual mailto submission, so this isn't required — it's just here in case you add
// those data attributes later for live validation styling.
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (form && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



/* ---------------------------------------------------
   Resume PDF preview — mobile fallback
--------------------------------------------------- */

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const resumeObject = document.querySelector(".resume-preview-frame");

if (isMobile && resumeObject) {
  const wrapper = resumeObject.parentElement;
  wrapper.innerHTML = `
    <div class="resume-preview-fallback">
      <ion-icon name="document-text-outline" style="font-size: 48px;"></ion-icon>
      <p>Tap below to view your resume.</p>
      <a href="resume/mohammed-azrudeen-resume.pdf" target="_blank" rel="noopener">Open Resume</a>
    </div>
  `;
}

/* ================================================================
   HORIZONTAL PROJECT CARDS — behaviour
   Paste this at the END of assets/js/script.js
   Reuses your existing filter buttons / select dropdown (data-filter-btn,
   data-select, data-select-item, data-selecct-value) and drives the new
   .h-project-item cards. Also handles expand/collapse for details.
   ================================================================ */

(function () {
  const hProjectItems = document.querySelectorAll("[data-filter-item].h-project-item");

  const hCategoryMap = {
    "all": "all",
    "applications": "applications",
    "web development": "web-development"
  };

  function hFilterFunc(selectedValue) {
    const key = selectedValue.toLowerCase();
    const target = hCategoryMap[key] || "all";

    hProjectItems.forEach((item) => {
      const category = item.dataset.category;
      if (target === "all") {
        item.classList.add("active");
      } else if (category === target) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Filter buttons (desktop)
  const hFilterBtns = document.querySelectorAll("[data-filter-btn]");
  let hLastActiveBtn = document.querySelector("[data-filter-btn].active");

  hFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText;
      hFilterFunc(selectedValue);

      if (hLastActiveBtn) hLastActiveBtn.classList.remove("active");
      this.classList.add("active");
      hLastActiveBtn = this;

      const selectValueEl = document.querySelector("[data-selecct-value]");
      if (selectValueEl) selectValueEl.innerText = selectedValue;
    });
  });

  // Filter dropdown (mobile)
  const hSelectItems = document.querySelectorAll("[data-select-item]");
  hSelectItems.forEach((item) => {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText;
      hFilterFunc(selectedValue);

      const selectValueEl = document.querySelector("[data-selecct-value]");
      if (selectValueEl) selectValueEl.innerText = selectedValue;

      const selectBox = document.querySelector("[data-select]");
      if (selectBox) selectBox.classList.remove("active");

      if (hLastActiveBtn) hLastActiveBtn.classList.remove("active");
      hFilterBtns.forEach((btn) => {
        if (btn.innerText === selectedValue) {
          btn.classList.add("active");
          hLastActiveBtn = btn;
        }
      });
    });
  });

  // Expand / collapse details
  document.querySelectorAll(".h-project-item").forEach((item) => {
    const toggles = item.querySelectorAll("[data-h-toggle]");
    toggles.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle("h-open");
      });
    });
  });
})();

/* ================================================================
   PROJECT MEDIA GALLERY + LIGHTBOX
   Works with any .h-gallery-item buttons that have:
     data-full  = path to full-size image OR video file
     data-type  = "image" or "video"
   Items sharing the same .h-gallery (i.e. same project) are grouped so
   next/prev navigates within that project's media only.
   ================================================================ */

(function () {
  const lightbox = document.createElement("div");
  lightbox.className = "h-lightbox";
  lightbox.innerHTML = `
    <div class="h-lightbox-content">
      <button class="h-lightbox-close" aria-label="Close"><ion-icon name="close-outline"></ion-icon></button>
      <button class="h-lightbox-prev" aria-label="Previous"><ion-icon name="chevron-back-outline"></ion-icon></button>
      <button class="h-lightbox-next" aria-label="Next"><ion-icon name="chevron-forward-outline"></ion-icon></button>
      <div class="h-lightbox-media"></div>
      <div class="h-lightbox-counter"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const mediaBox = lightbox.querySelector(".h-lightbox-media");
  const counterEl = lightbox.querySelector(".h-lightbox-counter");
  const closeBtn = lightbox.querySelector(".h-lightbox-close");
  const prevBtn = lightbox.querySelector(".h-lightbox-prev");
  const nextBtn = lightbox.querySelector(".h-lightbox-next");

  let currentGroup = [];
  let currentIndex = 0;

  function renderCurrent() {
    const entry = currentGroup[currentIndex];
    if (!entry) return;
    mediaBox.innerHTML = "";

    if (entry.type === "video") {
      const video = document.createElement("video");
      video.src = entry.full;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      mediaBox.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = entry.full;
      img.alt = entry.alt || "";
      mediaBox.appendChild(img);
    }

    counterEl.textContent = currentGroup.length > 1
      ? (currentIndex + 1) + " / " + currentGroup.length
      : "";

    const multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? "flex" : "none";
    nextBtn.style.display = multi ? "flex" : "none";
  }

  function stopAnyVideo() {
    const v = mediaBox.querySelector("video");
    if (v) v.pause();
  }

  function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    renderCurrent();
    lightbox.classList.add("h-lightbox-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    stopAnyVideo();
    lightbox.classList.remove("h-lightbox-open");
    mediaBox.innerHTML = "";
    document.body.style.overflow = "";
  }

  function showNext() {
    stopAnyVideo();
    currentIndex = (currentIndex + 1) % currentGroup.length;
    renderCurrent();
  }

  function showPrev() {
    stopAnyVideo();
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    renderCurrent();
  }

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("h-lightbox-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  // Wire up every .h-gallery on the page independently
  document.querySelectorAll(".h-gallery").forEach((galleryEl) => {
    const items = Array.from(galleryEl.querySelectorAll(".h-gallery-item"));
    const group = items.map((btn) => ({
      full: btn.dataset.full,
      type: btn.dataset.type || "image",
      alt: btn.dataset.alt || ""
    }));

    items.forEach((btn, i) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(group, i);
      });
    });
  });
})();
