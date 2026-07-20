/* ==========================================
   UPLOAD REPORT
   Weekly Reports System
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    Theme.init();

    checkSession();

    initializeButtons();

    loadEmployeeData();

    loadCurrentWeek();

    checkUploadWindow();

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
   Buttons
========================== */

function initializeButtons(){

    document

        .getElementById("backBtn")

        .addEventListener(

            "click",

            ()=>{

                window.location.href="dashboard.html";

            }

        );

    document

        .getElementById("pdfFile")

        .addEventListener(

            "change",

            fileSelected

        );

    document

        .getElementById("uploadBtn")

        .addEventListener(

            "click",

            uploadReport

        );

}
/* ==========================
   Employee Information
========================== */

function loadEmployeeData(){

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

        session.departmentName || session.departmentId;

    document.getElementById(

        "todayDate"

    ).textContent =

        new Date().toLocaleDateString(

            "ar-SA",

            {

                year:"numeric",

                month:"long",

                day:"numeric"

            }

        );

}

/* ==========================
   Current Week
========================== */

function loadCurrentWeek(){

    const today = new Date();

    const firstDay = new Date(

        today.getFullYear(),

        0,

        1

    );

    const days = Math.floor(

        (today - firstDay) / 86400000

    );

    const week = Math.ceil(

        (days + firstDay.getDay() + 1) / 7

    );

    document.getElementById(

        "weekNumber"

    ).textContent =

        "Week " + week;

}
/* ==========================
   Upload Window
========================== */

async function checkUploadWindow(){

    try{

        const response = await ApiService.request(

            "getUploadSettings"

        );

        if(

            !response.success ||

            !response.data.success

        ){

            showClosedStatus(

                "تعذر تحميل إعدادات النظام."

            );

            return;

        }

        const settings = response.data.settings;

        applyUploadStatus(

            settings

        );

    }

    catch(error){

        console.error(error);

        showClosedStatus(

            "حدث خطأ أثناء الاتصال بالخادم."

        );

    }

}

/* ==========================
   Apply Status
========================== */

function applyUploadStatus(settings){

    const statusCard = document.getElementById(

        "uploadStatus"

    );

    const uploadCard = document.getElementById(

        "uploadCard"

    );

    if(settings.isHoliday){

        statusCard.className =

            "status-card status-holiday";

        statusCard.innerHTML =

            "هذا الأسبوع إجازة، ولا يلزم رفع تقرير.";

        uploadCard.style.display = "none";

        return;

    }

    if(settings.isOpen){

        statusCard.className =

            "status-card status-open";

        statusCard.innerHTML =

            "نافذة رفع التقارير مفتوحة.";

        uploadCard.style.display = "block";

        return;

    }

    statusCard.className =

        "status-card status-closed";

    statusCard.innerHTML =

        "انتهت فترة رفع التقرير لهذا الأسبوع.";

    uploadCard.style.display = "none";

}

/* ==========================
   Closed Status
========================== */

function showClosedStatus(message){

    const statusCard = document.getElementById(

        "uploadStatus"

    );

    const uploadCard = document.getElementById(

        "uploadCard"

    );

    statusCard.className =

        "status-card status-closed";

    statusCard.innerHTML =

        message;

    uploadCard.style.display = "none";

}
/* ==========================
   Selected File
========================== */

let selectedPdf = null;

/* ==========================
   File Selected
========================== */

function fileSelected(event){

    const file = event.target.files[0];

    if(!file){

        selectedPdf = null;

        document.getElementById(

            "selectedFile"

        ).textContent =

            "لم يتم اختيار ملف";

        return;

    }

    if(file.type !== "application/pdf"){

        alert(

            "يسمح برفع ملفات PDF فقط."

        );

        event.target.value = "";

        selectedPdf = null;

        document.getElementById(

            "selectedFile"

        ).textContent =

            "لم يتم اختيار ملف";

        return;

    }

    selectedPdf = file;

    const size = formatFileSize(

        file.size

    );

    document.getElementById(

        "selectedFile"

    ).innerHTML = `

        <strong>

            ${file.name}

        </strong>

        <br>

        <small>

            الحجم : ${size}

        </small>

    `;

}

/* ==========================
   Format File Size
========================== */

function formatFileSize(bytes){

    if(bytes < 1024){

        return bytes + " Bytes";

    }

    if(bytes < 1024 * 1024){

        return (

            bytes / 1024

        ).toFixed(2) + " KB";

    }

    return (

        bytes / (1024 * 1024)

    ).toFixed(2) + " MB";

}
/* ==========================
   Upload Report
========================== */

async function uploadReport(){

    if(!selectedPdf){

        alert(

            "يرجى اختيار ملف PDF."

        );

        return;

    }

    const button = document.getElementById(

        "uploadBtn"

    );

    button.disabled = true;

    button.textContent = "جارٍ رفع التقرير...";

    try{

        const session = JSON.parse(

            localStorage.getItem("session")

        );

        const base64File = await fileToBase64(

            selectedPdf

        );

        const response = await ApiService.request(

            "uploadReport",

            {

                userId:

                    session.userId,

                departmentId:

                    session.departmentId,

                week:

                    document.getElementById(

                        "weekNumber"

                    ).textContent,

                fileName:

                    selectedPdf.name,

                mimeType:

                    selectedPdf.type,

                fileData:

                    base64File

            }

        );

        if(

            response.success &&

            response.data.success

        ){

            alert(

                "تم رفع التقرير بنجاح."

            );

            window.location.href =

                "dashboard.html";

            return;

        }

        alert(

            response.data.message ||

            "تعذر رفع التقرير."

        );

    }

    catch(error){

        console.error(error);

        alert(

            "حدث خطأ أثناء رفع التقرير."

        );

    }

    finally{

        button.disabled = false;

        button.textContent =

            "رفع التقرير";

    }

}

/* ==========================
   File To Base64
========================== */

function fileToBase64(file){

    return new Promise(

        (resolve,reject)=>{

            const reader =

                new FileReader();

            reader.onload = ()=>{

                resolve(

                    reader.result.split(",")[1]

                );

            };

            reader.onerror = reject;

            reader.readAsDataURL(

                file

            );

        }

    );

}
