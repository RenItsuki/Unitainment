document.querySelectorAll(".remove-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (!window.confirm("Remove this item from your list?")) {
            event.preventDefault();
        }
    });
});

window.setTimeout(() => {
    document.querySelectorAll(".message").forEach((message) => {
        message.style.opacity = "0";
        message.style.transform = "translateY(-6px)";
        message.style.transition = "0.25s ease";
        window.setTimeout(() => message.remove(), 260);
    });
}, 3200);
