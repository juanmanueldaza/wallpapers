const images = [
  "pictures/daza051.jpg",
  "pictures/daza052.jpg",
  "pictures/daza054.jpg",
  "pictures/daza072.jpg",
  "pictures/daza088.jpg",
];

let currentSlide = 0;
const slideshowContainer = document.getElementById("slideshow");
const dotsContainer = document.getElementById("dots");

// Create slides and dots
images.forEach((img, index) => {
  // Create slide
  const slide = document.createElement("div");
  slide.className = "slide";
  const imgElement = document.createElement("img");
  imgElement.src = img;
  slide.appendChild(imgElement);
  slideshowContainer.appendChild(slide);

  // Create dot
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.onclick = () => showSlide(index);
  dotsContainer.appendChild(dot);
});

function showSlide(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  // Handle wrapping around
  if (n >= slides.length) {
    currentSlide = 0;
  } else if (n < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = n;
  }

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Show current slide
  slides[currentSlide].style.display = "block";
  dots[currentSlide].className += " active";
}

function changeSlide(n) {
  showSlide(currentSlide + n);
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") changeSlide(-1);
  if (e.key === "ArrowRight") changeSlide(1);
});

// Auto-advance slides every 3 seconds
setInterval(() => {
  changeSlide(1);
}, 3000);

// Show first slide initially
showSlide(0);
