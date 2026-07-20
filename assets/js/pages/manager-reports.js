/* ==========================================
   Manager Reports
========================================== */

let reports = [];

let session = null;

/* ==========================
   Initialize
========================== */

document.addEventListener(

    "DOMContentLoaded",

    initialize

);

async function initialize(){

    session = Auth.getSession();

    if(

        !session ||

        session.role !== "manager"

    ){

        window.location.href =

            "../../index.html";

        return;

    }

    document.getElementById(

        "departmentName"

    ).textContent =

        session.departmentName;

    setupBackButton();

    await loadReports();

}
/* ==========================
   Back Button
========================== */

function setupBackButton(){

    document

        .getElementById(

            "backBtn"

        )

        .addEventListener(

            "click",

            ()=>{

                window.location.href =

                "dashboard.html";

            }

        );

}

/* ==========================
   Load Reports
========================== */

async function loadReports(){

    try{

        const response =

            await ApiService.request(

                "getDepartmentReports",

                {

                    departmentId:

                        session.departmentId

                }

            );

        if(

            response.success &&

            response.data.success

        ){

            reports =

                response.data.reports || [];

            renderReports();

            updateStatistics();

            return;

        }

        alert(

            response.data.message ||

            "تعذر تحميل التقارير."

        );

    }

    catch(error){

        console.error(error);

        alert(

            "حدث خطأ أثناء تحميل التقارير."

        );

    }

}
/* ==========================
   Render Reports
========================== */

function renderReports(){

    const container =

        document.getElementById(

            "reportsContainer"

        );

    if(reports.length===0){

        container.innerHTML=`

        <div class="empty-state">

            <i class="fa-regular fa-folder-open"></i>

            <h3>

                لا توجد تقارير

            </h3>

            <p>

                لم يتم رفع أي تقارير لهذا القسم.

            </p>

        </div>

        `;

        return;

    }

    container.innerHTML=

        reports.map(

            report=>`

            <div class="report-card">

                <div class="report-header">

                    <h3>

                        ${report.fullName}

                    </h3>

                    <span class="status ${report.status.toLowerCase()}">

                        ${report.status}

                    </span>

                </div>

                <div class="report-body">

                    <p>

                        <strong>

                            الأسبوع:

                        </strong>

                        ${report.week}

                    </p>

                    <p>

                        <strong>

                            تاريخ الرفع:

                        </strong>

                        ${report.uploadDate}

                    </p>

                </div>

                <div class="report-actions">

                    <button

                        onclick="openReport('${report.driveUrl}')"

                        class="btn-primary">

                        عرض التقرير

                    </button>

                    <button

                        onclick="approveReport('${report.reportId}')"

                        class="btn-success">

                        اعتماد

                    </button>

                    <button

                        onclick="rejectReport('${report.reportId}')"

                        class="btn-danger">

                        رفض

                    </button>

                </div>

            </div>

        `

        ).join("");

}

/* ==========================
   Statistics
========================== */

function updateStatistics(){

    document.getElementById(

        "reportsCount"

    ).textContent=

        reports.length;

    document.getElementById(

        "pendingCount"

    ).textContent=

        reports.filter(

            r=>r.status==="Pending"

        ).length;

    document.getElementById(

        "approvedCount"

    ).textContent=

        reports.filter(

            r=>r.status==="Approved"

        ).length;

}
/* ==========================
   Open Report
========================== */

function openReport(url){

    window.open(

        url,

        "_blank"

    );

}

/* ==========================
   Approve Report
========================== */

async function approveReport(reportId){

    const response = await ApiService.request(

        "approveReport",

        {

            reportId:reportId

        }

    );

    if(

        response.success &&

        response.data.success

    ){

        await loadReports();

        return;

    }

    alert(

        response.data.message ||

        "تعذر اعتماد التقرير."

    );

}

/* ==========================
   Reject Report
========================== */

async function rejectReport(reportId){

    const reason = prompt(

        "سبب الرفض"

    );

    if(

        reason===null

    ) return;

    const response = await ApiService.request(

        "rejectReport",

        {

            reportId:reportId,

            reason:reason

        }

    );

    if(

        response.success &&

        response.data.success

    ){

        await loadReports();

        return;

    }

    alert(

        response.data.message ||

        "تعذر رفض التقرير."

    );

}