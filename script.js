let colleges = [];
let template = "";

/* Load template */

fetch("template.txt")
.then(res => res.text())
.then(data => {
    template = data;
});


/* Load colleges */

fetch("colleges.json")
.then(res => res.json())
.then(data => {

    colleges = data;

    let dropdown = document.getElementById("collegeDropdown");

    data.forEach((college,index)=>{

        let option = document.createElement("option");

        option.value = index;
        option.textContent = college.name;

        dropdown.appendChild(option);

    });

    /* Activate searchable dropdown */

    new TomSelect("#collegeDropdown",{
        create:false,
        searchField:["text"],
        maxOptions:null,
        sortField:{
            field:"text",
            direction:"asc"
        }
    });

});


/* Generate PDF */

function downloadPDF(){

let dropdown = document.getElementById("collegeDropdown");

let index = dropdown.value;

if(index === "" || index === undefined){

alert("Please select a university");

return;

}

let college = colleges[index];


/* Read optional inputs */

let department = document.getElementById("department")?.value || "";
let policyVersion = document.getElementById("policyVersion")?.value || "";
let policyDate = document.getElementById("policyDate")?.value || "";


/* Replace template variables */

let policy = template
.replaceAll("{{UNIVERSITY_NAME}}", college.name)
.replaceAll("{{AIRSPACE_ZONE}}", college.zone);


const { jsPDF } = window.jspdf;

let doc = new jsPDF();

let margin = 20;
let pageWidth = doc.internal.pageSize.getWidth();
let pageHeight = doc.internal.pageSize.getHeight();
let usableWidth = pageWidth - margin*2;

let y = margin;


/* ---------------- COVER PAGE ---------------- */

doc.setFont("Times","Bold");
doc.setFontSize(22);

doc.text("UNMANNED AERIAL VEHICLES", pageWidth/2, y+40, {align:"center"});
doc.text("(UAV) POLICY", pageWidth/2, y+55, {align:"center"});

doc.setFont("Times","Normal");
doc.setFontSize(14);

doc.text("Prepared for", pageWidth/2, y+85, {align:"center"});

doc.setFont("Times","Bold");
doc.text(college.name, pageWidth/2, y+100, {align:"center"});

doc.setFont("Times","Normal");

if(department){
doc.text("Department: " + department, pageWidth/2, y+120, {align:"center"});
}

if(policyVersion){
doc.text("Policy Version: " + policyVersion, pageWidth/2, y+135, {align:"center"});
}

if(policyDate){
doc.text("Effective Date: " + policyDate, pageWidth/2, y+150, {align:"center"});
}

doc.text("Airspace Classification: " + college.zone, pageWidth/2, y+165, {align:"center"});


/* Add new page */

doc.addPage();

y = margin;


/* ---------------- POLICY TITLE ---------------- */

doc.setFont("Times","Bold");
doc.setFontSize(18);

doc.text("UNMANNED AERIAL VEHICLES (UAV) POLICY", pageWidth/2, y, {align:"center"});

y += 10;

doc.setFontSize(13);
doc.setFont("Times","Normal");

doc.text(college.name, pageWidth/2, y, {align:"center"});

y += 15;


/* ---------------- POLICY BODY ---------------- */

doc.setFontSize(11);

let lines = doc.splitTextToSize(policy, usableWidth);

let pageCount = 1;

lines.forEach(line => {

if(y > pageHeight - margin){

doc.setFontSize(9);
doc.text(`Page ${pageCount}`, pageWidth/2, pageHeight-10, {align:"center"});

doc.addPage();

pageCount++;

y = margin;

doc.setFontSize(11);

}


/* Detect section headings */

let isHeading =
line.startsWith("i.") ||
line.startsWith("ii.") ||
line.startsWith("iii.") ||
line.startsWith("iv.") ||
line.startsWith("v.") ||
line.startsWith("vi.");

if(isHeading){

y += 4;

doc.setFont("Times","Bold");
doc.text(line, margin, y);

y += 2;

}
else{


/* Detect **bold text** */

if(line.includes("**")){

let parts = line.split("**");

let x = margin;

parts.forEach((part,index)=>{

if(index % 2 === 1){
doc.setFont("Times","Bold");
}else{
doc.setFont("Times","Normal");
}

doc.text(part, x, y);

x += doc.getTextWidth(part);

});

}
else{

doc.setFont("Times","Normal");
doc.text(line, margin, y);

}

}

y += 6;

});


doc.setFontSize(9);
doc.text(`Page ${pageCount}`, pageWidth/2, pageHeight-10, {align:"center"});


doc.save("Drone_Policy.pdf");

}
