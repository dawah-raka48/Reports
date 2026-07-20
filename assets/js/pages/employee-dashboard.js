/* ==========================================
   EMPLOYEE DASHBOARD
   Weekly Reports System
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    checkSession();

    startClock();

    initializeButtons();

    loadEmployee();

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

    if(session.role!=="employee"){

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

    const now = new Date();

    document.getElementById("clock").textContent =

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
    .getElementById("newReportBtn")
    .addEventListener(
        "click",
        ()=>{

            alert
            
            ("سيتم إنشاء صفحة تقاريري.");

        }
    );

    document

        .getElementById("myReportsBtn")

        .addEventListener(

            "click",

            ()=>{

                window.location.href="my-reports.html";"سيتم إنشاء صفحة تقاريري."

                );

            }

        );

}

/* ==========================
   Load Employee
========================== */

function loadEmployee(){

    const session = JSON.parse(

        localStorage.getItem("session")

    );

    document.getElementById(

        "employeeName"

    ).textContent =

        session.fullName;

    document.getElementById(

        "departmentName"

    ).textContent =

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
