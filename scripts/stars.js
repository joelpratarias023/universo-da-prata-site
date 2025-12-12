const starsContainer = document.getElementById("stars-container");
if (starsContainer) {
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${5 + Math.random() * 10}s`;
    star.style.opacity = Math.random();
    starsContainer.appendChild(star);
  }
}
