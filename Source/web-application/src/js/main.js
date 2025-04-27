(function () {
  const doc = document.documentElement;

  doc.classList.remove("no-js");
  doc.classList.add("js");

  if (document.body.classList.contains("has-animations")) {
    const sr = (window.sr = ScrollReveal());

    sr.reveal(".hero-title, .hero-paragraph, .hero-cta", {
      duration: 1000,
      distance: "40px",
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      origin: "left",
      interval: 150,
    });

    sr.reveal(".hero-illustration", {
      duration: 1000,
      distance: "40px",
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      origin: "right",
      interval: 150,
    });

    sr.reveal(".feature", {
      duration: 1000,
      distance: "40px",
      easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
      interval: 100,
      origin: "bottom",
      scale: 0.9,
      viewFactor: 0.5,
    });

    const pricingTables = document.querySelectorAll(".pricing-table");

    pricingTables.forEach((pricingTable) => {
      const pricingTableHeader = [].slice.call(
        pricingTable.querySelectorAll(".pricing-table-header")
      );
      const pricingTableList = [].slice.call(
        pricingTable.querySelectorAll(".pricing-table-features li")
      );
      const pricingTableCta = [].slice.call(
        pricingTable.querySelectorAll(".pricing-table-cta")
      );
      const elements = pricingTableHeader
        .concat(pricingTableList)
        .concat(pricingTableCta);

      sr.reveal(elements, {
        duration: 600,
        distance: "20px",
        easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
        interval: 100,
        origin: "bottom",
        viewFactor: 0.5,
      });
    });
  }

  async function loadGoogleReviews() {
    try {
      const res = await fetch("http://localhost:3000/reviews");
      const { reviews } = await res.json();
      const container = document.getElementById("reviews-wrapper");
      container.innerHTML = "";

      if (reviews === null || reviews === undefined || reviews.length === 0) {
        return;
      }

      document.getElementById("reviews").style = "display: block";

      reviews.forEach((r) => {
        const div = document.createElement("div");
        div.className = "feature review";
        const date = new Date(r.time * 1000).toLocaleDateString();

        const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

        div.innerHTML = `
          <div class="feature-inner">
            <h4 class="feature-title h3-mobile">
              ${r.author_name}
            </h4>
            <div class="meta"><span style="color: gold">${stars}</span> · ${date}</div>
            <p class="text-sm">
              ${r.text}
            </p>
          </div>
          `;
        container.appendChild(div);

        const sr = (window.sr = ScrollReveal());

        sr.reveal(".review", {
          duration: 1000,
          distance: "40px",
          easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
          interval: 100,
          origin: "bottom",
          scale: 0.9,
          viewFactor: 0.5,
        });
      });
    } catch (err) {
      document.getElementById("reviews").style = "display: none";
      console.error(err);
    }
  }

  loadGoogleReviews();
})();
