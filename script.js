
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});

const filterButtons = document.querySelectorAll(".filter-btn");
const menuItems = document.querySelectorAll(".menu-item");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // active button style
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    

    const category = btn.dataset.category;

    menuItems.forEach((item) => {
      if (category === "all" || item.dataset.category === category) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

const reservationForm = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");

reservationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;

  if (!name || !email || !date || !time || !guests) {
    formMessage.textContent = "Please fill in all required fields.";
    formMessage.style.color = "red";
    return;
  }

  formMessage.textContent = `Thanks, ${name}! Your reservation for ${guests} guest(s) on ${date} at ${time} has been received.`;
  formMessage.style.color = "green";

  reservationForm.reset();
});
document.getElementById("year").textContent = new Date().getFullYear();
