/* ==========================================
   THEME.JS
========================================== */

const Theme = {

    storageKey: "reports-theme",

    init() {

        const savedTheme =
            localStorage.getItem(this.storageKey) || "light";

        this.apply(savedTheme);

        const button = document.getElementById("themeToggle");

        if (button) {

            button.addEventListener("click", () => {

                this.toggle();

            });

        }

    },

    toggle() {

        const current =
            document.documentElement.getAttribute("data-theme") || "light";

        const next =
            current === "light"
                ? "dark"
                : "light";

        this.apply(next);

    },

    apply(theme) {

        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem(this.storageKey, theme);

        this.updateIcon(theme);

    },

    updateIcon(theme) {

        const icon =
            document.querySelector("#themeToggle i");

        if (!icon) return;

        if (theme === "dark") {

            icon.className = "fa-solid fa-sun";

        } else {

            icon.className = "fa-solid fa-moon";

        }

    }

};
