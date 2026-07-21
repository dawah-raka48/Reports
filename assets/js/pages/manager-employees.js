/* ==========================================
   Manager Employees
========================================== */

let session = null;

let employees = [];

/* ==========================
   Initialize
========================== */

document.addEventListener(

    "DOMContentLoaded",

    initialize

);

async function initialize(){

    Theme.init();

    session = Auth.getSession();

    if(

        !session ||

        session.role !== "manager"

    ){

        window.location.href =

            "../../index.html";

        return;

    }

    startClock();

    setupEvents();

    loadHeader();

    await loadEmployees();

}
/* ==========================
   Header
========================== */

function loadHeader(){

    document.getElementById(

        "departmentName"

    ).textContent =

        session.departmentName;

}

/* ==========================
   Clock
========================== */

function startClock(){

    updateClock();

    setInterval(

        updateClock,

        1000

    );

}

function updateClock(){

    const now = new Date();

    document.getElementById(

        "clock"

    ).textContent =

        now.toLocaleTimeString(

            "ar-SA",

            {

                hour:"2-digit",

                minute:"2-digit",

                second:"2-digit",

                hour12:true

            }

        );

}
/* ==========================
   Events
========================== */

function setupEvents(){

    document

        .getElementById(

            "logoutBtn"

        )

        .addEventListener(

            "click",

            logout

        );

}

function logout(){

    localStorage.removeItem(

        "session"

    );

    window.location.href =

        "../../index.html";

}
