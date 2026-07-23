/* ==========================================
   MANAGER EMPLOYEES
   Weekly Reports System
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

async function initialize() {

    Theme.init();

    session = Auth.getSession();

    if (!session || session.role !== "manager") {

        window.location.href = "../../index.html";

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

function loadHeader() {

    document.getElementById(
        "departmentName"
    ).textContent = session.departmentName;

}

/* ==========================
   Clock
========================== */

function startClock() {

    updateClock();

    setInterval(
        updateClock,
        1000
    );

}

function updateClock() {

    const now = new Date();

    document.getElementById(
        "clock"
    ).textContent = now.toLocaleTimeString(
        "ar-SA",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );

}

/* ==========================
   Events
========================== */

function bindEvents() {

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            () => Auth.logout()
        );

}

/* ==========================
   Load Employees
========================== */

async function loadEmployees() {

    try {

        const response = await ApiService.request(
            "getDepartmentEmployeesWithReports",
            {
                departmentId: session.departmentId
            }
        );

        if (
            !response.success ||
            !response.data.success
        ) {

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

    catch (error) {

        console.error(error);

    }

}
/* ==========================
   Statistics
========================== */

function updateStatistics() {

    const totalEmployees = employees.length;

    let submitted = 0;

    let missing = 0;

    employees.forEach(employee => {

        if (employee.report) {

            submitted++;

        } else {

            missing++;

        }

    });

    document.getElementById(
        "employeesCount"
    ).textContent = totalEmployees;

    document.getElementById(
        "submittedCount"
    ).textContent = submitted;

    document.getElementById(
        "missingCount"
    ).textContent = missing;

}

/* ==========================
   Render Employees
========================== */

function renderEmployees() {

    const container =
        document.getElementById(
            "employeesContainer"
        );

    container.innerHTML = "";

    if (employees.length === 0) {

        container.innerHTML = `

            <div class="empty-card">

                <i class="fa-solid fa-users"></i>

                <h3>

                    لا يوجد موظفون

                </h3>

                <p>

                    لا يوجد موظفون في هذا القسم.

                </p>

            </div>

        `;

        return;

    }

    employees.forEach(employee => {

        container.insertAdjacentHTML(

            "beforeend",

            createEmployeeCard(employee)

        );

    });

    initializeAccordion();

}
/* ==========================
   Employee Card
========================== */

function createEmployeeCard(employee) {

    const report = employee.report;

    const week = report
        ? report.week
        : "-";

    const status = report
        ? report.status
        : "لم يرفع التقرير";

    const uploadDate = report
        ? (report.date || "-")
        : "-";

    const notes = report
        ? (report.managerNotes || "لا توجد")
        : "لا توجد";

    const statusClass = getStatusClass(status);

    return `

    <div class="employee-card">

        <div class="employee-header">

            <div>

                <div class="employee-name">

                    ${employee.fullName}

                </div>

                <div class="info-title">

                    الأسبوع ${week}

                </div>

            </div>

            <div class="actions">

                <span class="status ${statusClass}">

                    ${status}

                </span>

                <button
                    class="action-btn primary toggle-btn">

                    عرض التفاصيل

                </button>

            </div>

        </div>

        <div
            class="employee-details"
            style="display:none;">

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

            </div>

        </div>

    </div>

    `;

}

/* ==========================
   Status Class
========================== */

function getStatusClass(status){

    const value = String(status).toLowerCase();

    if(
        value.includes("approved")
        ||
        value.includes("اعتماد")
    ){

        return "approved";

    }

    if(
        value.includes("rejected")
        ||
        value.includes("رفض")
    ){

        return "rejected";

    }

    if(
        value.includes("pending")
        ||
        value.includes("قيد")
    ){

        return "pending";

    }

    return "pending";

}
/* ==========================
   Accordion
========================== */

function initializeAccordion() {

    const buttons = document.querySelectorAll(".toggle-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const currentCard =
                button.closest(".employee-card");

            const currentBody =
                currentCard.querySelector(".employee-details");

            const isOpen =
                currentBody.style.display === "block";

            /* إغلاق جميع البطاقات */

            document
                .querySelectorAll(".employee-details")
                .forEach(body => {

                    body.style.display = "none";

                });

            document
                .querySelectorAll(".toggle-btn")
                .forEach(btn => {

                    btn.textContent = "عرض التفاصيل";

                });

            /* إذا كانت البطاقة مغلقة افتحها */

            if (!isOpen) {

                currentBody.style.display = "block";

                button.textContent = "إخفاء التفاصيل";

            }

        });

    });

}
