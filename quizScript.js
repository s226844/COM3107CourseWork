
let question=[
    "What is the academic reputation of The Hang Seng University of Hong Kong within the local and international higher education landscape?",
    "What undergraduate and postgraduate programs does The Hang Seng University of Hong Kong offer, and what are some of the most popular fields of study?",
    // "How does The Hang Seng University of Hong Kong incorporate research opportunities for students and faculty?",
    // "What initiatives does The Hang Seng University of Hong Kong implement to enhance student life and campus experience?",
    // "How does the university engage with the local community and industry in Hong Kong?",
    // "What are the admission requirements for international students wishing to study at The Hang Seng University of Hong Kong?",
    "Can you describe the campus facilities available to students at The Hang Seng University of Hong Kong?",
    // "What support services are provided to students for academic and personal development at The Hang Seng University of Hong Kong?",
    // "How does The Hang Seng University of Hong Kong promote sustainability and environmental awareness on campus?",
    // "What are the university's plans for future development and expansion in terms of academic programs and campus facilities?"
];

let answerPrompt=[
    ["Very Good", "Good", "Netural", "Bad", "Terrible"],
    ["Business", "Translation", "Decision Science", "Humanities"],
    ["Very Good", "Good", "Netural", "Bad", "Terrible"],
    // [""]
];

let answerList = [0, 1, 1];


function generateQandA(){
    area = document.getElementById("questionArea");
    for (let i=0; i<question.length;i++){
        doc = document.getElementById("questionArea");
        doc.innerHTML +=
            `<div name="questionBoundingBox">
                <div id="question${i}">
                    ${question[i]}<br>
                </div>
                <div id="answerList${i}">
                    
                </div>
                <br>
                <p id="result${i}"></p>
                <p id="answerArea${i}"></p>
            </div>`;
            ansList = document.getElementById(`answerList${i}`);
            // console.log(answerPrompt[i]);
            for (let j=0;j<answerPrompt[i].length;j++){
                    ansList.innerHTML += 
                    `<input type="radio" name="q${i}" id="ans${j}">${answerPrompt[i][j]}</input>`;
            };
    };
    area.innerHTML += `<button onclick="submit2()">submit</button>`;

}

// function submit(){
//     answer = document.querySelector('input[name="q1"]:checked').id;
//     console.log(answer);
//     if(answer == "ans1"){
//         document.getElementById("result1").innerText = "Correct !!!";
//         console.log("correct");
//     } else {
//         document.getElementById("result1").innerText = "Wrong !!!";
//         console.log("wrong");
//     }
//     document.getElementById("answerArea1").innerText = "Correct Answer is : Mobile Phone";
// }

function submit2(){
    for (let i=0; i<question.length;i++){
        answer = document.querySelector(`input[name="q${i}"]:checked`).id;
        console.log(answer);
        // if(answer == answerPrompt[i][answerList[i]]){
        if(answer == `ans${answerList[i]}`){
            document.getElementById(`result${i}`).innerText = "Correct !!!";
            document.getElementById(`result${i}`).innerHTML = `<img src="asset/tick.jpg" width="60px" length="60px"></img>`;
            console.log("correct");
        } else {
            document.getElementById(`result${i}`).innerText = "Wrong !!!";
            document.getElementById(`result${i}`).innerHTML = `<img src="asset/cross.jpg" width="30px" length="30px"></img>`;
            console.log("wrong");
        };
        document.getElementById(`answerArea${i}`).innerText = `Correct Answer is : ${answerPrompt[i][answerList[i]]}`;
        console.log(answerPrompt[i][answerList[i]]);
    }
    // console.log(answer);
    // if(answer == "ans1"){
    //     document.getElementById("result1").innerText = "Correct !!!";
    //     console.log("correct");
    // } else {
    //     document.getElementById("result1").innerText = "Wrong !!!";
    //     console.log("wrong");
    // }

}