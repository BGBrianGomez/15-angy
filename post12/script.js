const eventData = {
  title: "Mis 15",
  names: "Angelina",
  eventDateTime: "2026-05-24T00:00:00",
  date: "23 de Mayo de 2026",
  time: "00 hs",
  venue: "SALON LA RIBERA",
  address: "Ubicacion exacta disponible en Google Maps",
  mapsUrl: "https://maps.app.goo.gl/72uMiHDAcjMvQK196",
  rsvpUrl:
    "https://script.google.com/macros/s/AKfycbzMRU7CKJKLtDH36ulBLAb1Wv6UKerpkfjsseOY29RUp1uN7bbtNHvqLrPM-s4ZnV7DTA/exec",
  accentColor: "#d4af37",
  rsvpPhone: "5493436612949",
};

function setStaticContent() {
  document.title = `${eventData.title} | ${eventData.names}`;
  document.getElementById("hero-title").textContent = eventData.title;
  document.getElementById("hero-date-time").textContent =
    `${eventData.date} · ${eventData.time}`;
  document.getElementById("detail-date").textContent = eventData.date;
  document.getElementById("detail-time").textContent = eventData.time;
  document.getElementById("detail-venue").textContent = eventData.venue;
  document.getElementById("location-venue").textContent = eventData.venue;
  document.getElementById("location-address").textContent = eventData.address;

  const mapsLink = document.getElementById("maps-link");
  mapsLink.href = eventData.mapsUrl;

  document.getElementById("footer-name").textContent =
    `✨ ${eventData.names} ✨`;
  document.getElementById("footer-name").style.color = eventData.accentColor;
  document.getElementById("footer-date-time").textContent =
    `${eventData.date} · ${eventData.time}`;
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
  const currentValues = Array.from(
    guestNamesWrap.querySelectorAll("input"),
  ).map((input) => input.value);

  guestNamesWrap.innerHTML = "";

  for (let index = 0; index < totalGuests - 1; index += 1) {
    guestNamesWrap.appendChild(
      createGuestInput(index, currentValues[index] || ""),
    );
  }
}

function toggleAttendanceFields() {
  const attendance = document.querySelector(
    'input[name="attendance"]:checked',
  )?.value;
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
  const attendance =
    document.querySelector('input[name="attendance"]:checked')?.value || "yes";
  const guestNames =
    attendance === "yes"
      ? Array.from(document.querySelectorAll("#guest-names input")).map(
          (input) => input.value,
        )
      : [];

  const payload = {
    name: document.getElementById("name").value,
    attendance,
    guests:
      attendance === "yes"
        ? Number(document.getElementById("guests").value) || 1
        : 0,
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

function setupWhatsApp() {
  const message = encodeURIComponent(
    `Hola! Confirmo mi asistencia a los 15 de ${eventData.names} 🎉💖 mi documento y mi nombre completo son...`,
  );
  document.getElementById("whatsapp-link").href =
    `https://wa.me/${eventData.rsvpPhone}?text=${message}`;
}

setStaticContent();
renderCountdown();
setupFadeSections();
setupForm();

window.setInterval(renderCountdown, 1000);
