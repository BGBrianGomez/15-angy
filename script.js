const eventData = {
  title: "Mis 15",
  names: "Angelina",
  eventDateTime: "2026-05-23T21:00:00",
  date: "23 de Mayo de 2026",
  time: "21 hs",
  venue: "SALON LA RIBERA",
  address: "Ubicacion exacta disponible en Google Maps",
  mapsUrl: "https://maps.app.goo.gl/72uMiHDAcjMvQK196",
  rsvpUrl:
    "https://script.google.com/macros/s/AKfycbzMRU7CKJKLtDH36ulBLAb1Wv6UKerpkfjsseOY29RUp1uN7bbtNHvqLrPM-s4ZnV7DTA/exec",
  accentColor: "#d4af37",
};

const timelineSteps = [
  {
    time: "21:00 hs",
    title: "Bienvenida",
    description: "Recibimos a nuestros invitados",
    icon: "sparkles",
  },
  {
    time: "22:00 hs",
    title: "Cena",
    description: "Compartimos una noche especial",
    icon: "heart",
  },
  {
    time: "00:00 hs",
    title: "Fiesta",
    description: "Bailamos y celebramos mis 15",
    icon: "party",
  },
];

const iconMarkup = {
  sparkles: `
    <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
      <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" fill="currentColor"></path>
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" fill="currentColor"></path>
      <path d="M5 15l.9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15Z" fill="currentColor"></path>
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `,
  party: `
    <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
      <path d="M5 3l16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M6 4l4 1-5 5-1-4 2-2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
      <path d="M14 14l6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M15 4h.01M19 6h.01M17 9h.01" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
    </svg>
  `,
};

function setStaticContent() {
  document.title = `${eventData.title} | ${eventData.names}`;
  document.getElementById("hero-title").textContent = eventData.title.toUpperCase();
  document.getElementById("hero-name").textContent = eventData.names;
  document.getElementById("hero-date-time").textContent = `${eventData.date} · ${eventData.time}`;
  document.getElementById("detail-date").textContent = eventData.date;
  document.getElementById("detail-time").textContent = eventData.time;
  document.getElementById("detail-venue").textContent = eventData.venue;
  document.getElementById("location-venue").textContent = eventData.venue;
  document.getElementById("location-address").textContent = eventData.address;

  const mapsLink = document.getElementById("maps-link");
  mapsLink.href = eventData.mapsUrl;

  document.getElementById("footer-name").textContent = `✨ ${eventData.names} ✨`;
  document.getElementById("footer-name").style.color = eventData.accentColor;
  document.getElementById("footer-date-time").textContent = `${eventData.date} · ${eventData.time}`;
  document.getElementById("footer-venue").textContent = eventData.venue;
  document.getElementById("footer-address").textContent = eventData.address;
}

function calculateTimeLeft() {
  const difference = new Date(eventData.eventDateTime) - new Date();

  if (difference <= 0) return null;

  return {
    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((difference / 1000 / 60) % 60),
    segundos: Math.floor((difference / 1000) % 60),
  };
}

function renderCountdown() {
  const section = document.getElementById("countdown-section");
  const grid = document.getElementById("countdown-grid");
  const timeLeft = calculateTimeLeft();

  if (!timeLeft) {
    section.innerHTML = `
      <div class="section-inner countdown-inner">
        <p class="success-title">✨ ¡Hoy es el gran día! ✨</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = Object.entries(timeLeft)
    .map(
      ([label, value]) => `
        <div class="countdown-card">
          <div class="countdown-value">${value}</div>
          <div class="countdown-label">${label}</div>
        </div>
      `,
    )
    .join("");
}

function renderTimeline() {
  const grid = document.getElementById("timeline-grid");

  grid.innerHTML = timelineSteps
    .map(
      (step) => `
        <article class="timeline-card">
          <div class="icon-wrap">${iconMarkup[step.icon]}</div>
          <p class="timeline-time">${step.time}</p>
          <h3 class="timeline-title">${step.title}</h3>
          <p class="timeline-description">${step.description}</p>
        </article>
      `,
    )
    .join("");
}

function setupFadeSections() {
  const sections = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  sections.forEach((section) => observer.observe(section));
}

function createGuestInput(index, value = "") {
  const input = document.createElement("input");
  input.type = "text";
  input.name = `guest-${index + 2}`;
  input.className = "field";
  input.required = true;
  input.placeholder = `Acompañante ${index + 2} - Nombre y apellido`;
  input.value = value;
  return input;
}

function syncGuestInputs() {
  const guestsInput = document.getElementById("guests");
  const guestNamesWrap = document.getElementById("guest-names");
  const totalGuests = Math.max(1, Number(guestsInput.value) || 1);
  const currentValues = Array.from(guestNamesWrap.querySelectorAll("input")).map(
    (input) => input.value,
  );

  guestNamesWrap.innerHTML = "";

  for (let index = 0; index < totalGuests - 1; index += 1) {
    guestNamesWrap.appendChild(createGuestInput(index, currentValues[index] || ""));
  }
}

function toggleAttendanceFields() {
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
  const attendanceFields = document.getElementById("attendance-fields");
  const guestsInput = document.getElementById("guests");
  const guestInputs = document.querySelectorAll("#guest-names input");
  const songInput = document.getElementById("song");

  if (attendance === "yes") {
    attendanceFields.classList.remove("hidden");
    guestsInput.required = true;
    guestInputs.forEach((input) => {
      input.required = true;
    });
    songInput.required = false;
  } else {
    attendanceFields.classList.add("hidden");
    guestsInput.required = false;
    guestInputs.forEach((input) => {
      input.required = false;
    });
    songInput.required = false;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = document.getElementById("submit-button");
  const successState = document.getElementById("rsvp-success");
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value || "yes";
  const guestNames =
    attendance === "yes"
      ? Array.from(document.querySelectorAll("#guest-names input")).map((input) => input.value)
      : [];

  const payload = {
    name: document.getElementById("name").value,
    attendance,
    guests: attendance === "yes" ? Number(document.getElementById("guests").value) || 1 : 0,
    guestNames,
    song: attendance === "yes" ? document.getElementById("song").value : "",
    message: document.getElementById("message").value,
  };

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  const body = new URLSearchParams({
    ...payload,
    guestNames: JSON.stringify(payload.guestNames),
  });

  try {
    await fetch(eventData.rsvpUrl, {
      method: "POST",
      mode: "no-cors",
      body,
    });

    form.classList.add("hidden");
    successState.classList.remove("hidden");
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Enviar respuesta";
    alert("No se pudo enviar la respuesta. Intentá nuevamente.");
  }
}

function setupForm() {
  const form = document.getElementById("rsvp-form");
  const guestsInput = document.getElementById("guests");
  const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

  syncGuestInputs();
  toggleAttendanceFields();

  guestsInput.addEventListener("input", syncGuestInputs);
  attendanceInputs.forEach((input) => {
    input.addEventListener("change", () => {
      syncGuestInputs();
      toggleAttendanceFields();
    });
  });

  form.addEventListener("submit", handleFormSubmit);
}

setStaticContent();
renderCountdown();
renderTimeline();
setupFadeSections();
setupForm();

window.setInterval(renderCountdown, 1000);
