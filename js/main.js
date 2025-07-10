function loadImage(id, targetId) {
  var el = document.getElementById(id);
  var targetEl = targetId ? document.getElementById(targetId) : el;
  var imageToLoad;
  if (el && el.dataset && el.dataset.image) {
    imageToLoad = el.dataset.image;
  } else if (el && typeof el.currentSrc === 'undefined') {
    imageToLoad = el.src;
  } else if (el) {
    imageToLoad = el.currentSrc;
  }
  if (imageToLoad) {
    var img = new Image();
    img.src = imageToLoad;
    img.onload = function() {
      targetEl.classList.add('is-loaded');
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadImage('wallpaper');
  loadImage('pictureImage', 'picture');

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  // Typewriter effect for subtitle (multi-text, looping)
  const subtitle = document.getElementById('typewriter-subtitle');
  if (subtitle) {
    const texts = [
      'Fullstack Developer',
      'UI/UX Designer',
      'Open Source Enthusiast',
      'Tech Explorer'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let typing = true;
    let cursorSpan = document.createElement('span');
    cursorSpan.className = 'typewriter-cursor';
    cursorSpan.textContent = '|';
    subtitle.textContent = '';
    subtitle.appendChild(cursorSpan);

    function type() {
      if (typing) {
        if (charIndex < texts[textIndex].length) {
          subtitle.textContent = texts[textIndex].substring(0, charIndex + 1);
          subtitle.appendChild(cursorSpan);
          charIndex++;
          setTimeout(type, 70);
        } else {
          typing = false;
          setTimeout(type, 1200);
        }
      } else {
        if (charIndex > 0) {
          subtitle.textContent = texts[textIndex].substring(0, charIndex - 1);
          subtitle.appendChild(cursorSpan);
          charIndex--;
          setTimeout(type, 30);
        } else {
          typing = true;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 400);
        }
      }
    }
    type();
  }

  // Parallax effect for dots/shapes
  const dots = document.querySelectorAll('.dot, .shape-star');
  document.addEventListener('mousemove', function (e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    dots.forEach((dot, idx) => {
      const factor = 10 + idx * 6;
      dot.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
});

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    this.reset();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add typing effect to the name
const nameElement = document.querySelector('.name');
const nameText = nameElement.textContent;
nameElement.textContent = '';

let i = 0;
function typeWriter() {
    if (i < nameText.length) {
        nameElement.textContent += nameText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing effect when page loads
window.addEventListener('load', typeWriter);

// Form Submission
const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    result.innerHTML = "Please wait...";
    result.className = 'form-result';
    result.style.display = 'block';

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            result.innerHTML = "Message sent successfully!";
            result.className = 'form-result success';
        } else {
            result.innerHTML = json.message;
            result.className = 'form-result error';
        }
    })
    .catch(error => {
        console.log(error);
        result.innerHTML = "Something went wrong!";
        result.className = 'form-result error';
    })
    .then(function() {
        form.reset();
        setTimeout(() => {
            result.style.opacity = '0';
            result.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                result.style.display = 'none';
            }, 300);
        }, 3000);
    });
});