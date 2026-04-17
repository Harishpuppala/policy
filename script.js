let colleges = [];
let template = "";

/* Load policy template */

fetch("template.txt")
.then(response => response.text())
.then(data => {
    template = data;
});


/* Load colleges list */

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


/* Generate PDF */

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

    let margin = 10;
    let pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let pageHeight = doc.internal.pageSize.getHeight();
    let lineHeight = 7;

    let lines = doc.splitTextToSize(policy, pageWidth);

    let linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

    for(let i = 0; i < lines.length; i += linesPerPage){

        let pageLines = lines.slice(i, i + linesPerPage);

        if(i > 0){
            doc.addPage();
        }

        doc.text(pageLines, margin, margin);
    }

    doc.save("Drone_Policy.pdf");

}
