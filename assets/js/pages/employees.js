/* ==========================================
   EMPLOYEES.JS
   Weekly Reports System
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    checkSession();

    initializeButtons();

    loadEmployees();

});


/* ==========================
   Check Session
========================== */

function checkSession() {

    const session = JSON.parse(

        localStorage.getItem("session")

    );

    if (!session) {

        window.location.href = "../../index.html";

        return;

    }

}


/* ==========================
   Initialize Buttons
========================== */

function initializeButtons() {

    document
        .getElementById("backBtn")
        .addEventListener("click", () => {

            window.location.href = "dashboard.html";

        });

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    document
        .getElementById("addEmployeeBtn")
        .addEventListener("click", () => {

            alert("سيتم إنشاء صفحة إضافة الموظف في المرحلة التالية.");

        });

    document
        .getElementById("searchInput")
        .addEventListener("input", searchEmployees);

}


/* ==========================
   Load Employees
========================== */

async function loadEmployees() {

    try {

        const response = await ApiService.request("getUsers");

        console.log(response);

        if (!response.success) {

            return;

        }

        if (!response.data.success) {

            return;

        }

        renderEmployees(

            response.data.users

        );

    }

    catch (error) {

        console.error(error);

    }

}


/* ==========================
   Render Employees
========================== */

function renderEmployees(users) {

    const tbody = document.getElementById(

        "employeesTable"

    );

    if (!users || users.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    لا يوجد موظفون

                </td>

            </tr>

        `;

        return;

    }

    tbody.innerHTML = "";

    users.forEach(user => {

        tbody.innerHTML += `

        <tr>

            <td>${user.fullName}</td>

            <td>${user.username}</td>

            <td>${user.departmentName}</td>

            <td>

                <span class="role">

                    ${user.role}

                </span>

            </td>

            <td>

                <span class="status ${user.isActive ? "active" : "inactive"}">

                    ${user.isActive ? "نشط" : "موقوف"}

                </span>

            </td>

            <td>

                <div class="actions">

                    <button

                        class="action-btn edit"

                        onclick="editEmployee('${user.userId}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button

                        class="action-btn delete"

                        onclick="deleteEmployee('${user.userId}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}


/* ==========================
   Search
========================== */

function searchEmployees() {

    const value = document

        .getElementById("searchInput")

        .value

        .toLowerCase();

    const rows = document.querySelectorAll(

        "#employeesTable tr"

    );

    rows.forEach(row => {

        row.style.display =

            row.innerText

                .toLowerCase()

                .includes(value)

                ? ""

                : "none";

    });

}


/* ==========================
   Edit Employee
========================== */

function editEmployee(userId) {

    alert(

        "سيتم إنشاء صفحة تعديل الموظف.\n\nID : " + userId

    );

}


/* ==========================
   Delete Employee
========================== */

function deleteEmployee(userId) {

    if (

        confirm(

            "هل تريد حذف الموظف؟"

        )

    ) {

        alert(

            "سيتم ربط الحذف مع Google Sheets.\n\nID : " + userId

        );

    }

}


/* ==========================
   Logout
========================== */

function logout() {

    localStorage.removeItem(

        "session"

    );

    window.location.href =

        "../../index.html";

}
