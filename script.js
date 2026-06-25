const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("感谢咨询，我们会尽快联系你。");
  });
}