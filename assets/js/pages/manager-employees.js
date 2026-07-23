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

    const week = report
        ? report.week
        : "-";

    const status = report
        ? report.status
        : "لم يرفع التقرير";

    const uploadDate = report
        ? report.date
        : "-";

    const notes =
        report && report.managerNotes
            ? report.managerNotes
            : "لا توجد";

    const statusClass =
        report
            ? report.status.toLowerCase()
            : "pending";

    return `

    <div class="employee-card">

        <div class="employee-header">

            <div>

                <div class="employee-name">

                    ${employee.fullName}

                </div>

                <div class="employee-week">

                    ${week}

                </div>

            </div>

            <div style="display:flex;align-items:center;gap:12px;">

                <span class="status ${statusClass}">

                    ${status}

                </span>

                <i class="fa-solid fa-chevron-down accordion-icon"></i>

            </div>

        </div>

        <div class="employee-details" style="display:none;">

            <div class="employee-info">

                <div class="info-row">

                    <span class="info-title">

                        اسم المستخدم

                    </span>

                    <span class="info-value">

                        ${employee.username}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        تاريخ الرفع

                    </span>

                    <span class="info-value">

                        ${uploadDate}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        ملاحظات المدير

                    </span>

                    <span class="info-value">

                        ${notes}

                    </span>

                </div>

                <div class="actions">

                    <button
                        class="action-btn primary">

                        عرض التفاصيل

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;

}
/* ==========================
   Accordion
========================== */

function initializeAccordion(){

    document
        .querySelectorAll(".employee-card")
        .forEach(card=>{

            const header =
                card.querySelector(".employee-header");

            const body =
                card.querySelector(".employee-details");

            const icon =
                card.querySelector(".accordion-icon");

            header.onclick = ()=>{

                const opened =
                    body.style.display === "block";

                body.style.display =
                    opened
                        ? "none"
                        : "block";

                icon.style.transform =
                    opened
                        ? "rotate(0deg)"
                        : "rotate(180deg)";

            };

        });

}
