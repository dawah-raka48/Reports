/* ==========================================
   Manager Reports
========================================== */

let session = null;

let reports = [];

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

    await loadReports();

}
/* ==========================
   Header
========================== */

function loadHeader(){

    document.getElementById(

        "departmentName"

    ).textContent =

        session.departmentName ||

        "...";

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

            ()=>{

                Auth.logout();

            }

        );

}
/* ==========================
   Load Reports
========================== */

async function loadReports(){

    console.log(

        "Loading Reports..."

    );

}
/* ==========================
   Load Reports
========================== */

async function loadReports(){

    try{

        const response = await ApiService.request(

            "getDepartmentReports",

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

        reports =

            response.data.reports || [];

        filteredReports =

            [...reports];

        fillWeekFilter();

        updateStatistics();

        renderReports();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================
   Week Filter
========================== */

function fillWeekFilter(){

    const select =

        document.getElementById(

            "weekFilter"

        );

    const weeks =

        [...new Set(

            reports.map(

                report=>report.week

            )

        )];

    weeks.forEach(

        week=>{

            const option =

                document.createElement(

                    "option"

                );

            option.value = week;

            option.textContent = week;

            select.appendChild(

                option

            );

        }

    );

}

/* ==========================
   Statistics
========================== */

function updateStatistics(){

    document.getElementById(

        "reportsCount"

    ).textContent =

        filteredReports.length;

    document.getElementById(

        "pendingCount"

    ).textContent =

        filteredReports.filter(

            report=>report.status==="Pending"

        ).length;

    document.getElementById(

        "approvedCount"

    ).textContent =

        filteredReports.filter(

            report=>report.status==="Approved"

        ).length;

}
/* ==========================
   Filter Reports
========================== */

function filterReports(){

    const search =

        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const week =

        document
            .getElementById("weekFilter")
            .value;

    const status =

        document
            .getElementById("statusFilter")
            .value;

    filteredReports = reports.filter(report=>{

        const matchName =

            report.employeeName
                .toLowerCase()
                .includes(search);

        const matchWeek =

            !week ||

            report.week == week;

        const matchStatus =

            !status ||

            report.status == status;

        return (

            matchName &&

            matchWeek &&

            matchStatus

        );

    });

    updateStatistics();

    renderReports();

}
/* ==========================
   Render Reports
========================== */

function renderReports(){

    const container =

        document.getElementById(

            "reportsContainer"

        );

    container.innerHTML = "";

    if(

        filteredReports.length===0

    ){

        container.innerHTML=`

        <div class="empty-card">

            <i class="fa-solid fa-file-circle-xmark"></i>

            <h3>

                لا توجد تقارير

            </h3>

            <p>

                لا توجد تقارير مطابقة.

            </p>

        </div>

        `;

        return;

    }

    filteredReports.forEach(report=>{

        container.insertAdjacentHTML(

            "beforeend",

            createReportCard(report)

        );

    });

    initializeReportCards();

}
/* ==========================
   Report Card
========================== */

function createReportCard(report){

    return `

    <div class="report-card">

        <div class="report-header">

            <div>

                <div class="report-title">

                    ${report.employeeName}

                </div>

                <div class="info-title">

                    ${report.week}

                </div>

            </div>

            <div class="actions">

                <span class="status ${report.status.toLowerCase()}">

                    ${report.status}

                </span>

                <button

                    class="action-btn primary report-toggle">

                    عرض التقرير

                </button>

            </div>

        </div>

        <div

            class="report-details"

            style="display:none;">

            <div class="report-info">

                <div class="info-row">

                    <span class="info-title">

                        تاريخ الرفع

                    </span>

                    <span class="info-value">

                        ${report.date}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-title">

                        ملاحظات المدير

                    </span>

                    <span class="info-value">

                        ${report.managerNotes || "لا توجد"}

                    </span>

                </div>

                <div class="actions">

                    <button

                        class="action-btn primary view-report"

                        data-id="${report.reportId}">

                        فتح التقرير

                    </button>

                    <button

                        class="action-btn success approve-report"

                        data-id="${report.reportId}">

                        اعتماد

                    </button>

                    <button

                        class="action-btn danger reject-report"

                        data-id="${report.reportId}">

                        رفض

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;

}
/* ==========================
   Report Accordion
========================== */

function initializeReportCards(){

    document

        .querySelectorAll(

            ".report-toggle"

        )

        .forEach(button=>{

            button.onclick=()=>{

                const card=

                    button.closest(

                        ".report-card"

                    );

                const body=

                    card.querySelector(

                        ".report-details"

                    );

                const opened=

                    body.style.display==="block";

                document

                    .querySelectorAll(

                        ".report-details"

                    )

                    .forEach(item=>{

                        item.style.display="none";

                    });

                document

                    .querySelectorAll(

                        ".report-toggle"

                    )

                    .forEach(btn=>{

                        btn.textContent="عرض التقرير";

                    });

                if(!opened){

                    body.style.display="block";

                    button.textContent="إخفاء التقرير";

                }

            };

        });

}

