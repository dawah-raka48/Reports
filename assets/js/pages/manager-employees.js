/* ==========================================
   MANAGER EMPLOYEES
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

    bindEvents();

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

function bindEvents(){

    document

        .getElementById(

            "logoutBtn"

        )

        .addEventListener(

            "click",

            ()=>{

                Auth.logout();

            }

        );

}
/* ==========================
   Load Employees
========================== */

async function loadEmployees(){

    try{

        const response = await ApiService.request(

            "getDepartmentEmployeesWithReports",

            {

                departmentId:

                    session.departmentId

            }

        );

        if(

            !response.success ||

            !response.data.success

        ){

            console.error(

                response.data.message

            );

            return;

        }

        employees =

            response.data.employees || [];

        updateStatistics();

        renderEmployees();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================
   Statistics
========================== */

function updateStatistics(){

    const totalEmployees =

        employees.length;

    let submitted = 0;

    let missing = 0;

    employees.forEach(

        employee=>{

            if(

                employee.report

            ){

                submitted++;

            }

            else{

                missing++;

            }

        }

    );

    document.getElementById(

        "employeesCount"

    ).textContent =

        totalEmployees;

    document.getElementById(

        "submittedCount"

    ).textContent =

        submitted;

    document.getElementById(

        "missingCount"

    ).textContent =

        missing;

}
/* ==========================
   Render Employees
========================== */

function renderEmployees(){

    const container =

        document.getElementById(

            "employeesContainer"

        );

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

            <p>

                لا يوجد موظفون داخل هذا القسم.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    employees.forEach(

        employee=>{

            container.insertAdjacentHTML(

                "beforeend",

                createEmployeeAccordion(employee)

            );

        }

    );

    initializeAccordion();

}

/* ==========================
   Employee Accordion
========================== */

function createEmployeeAccordion(employee){

    const report = employee.report;

    const week =

        report

            ? report.week

            : "-";

    const status =

        report

            ? report.status

            : "لم يرفع التقرير";

    const uploadDate =

        report

            ? report.date

            : "-";

    const notes =

        report && report.managerNotes

            ? report.managerNotes

            : "لا توجد";

    const statusClass =

        report

            ? report.status.toLowerCase()

            : "missing";

    return `

    <article class="employee-item">

        <div class="employee-header">

            <div class="employee-info">

                <h3 class="employee-name">

                    ${employee.fullName}

                </h3>

                <span class="employee-week">

                    ${week}

                </span>

            </div>

            <div class="employee-status ${statusClass}">

                ${status}

            </div>

            <div class="employee-arrow">

                <i class="fa-solid fa-chevron-down"></i>

            </div>

        </div>

        <div class="employee-body">

            <div class="info-grid">

                <div class="info-card">

                    <div class="info-title">

                        اسم المستخدم

                    </div>

                    <div class="info-value">

                        ${employee.username}

                    </div>

                </div>

                <div class="info-card">

                    <div class="info-title">

                        تاريخ الرفع

                    </div>

                    <div class="info-value">

                        ${uploadDate}

                    </div>

                </div>

                <div class="info-card">

                    <div class="info-title">

                        ملاحظات المدير

                    </div>

                    <div class="info-value">

                        ${notes}

                    </div>

                </div>

            </div>

        </div>

    </article>

    `;

}

/* ==========================
   Accordion
========================== */

function initializeAccordion(){

    document

        .querySelectorAll(

            ".employee-header"

        )

        .forEach(

            header=>{

                header.onclick = ()=>{

                    header

                        .parentElement

                        .classList

                        .toggle(

                            "open"

                        );

                };

            }

        );

}
