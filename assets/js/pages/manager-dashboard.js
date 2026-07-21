/* ==========================================
   MANAGER DASHBOARD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    checkSession();

    startClock();

    initializeButtons();

    loadManager();

});


/* ==========================
   Session
========================== */

function checkSession(){

    const session = JSON.parse(

        localStorage.getItem("session")

    );

    if(!session){

        window.location.href="../../index.html";

        return;

    }

    if(session.role!=="manager"){

        window.location.href="../../index.html";

        return;

    }

}


/* ==========================
   Clock
========================== */

function startClock(){

    updateClock();

    setInterval(updateClock,1000);

}

function updateClock(){

    const now=new Date();

    document.getElementById("clock").textContent=

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
   Buttons
========================== */

function initializeButtons(){

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            logout
        );

    document
        .getElementById("employeesBtn")
        .addEventListener(
            "click",
            ()=>{

                window.location.href =
                "employees.html";

            }
        );

    document
        .getElementById("reportsBtn")
        .addEventListener(
            "click",
            ()=>{

                window.location.href =
                "manager-reports.html";

            }
        );

}
/* ==========================
   Load Manager
========================== */

function loadManager(){

    const session=JSON.parse(

        localStorage.getItem("session")

    );

    document.getElementById(

        "managerName"

    ).textContent=

        session.fullName;

    document.getElementById(

        "departmentName"

    ).textContent=

        session.departmentName || "...";

}


/* ==========================
   Logout
========================== */

function logout(){

    localStorage.removeItem(

        "session"

    );

    window.location.href="../../index.html";

}
