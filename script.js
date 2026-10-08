/* =====================================================
   ECOWATCH JAVASCRIPT
===================================================== */


/* =====================================================
   AWS API CONFIGURATION
===================================================== */

/*
    IMPORTANT:

    DO NOT put AWS secret keys here.

    Later, we will connect this frontend to:

    Website
       ↓
    API Gateway
       ↓
    Lambda
       ↓
    DynamoDB / S3 / Bedrock

    For now, this is only a placeholder.

    After we create the AWS backend, we will replace
    this URL with our actual API Gateway URL.
*/

const AWS_API_URL = "https://m9jj9keo63.execute-api.ap-southeast-2.amazonaws.com/reports";


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function scrollToReport() {

    const reportSection = document.getElementById("report");

    reportSection.scrollIntoView({
        behavior: "smooth"
    });

}


function scrollToDashboard() {

    const dashboard = document.getElementById("dashboard");

    dashboard.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   CATEGORY SELECTION
===================================================== */

function selectCategory(button) {

    const buttons =
        document.querySelectorAll(".category-option");

    buttons.forEach(function (item) {

        item.classList.remove("selected");

    });


    button.classList.add("selected");


    const category =
        button.getAttribute("data-category");


    document.getElementById("category").value =
        category;

}


/* =====================================================
   IMAGE UPLOAD
===================================================== */

function handleImageUpload(event) {

    const file =
        event.target.files[0];

    const fileName =
        document.getElementById("fileName");


    if (!file) {

        fileName.textContent =
            "JPG, PNG up to 10MB";

        return;

    }


    fileName.textContent =
        file.name;

}


/* =====================================================
   REPORT FORM
===================================================== */

const reportForm =
    document.getElementById("reportForm");


reportForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* -----------------------------------------
           GET FORM DATA
        ----------------------------------------- */

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value;

        const location =
            document.getElementById("location").value;

        const severity =
            document.getElementById("severity").value;

        const image =
            document.getElementById("imageUpload").files[0];


        /* -----------------------------------------
           BASIC VALIDATION
        ----------------------------------------- */

        if (!category) {

            alert(
                "Please select an environmental category."
            );

            return;

        }


        if (!description.trim()) {

            alert(
                "Please describe the environmental problem."
            );

            return;

        }


        /* -----------------------------------------
           CREATE REPORT OBJECT
        ----------------------------------------- */

        const report = {

            category: category,

            description: description,

            location: location,

            severity: severity,

            timestamp:
                new Date().toISOString()

        };


        /* -----------------------------------------
           SHOW LOADING STATE
        ----------------------------------------- */

        const submitButton =
            document.querySelector(".submit-btn");


        const originalButtonHTML =
            submitButton.innerHTML;


        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span>Analysing environmental issue...</span>
            <span>◌</span>
        `;


        try {

            /*
                =====================================
                AWS CONNECTION
                =====================================

                If AWS_API_URL exists, send the report
                to our AWS backend.

                Example future architecture:

                Browser
                    ↓
                API Gateway
                    ↓
                Lambda
                    ↓
                Bedrock
                    ↓
                DynamoDB
            */


            if (AWS_API_URL) {

                const response =
                    await fetch(
                        AWS_API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(report)
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "AWS API request failed."
                    );

                }


                const data =
                    await response.json();


                showAIResult(data);

            }

            else {

                /*
                    ---------------------------------
                    DEMO MODE

                    Until AWS is connected, we use
                    a local simulation.

                    This allows you to demonstrate
                    the interface while developing.
                    ---------------------------------
                */

                await simulateAIAnalysis(report);

            }


        }

        catch (error) {

            console.error(error);

            alert(
                "Something went wrong while analysing the report."
            );

        }

        finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonHTML;

        }

    }
);


/* =====================================================
   DEMO AI ANALYSIS
===================================================== */

async function simulateAIAnalysis(report) {

    /*
        Artificial delay so the interface feels
        like an actual AI analysis is happening.
    */

    await new Promise(function (resolve) {

        setTimeout(resolve, 1600);

    });


    let recommendation =
        "EcoWatch recommends notifying the appropriate campus team and taking immediate steps to reduce unnecessary resource consumption.";


    let impact =
        "4.2 kg CO₂ / day";


    if (
        report.category ===
        "Air"
    ) {

        recommendation =
            "Improve ventilation, identify the pollution source and monitor air quality in the affected area.";

        impact =
            "3.6 kg CO₂ / day";

    }


    if (
        report.category ===
        "Heat & Water"
    ) {

        recommendation =
            "Check for leaks or excessive water usage and notify the campus maintenance team.";

        impact =
            "185 L / day";

    }


    if (
        report.category ===
        "Waste & Energy"
    ) {

        recommendation =
            "Reduce unnecessary electricity consumption, improve waste segregation and notify the responsible campus team.";

        impact =
            "4.2 kg CO₂ / day";

    }


    const result = {

        category:
            report.category,

        severity:
            report.severity ||
            "Medium",

        recommendation:
            recommendation,

        impact:
            impact

    };


    showAIResult(result);

}


/* =====================================================
   SHOW AI RESULT
===================================================== */

function showAIResult(data) {

    const resultPanel =
        document.getElementById("resultPanel");


    const resultCategory =
        document.getElementById("resultCategory");


    const resultSeverity =
        document.getElementById("resultSeverity");


    const resultRecommendation =
        document.getElementById(
            "resultRecommendation"
        );


    const resultImpact =
        document.getElementById("resultImpact");


    resultCategory.textContent =
        data.category ||
        "Environmental Issue";


    resultSeverity.textContent =
        data.severity ||
        "Medium";


    resultRecommendation.textContent =
        data.recommendation ||
        "Please notify the relevant environmental team.";


    resultImpact.textContent =
        data.impact ||
        "Impact being calculated";


    document
        .getElementById("reportForm")
        .classList.add("hidden");


    resultPanel.classList.remove("hidden");


    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    increaseReportCount();

}


/* =====================================================
   RESET REPORT
===================================================== */

function resetReport() {

    const resultPanel =
        document.getElementById("resultPanel");


    resultPanel.classList.add("hidden");


    reportForm.classList.remove("hidden");


    reportForm.reset();


    document
        .querySelectorAll(".category-option")
        .forEach(function (button) {

            button.classList.remove("selected");

        });


    document.getElementById(
        "fileName"
    ).textContent =
        "JPG, PNG up to 10MB";


    document.getElementById(
        "category"
    ).value = "";


    scrollToReport();

}


/* =====================================================
   REPORT COUNTER
===================================================== */

let reports =
    1248;


function increaseReportCount() {

    reports++;

    const counter =
        document.getElementById("reportsCount");


    counter.textContent =
        reports.toLocaleString();

}


/* =====================================================
   SIMPLE SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".step-card, .stat-card, .dashboard-main, .mini-stat"
    );


const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                }
            );

        },
        {
            threshold: 0.1
        }
    );


revealElements.forEach(
    function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(20px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        revealObserver.observe(element);

    }
);


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    `
    🌱 EcoWatch

    Environmental intelligence
    for a greener tomorrow.

    Frontend: HTML + CSS + JavaScript
    Backend: AWS
    AI: Amazon Bedrock (planned)
    Storage: Amazon S3 (planned)
    Database: DynamoDB (planned)
    `
);