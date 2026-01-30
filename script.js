
let schoolName = ["School of Business"
    ,"School of Communication"
    ,"School of Decision Science"
    ,"School of Humanities and Social Science"
    ,"School of Translation and Foreign Languages"
    ,"School of Transdisciplinary Studies"
    ,"Graduate School"];

let schoolLink = ["https://sbus.hsu.edu.hk",
    "https://scom.hsu.edu.hk",
    "https://sdsc.hsu.edu.hk",
    "https://shss.hsu.edu.hk",
    "https://stfl.hsu.edu.hk",
    "https://sts.hsu.edu.hk",
    "https://gs.hsu.edu.hk"
];

function draw(){
    // console.log(infoList.length);
    let index = Math.floor(Math.random() * schoolName.length);
    // console.log(index);
    // console.log(schoolName[index]);
    document.getElementById("result").innerText = schoolName[index];
    // setTimeout(() => {alert("Taking you to the school...");}, 5000);
    window.open(schoolLink[index], '_blank');
    // window.focus();
};