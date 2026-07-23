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
/* ==========================
   Load Employees
========================== */

async function loadEmployees(){

    const response = await ApiService.request(

        "getDepartmentEmployeesWithReports",

        {

            departmentId:

                session.departmentId

        }

    );

    if(

        response.success &&

        response.data.success

    ){

        employees =

            response.data.employees;

        renderEmployees();

    }

}
/* ==========================
   Render Employees
========================== */

function renderEmployees(){

    const container =

        document.getElementById(

            "employeesContainer"

        );

    document.getElementById(

        "employeesCount"

    ).textContent =

        employees.length;

    document.getElementById(

        "submittedCount"

    ).textContent =

        "0";

    document.getElementById(

        "missingCount"

    ).textContent =

        employees.length;

    if(

        employees.length === 0

    ){

        container.innerHTML =

        `

        <div class="empty-card">

            <i class="fa-solid fa-users"></i>

            <h3>

                لا يوجد موظفون

            </h3>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    employees.forEach(

        employee=>{

            container.innerHTML += createEmployeeCard(employee);

        }

    );

}
/* ==========================
   Employee Card
========================== */

function createEmployeeCard(employee){

    const report = employee.report;

    const status = report
        ? report.status
        : "لم يرفع التقرير";

    const week = report
        ? report.week
        : "-";

    const button = report
        ? `
        <a
            href="${report.driveUrl}"
            target="_blank"
            class="btn-primary">

            عرض التقرير

        </a>
        `
        : `
        <button
            class="btn-secondary"
            disabled>

            لا يوجد تقرير

        </button>
        `;

    return `

    <div class="employee-card">

        <div class="employee-info">

            <h3>

                ${employee.fullName}

            </h3>

            <p>

                ${employee.username}

            </p>

        </div>

        <div class="employee-report">

            <span>

                الأسبوع

            </span>

            <strong>

                ${week}

            </strong>

        </div>

        <div class="employee-status">

            <span>

                الحالة

            </span>

            <strong>

                ${status}

            </strong>

        </div>

        <div class="employee-actions">

            ${button}

        </div>

    </div>

    `;

}
