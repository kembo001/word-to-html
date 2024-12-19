import DOMPurify from "dompurify";

// Normalize and clean HTML content
export const cleanHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove unnecessary span tags
  Array.from(tempDiv.querySelectorAll("span")).forEach((span) => {
    if (!span.attributes.length) {
      span.replaceWith(span.innerHTML);
    }
  });

  // Remove aria-level attributes
  Array.from(tempDiv.querySelectorAll("[aria-level]")).forEach((node) => {
    node.removeAttribute("aria-level");
  });

  // Remove unnecessary br tags
  Array.from(tempDiv.querySelectorAll("br")).forEach((br) => {
    br.remove();
  });
  
    // Helper function to capitalize each word
    const capitalizeWords = (str) => {
      return str
        .split("-") // Split words by hyphen
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" ");
    };
  
    // Simplify links and add titles
    Array.from(tempDiv.querySelectorAll("a")).forEach((link) => {
      const href = link.getAttribute("href");
  
      if (href && href.includes("tritonsetup")) {
        // Simplify URL by converting to relative path
        const relativePath = href.replace(/^https?:\/\/[^/]+/, ""); // Remove protocol and domain
        link.setAttribute("href", relativePath); // Update the link to use the relative path
      }
  
      // Add or update title attribute based on relative path
      const relativePath = link.getAttribute("href"); // Get the updated relative path
      if (relativePath) {
        const pathSegments = relativePath.split("/").filter(Boolean); // Split path into segments
        const lastSegment = pathSegments.pop(); // Get the last segment
        if (lastSegment) {
          const formattedTitle = capitalizeWords(lastSegment); // Capitalize the last segment
          link.setAttribute("title", formattedTitle); // Set the title attribute
        }
      }
    });
  
    // Remove <p> tags inside <li> elements
    Array.from(tempDiv.querySelectorAll("li")).forEach((li) => {
      Array.from(li.querySelectorAll("p")).forEach((p) => {
        p.replaceWith(...p.childNodes); // Replace <p> with its content
      });
    });

    // Remove <p> tags inside <li> elements
Array.from(tempDiv.querySelectorAll("li")).forEach((li) => {
    Array.from(li.querySelectorAll("p")).forEach((p) => {
      p.replaceWith(...p.childNodes); // Replace <p> with its content
    });
  });
//   ------------------------------------------------------------------------- NICHE CODE THAT COULD POSSIBLY CHANGE ANYTIME ---------------------------------------


  // Convert <p> tags with square brackets to <a> tags
  Array.from(tempDiv.querySelectorAll("p")).forEach((p) => {
    const match = p.textContent.trim().match(/^\[(.+?)\]$/); // Check if content is in [brackets]
    if (match) {
      const text = match[1]; // Extract text inside brackets
      const link = document.createElement("a");
      link.textContent = text;
      link.setAttribute("href", "/free-estimate"); // Adjust the href value as needed
      link.setAttribute("class", "button button--primary");
      link.setAttribute("title", capitalizeWords(text)); // Use the capitalizeWords helper for the title
      p.replaceWith(link); // Replace the <p> tag with the <a> tag
    }
  });
  
  
    // Add "uvp" class to <ul> tags following an <h1>
    Array.from(tempDiv.querySelectorAll("ul")).forEach((ul) => {
      const previousElement = ul.previousElementSibling; // Get the element before the <ul>
      if (previousElement && previousElement.tagName === "H1") {
        ul.classList.add("uvp"); // Add the "uvp" class if preceded by <h1>
      }
    });

//   ------------------------------------------------------------------------- NICHE CODE THAT COULD POSSIBLY CHANGE ANYTIME ---------------------------------------


  
    // Use DOMPurify to sanitize the cleaned HTML
    return DOMPurify.sanitize(tempDiv.innerHTML, {
        ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "b", "i", "u", "strong", "em"],
        ALLOWED_ATTR: ["href", "title", "class"],
      });
    
  };
  
  