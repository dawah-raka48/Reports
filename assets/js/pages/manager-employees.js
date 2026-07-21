/* ==========================================
   Manager Employees
========================================== */

let employees = [];

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

    await loadEmployees();

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
   Load Employees
========================== */

async function loadEmployees(){

    try{

        const response =

            await ApiService.request(

                "getDepartmentEmployees",

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

                response.data.employees || [];

            renderEmployees();

            updateStatistics();

            return;

        }

        alert(

            response.data.message ||

            "تعذر تحميل الموظفين."

        );

    }

    catch(error){

        console.error(error);

        alert(

            "حدث خطأ أثناء تحميل الموظفين."

        );

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

    if(employees.length===0){

        container.innerHTML=`

        <div class="empty-state">

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

    container.innerHTML=

        employees.map(

            employee=>`

            <div class="employee-card">

                <div class="employee-header">

                    <h3>

                        ${employee.fullName}

                    </h3>

                    <span class="status">

                        ${employee.reportStatus}

                    </span>

                </div>

                <div class="employee-body">

                    <p>

                        <strong>

                            اسم المستخدم:

                        </strong>

                        ${employee.username}

                    </p>

                    <p>

                        <strong>

                            آخر أسبوع:

                        </strong>

                        ${employee.week}

                    </p>

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

        "employeesCount"

    ).textContent =

        employees.length;

    document.getElementById(

        "submittedCount"

    ).textContent =

        employees.filter(

            e=>e.reportStatus==="Submitted"

        ).length;

    document.getElementById(

        "missingCount"

    ).textContent =

        employees.filter(

            e=>e.reportStatus!=="Submitted"

        ).length;

}
