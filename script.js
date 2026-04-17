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
