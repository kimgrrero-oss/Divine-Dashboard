document.addEventListener("DOMContentLoaded", () => {
  // --- Scroll Reveal Animation ---
  const cards = document.querySelectorAll(".card, .stat-card, .contact-card");

  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.style.opacity = 0;
      card.style.transform = "translateY(50px)";
      card.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      observer.observe(card);
    });
  }

  // --- Active Navigation Link ---
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // --- Session Key Generator (only on session.html) ---
  const btn = document.getElementById("generateKeyBtn");
  const output = document.getElementById("keyOutput");
  const statusText = document.getElementById("keyStatus");

  const setStatus = (msg) => {
    if (statusText) statusText.textContent = msg;
  };

  if (btn && output) {
    btn.addEventListener("click", async () => {
      output.textContent = "••••••••••••••••••••";
      setStatus("Generating...");

      try {
        // Must be served via http://localhost/... for PHP to run
        const res = await fetch("key.php?mode=json", { cache: "no-store" });

        if (!res.ok) {
          const txt = await res.text();
          console.error("key.php non-OK:", res.status, txt);
          output.textContent = "ERROR";
          setStatus(`Server error (${res.status}). Open console.`);
          return;
        }

        // If server returns HTML, this will fail. We'll detect it.
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const txt = await res.text();
          console.error("Expected JSON but got:", contentType, txt);
          output.textContent = "ERROR";
          setStatus("Not JSON. Make sure PHP is running (localhost).");
          return;
        }

        const data = await res.json();

        if (!data || data.ok === false) {
          console.error("key.php JSON error:", data);
          output.textContent = "ERROR";
          setStatus(data?.error || "Failed to generate key.");
          return;
        }

        output.textContent = data.key || "NO KEY";
        setStatus("Key generated successfully.");
      } catch (err) {
        console.error("Fetch failed:", err);
        output.textContent = "ERROR";
        setStatus("Request failed. Use http://localhost/... not file path.");
      }
    });

    // Optional: copy to clipboard when clicking the key
    output.addEventListener("click", async () => {
      const key = output.textContent.trim();
      if (!key || key === "Click Generate" || key === "ERROR") return;

      try {
        await navigator.clipboard.writeText(key);
        setStatus("Copied to clipboard.");
      } catch {
        setStatus("Copy failed (browser blocked clipboard).");
      }
    });
  }
});