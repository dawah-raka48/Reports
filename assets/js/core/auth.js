/* ==========================================
   AUTH.JS
========================================== */

const Auth = {

    login() {

        console.log("Login");

    },

    logout() {

        localStorage.removeItem("session");

        window.location.href = "/";

    }

};
