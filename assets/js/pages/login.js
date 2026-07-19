/* ==========================================
   LOGIN.JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value
            .trim();

        if (!username || !password) {

            alert("يرجى إدخال اسم المستخدم وكلمة المرور");

            return;

        }

        const response = await ApiService.request("login", {

            username,

            password

        });

        console.log(response);

        if (!response.success) {

            alert(response.message);

            return;

        }

        if (!response.data.success) {

            alert(response.data.message);

            return;

        }

        const user = response.data.user;

        localStorage.setItem(

            "session",

            JSON.stringify(user)

        );

        switch (user.role) {

            case "owner":

                window.location.href = "pages/admin/dashboard.html";

                break;

            case "manager":

                window.location.href = "pages/manager/dashboard.html";

                break;

            case "employee":

                window.location.href = "pages/employee/dashboard.html";

                break;

            default:

                alert("صلاحية غير صحيحة");

        }

    });

});
