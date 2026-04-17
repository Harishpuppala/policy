function downloadPDF(){

let dropdown = document.getElementById("collegeDropdown");

let index = dropdown.value;

let college = colleges[index];

let policy = template
.replaceAll("{{UNIVERSITY_NAME}}", college.name)
.replaceAll("{{AIRSPACE_ZONE}}", college.zone);

const { jsPDF } = window.jspdf;

let doc = new jsPDF();

let pageHeight = doc.internal.pageSize.height;

let margin = 10;

let y = margin;

let lines = doc.splitTextToSize(policy, 180);

lines.forEach(line => {

if (y > pageHeight - margin) {

doc.addPage();

y = margin;

}

doc.text(line, margin, y);

y += 7;

});

doc.save("Drone_Policy.pdf");

}
