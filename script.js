let colleges = [];
let templateText = "";

fetch("template.txt")
.then(res => res.text())
.then(data => {
templateText = data;
});

fetch("colleges.json")
.then(res => res.json())
.then(data => {
colleges = data;
populateDropdown(colleges);
});

function populateDropdown(list){

let dropdown = document.getElementById("collegeDropdown");
dropdown.innerHTML = "";

list.forEach((college,index)=>{

let option = document.createElement("option");
option.value = index;
option.text = college.name;

dropdown.appendChild(option);

});

}

function filterColleges(){

let search = document.getElementById("searchBox").value.toLowerCase();

let filtered = colleges.filter(c =>
c.name.toLowerCase().includes(search)
);

populateDropdown(filtered);

}

function downloadPDF(){

let dropdown = document.getElementById("collegeDropdown");

if(dropdown.selectedIndex === -1){
alert("Please select a university");
return;
}

let selectedName = dropdown.options[dropdown.selectedIndex].text;

let college = colleges.find(c => c.name === selectedName);

let policy = templateText
.replaceAll("{{UNIVERSITY_NAME}}", college.name)
.replaceAll("{{AIRSPACE_ZONE}}", college.zone);

const { jsPDF } = window.jspdf;

let doc = new jsPDF();

let lines = doc.splitTextToSize(policy,180);

doc.text(lines,10,10);

doc.save("Drone_Policy.pdf");

}
