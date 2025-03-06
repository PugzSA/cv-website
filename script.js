// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear();

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 70, // Offset for the sticky navigation
      behavior: "smooth"
    });
  });
});

// Add active class to navigation items on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - 100) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === currentSection) {
      link.classList.add("active");
    }
  });
});

// Add CSS for active navigation link
const style = document.createElement("style");
style.textContent = `
    nav a.active {
        background-color: var(--secondary-color);
        color: white;
    }
`;
document.head.appendChild(style);

// Mobile navigation toggle (for smaller screens)
const createMobileNav = () => {
  if (window.innerWidth <= 768) {
    const nav = document.querySelector("nav ul");
    const navContainer = document.querySelector("nav .container");

    // Create toggle button if it doesn't exist
    if (!document.querySelector(".nav-toggle")) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "nav-toggle";
      toggleBtn.innerHTML = "<span></span><span></span><span></span>";
      navContainer.prepend(toggleBtn);

      // Add toggle functionality
      toggleBtn.addEventListener("click", () => {
        nav.classList.toggle("show");
        toggleBtn.classList.toggle("active");
      });

      // Add CSS for mobile navigation
      const mobileStyle = document.createElement("style");
      mobileStyle.textContent = `
                @media (max-width: 768px) {
                    nav .container {
                        position: relative;
                    }
                    
                    nav ul {
                        display: none;
                        flex-direction: column;
                        align-items: center;
                        padding: 20px 0;
                    }
                    
                    nav ul.show {
                        display: flex;
                    }
                    
                    .nav-toggle {
                        display: block;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 10px;
                        position: absolute;
                        right: 20px;
                        top: 10px;
                    }
                    
                    .nav-toggle span {
                        display: block;
                        width: 25px;
                        height: 3px;
                        background-color: var(--primary-color);
                        margin: 5px 0;
                        transition: all 0.3s ease;
                    }
                    
                    .nav-toggle.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    
                    .nav-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .nav-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -7px);
                    }
                }
            `;
      document.head.appendChild(mobileStyle);
    }
  }
};

// Call mobile nav setup on load and resize
window.addEventListener("load", createMobileNav);
window.addEventListener("resize", createMobileNav);

// Add animation to skill bars
const animateSkills = () => {
  const skillBars = document.querySelectorAll(".skill-progress");

  skillBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0";

    setTimeout(() => {
      bar.style.transition = "width 1s ease";
      bar.style.width = width;
    }, 200);
  });
};

// Animate skills when skills section is in view
const skillsSection = document.getElementById("skills");
let animated = false;

window.addEventListener("scroll", () => {
  if (!animated && isInViewport(skillsSection)) {
    animateSkills();
    animated = true;
  }
});

// Helper function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// PDF Download Functionality
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("download-pdf");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      // Show loading state
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
      downloadBtn.disabled = true;

      // Call the Google Cloud Function to generate the PDF
      // Replace with your actual Cloud Function URL after deployment
      const cloudFunctionUrl =
        "https://generate-cv-pdf-1072078726443.us-central1.run.app";

      console.log("Calling Cloud Function at:", cloudFunctionUrl);

      // Use fetch to call the Cloud Function
      fetch(cloudFunctionUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/pdf"
        }
      })
        .then((response) => {
          console.log("Response status:", response.status);

          if (!response.ok) {
            return response.text().then((text) => {
              console.error("Error response body:", text);
              throw new Error(
                "Server error: " + response.status + " " + response.statusText
              );
            });
          }
          return response.blob();
        })
        .then((blob) => {
          console.log("Received blob:", blob.type, blob.size);

          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);

          // Create a temporary link element to trigger the download
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "Kyle_Cockcroft_CV.pdf";

          // Append to the document and trigger the download
          document.body.appendChild(a);
          a.click();

          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          // Restore button state
          downloadBtn.innerHTML = originalText;
          downloadBtn.disabled = false;
        })
        .catch((error) => {
          console.error("Error downloading PDF:", error);

          // Show error message with more details
          let errorMessage = "Error generating PDF: " + error.message;

          if (error.message.includes("500")) {
            errorMessage +=
              "\n\nThe server encountered an error. Please check the Cloud Function logs for details.";
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage +=
              "\n\nCould not connect to the Cloud Function. Please check that the URL is correct and the function is deployed.";
          }

          alert(errorMessage);

          // Restore button state
          downloadBtn.innerHTML =
            '<i class="fas fa-exclamation-circle"></i> Error';
          setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
          }, 2000);
        });
    });
  }

  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Smooth scrolling for navigation links
  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 70, // Offset for the sticky navigation
        behavior: "smooth"
      });
    });
  });

  // Add active class to navigation items on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 100) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active");
      }
    });
  });

  // Add CSS for active navigation link
  const style = document.createElement("style");
  style.textContent = `
      nav a.active {
          background-color: var(--secondary-color);
          color: white;
      }
  `;
  document.head.appendChild(style);

  // Mobile navigation toggle (for smaller screens)
  const createMobileNav = () => {
    if (window.innerWidth <= 768) {
      const nav = document.querySelector("nav ul");
      const navContainer = document.querySelector("nav .container");

      // Create toggle button if it doesn't exist
      if (!document.querySelector(".nav-toggle")) {
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "nav-toggle";
        toggleBtn.innerHTML = "<span></span><span></span><span></span>";
        navContainer.prepend(toggleBtn);

        // Add toggle functionality
        toggleBtn.addEventListener("click", () => {
          nav.classList.toggle("show");
          toggleBtn.classList.toggle("active");
        });

        // Add CSS for mobile navigation
        const mobileStyle = document.createElement("style");
        mobileStyle.textContent = `
                  @media (max-width: 768px) {
                      nav .container {
                          position: relative;
                      }
                      
                      nav ul {
                          display: none;
                          flex-direction: column;
                          align-items: center;
                          padding: 20px 0;
                      }
                      
                      nav ul.show {
                          display: flex;
                      }
                      
                      .nav-toggle {
                          display: block;
                          background: none;
                          border: none;
                          cursor: pointer;
                          padding: 10px;
                          position: absolute;
                          right: 20px;
                          top: 10px;
                      }
                      
                      .nav-toggle span {
                          display: block;
                          width: 25px;
                          height: 3px;
                          background-color: var(--primary-color);
                          margin: 5px 0;
                          transition: all 0.3s ease;
                      }
                      
                      .nav-toggle.active span:nth-child(1) {
                          transform: rotate(45deg) translate(5px, 5px);
                      }
                      
                      .nav-toggle.active span:nth-child(2) {
                          opacity: 0;
                      }
                      
                      .nav-toggle.active span:nth-child(3) {
                          transform: rotate(-45deg) translate(7px, -7px);
                      }
                  }
              `;
        document.head.appendChild(mobileStyle);
      }
    }
  };

  // Call mobile nav setup on load and resize
  window.addEventListener("load", createMobileNav);
  window.addEventListener("resize", createMobileNav);

  // Add animation to skill bars
  const animateSkills = () => {
    const skillBars = document.querySelectorAll(".skill-progress");

    skillBars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0";

      setTimeout(() => {
        bar.style.transition = "width 1s ease";
        bar.style.width = width;
      }, 200);
    });
  };

  // Animate skills when skills section is in view
  const skillsSection = document.getElementById("skills");
  let animated = false;

  window.addEventListener("scroll", () => {
    if (!animated && isInViewport(skillsSection)) {
      animateSkills();
      animated = true;
    }
  });

  // Helper function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
});
