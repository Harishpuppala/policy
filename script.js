let colleges = [];
let template = "";

/* Load policy template */

fetch("template.txt")
.then(response => response.text())
.then(data => {
    template = data;
});


/* Load colleges */

fetch("colleges.json")
.then(response => response.json())
.then(data => {

    colleges = data;

    let dropdown = document.getElementById("collegeDropdown");

    data.forEach((college, index) => {

        let option = document.createElement("option");

        option.value = index;
        option.text = college.name;

        dropdown.appendChild(option);

    });

});


/* Generate formatted PDF */

function downloadPDF(){

    let dropdown = document.getElementById("collegeDropdown");

    let index = dropdown.value;

    if(index === "" || index === undefined){
        alert("Please select a university");
        return;
    }

    let college = colleges[index];

    let policy = template
        .replaceAll("{{UNIVERSITY_NAME}}", college.name)
        .replaceAll("{{AIRSPACE_ZONE}}", college.zone);


    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();


    /* Page settings */

    let margin = 20;
    let pageWidth = doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.getHeight();
    let usableWidth = pageWidth - margin * 2;

    let y = margin;


    /* ---------- TITLE ---------- */

    doc.setFont("Times","Bold");
    doc.setFontSize(16);

    doc.text("UNMANNED AERIAL VEHICLES (UAV) POLICY", pageWidth/2, y, {align:"center"});

    y += 10;


    doc.setFontSize(13);
    doc.setFont("Times","Normal");

    doc.text(college.name, pageWidth/2, y, {align:"center"});

    y += 15;


    /* ---------- POLICY BODY ---------- */

    doc.setFontSize(11);

    let lines = doc.splitTextToSize(policy, usableWidth);


    lines.forEach(line => {

        if(y > pageHeight - margin){

            doc.addPage();

            y = margin;

        }

        /* Bold section headings automatically */

        if(
            line.startsWith("i.") ||
            line.startsWith("ii.") ||
            line.startsWith("iii.") ||
            line.startsWith("iv.") ||
            line.startsWith("v.") ||
            line.startsWith("vi.")
        ){
            doc.setFont("Times","Bold");
        }
        else{
            doc.setFont("Times","Normal");
        }

        doc.text(line, margin, y);

        y += 6;

    });


    doc.save("Drone_Policy.pdf");

}
