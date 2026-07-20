/* ==========================================
   ADMIN DASHBOARD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    loadSession();

    startClock();

    initializeButtons();

    initializeLogout();

});


/* ==========================
   Session
========================== */

function loadSession() {

    const session = JSON.parse(

        localStorage.getItem("session")

    );

    if (!session) {

        window.location.href = "../../index.html";

        return;

    }

    document.getElementById("adminName").textContent =

        session.fullName;

}


/* ==========================
   Clock
========================== */

function startClock() {

    const clock = document.getElementById("clock");

    function update() {

        const now = new Date();

        clock.textContent =

            now.toLocaleTimeString("ar-SA");

    }

    update();

    setInterval(update,1000);

}


/* ==========================
   Logout
========================== */

function initializeLogout() {

    document

        .getElementById("logoutBtn")

        .addEventListener("click",()=>{

            localStorage.removeItem("session");

            window.location.href="../../index.html";

        });

}


/* ==========================
   Buttons
========================== */

function initializeButtons() {

    document

        .querySelectorAll(".menu-card")

        .forEach(card=>{

            card.addEventListener("click",()=>{

                alert("قريباً");

            });

        });

}
