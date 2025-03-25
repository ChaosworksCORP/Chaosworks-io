document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll("section")
        .forEach((section) => section.classList.remove("active"));
      document.getElementById(link.dataset.section).classList.add("active");
    });
  });

  // Build button
  document.getElementById("build-btn").addEventListener("click", () => {
    document.getElementById("build-message").textContent =
      "ChaosWorks is evolvin’—new shit droppin’!";
  });
});
