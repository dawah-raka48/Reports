/* ==========================================
   AUTH.JS
========================================== */

const Auth = {

    login() {

        console.log("Login");

    },

    logout() {

        localStorage.removeItem("session");

        window.location.href = "../../index.html";

    },

    getSession() {

        const session = localStorage.getItem("session");

        if (!session) {

            return null;

        }

        return JSON.parse(session);

    },

    isLoggedIn() {

        return this.getSession() !== null;

    }

};
