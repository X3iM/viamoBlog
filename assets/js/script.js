// function hideMenu() {
//     let menuClElmCList=document.getElementById("menuIts").classList;
//     if(menuClElmCList.contains("mnShow")) menuClElmCList.remove("mnShow");
// }

// document.addEventListener("click", //radsej takto ako do document.onclick, lebo to by vyradilo inÃ© listenery
//     function(event){
//         if(!event.target.matches("#menuCl, #menuTitle")) hideMenu();
//     }
// );

//--------------------------------------------------------------------------------------------------------------
//functions for transforming opinion(s) to Html code

import { render } from "mustache";

function opinion2html(opinion) {
  const opinionView = {
    name: opinion.name,
    comment: opinion.comment,
    createdDate: new Date(opinion.created).toDateString(),
    willReturnMessage: opinion.willReturn
      ? "I will return to this page."
      : "Sorry, one visit was enough."
  };

  const template = document.getElementById("mTmplOneOpinion").innerHTML;
  return render(template, opinionView);
}

function opinionArray2html(sourceData) {
  return sourceData.reduce(
    (htmlWithOpinions, opn) => htmlWithOpinions + opinion2html(opn),
    ""
  );
}

//--------------------------------------------------------------------------------------------------------------
//Dropdown menu functionality

// function displayOrHideMenu() {
//     document.getElementById("menuIts").classList.toggle("mnShow");
// }

// function hideMenu() {
//     let menuClElmCList=document.getElementById("menuIts").classList;
//     if(menuClElmCList.contains("mnShow")) menuClElmCList.remove("mnShow");
//
// }

// document.addEventListener("click", //radsej takto ako do document.onclick, lebo to by vyradilo inÃ© listenery
//     function(event){
//         if(!event.target.matches("#menuCl, #menuTitle")) hideMenu();
//     }
// );

//--------------------------------------------------------------------------------------------------------------
//data and localStorage handling at startup

let opinions = [];

const opinionsElm = document.getElementById("opinionsContainer");

if (
  localStorage.myTreesComments != null &&
  localStorage.myTreesComments.length > 0
) {
  // opinions = JSON.parse(localStorage.myTreesComments);
  opinions = localStorage.myTreesComments.toString();
}
// else {
//     opinions = localStorage.myTreesComments;
//}

opinionsElm.innerHTML = opinionArray2html(opinions);

//--------------------------------------------------------------------------------------------------------------
//Form processing functionality

/*
 * Note:
 * For the sake of simplicity, here we use window.alert to display messages to the user
 * However, if possible, avoid them in the production versions of your web applications
 *
 */

let myFrmElm = document.getElementById("form").elements;

let myForm = document.getElementById("form");
myForm.addEventListener("submit", processOpnFrmData);

function processOpnFrmData(event) {
  //1.prevent normal event (form sending) processing
  event.preventDefault();

  //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
  const nopName = myFrmElm[0].value.trim(); //;document.getElementById("nameElm").value.trim();
  const nopOpn = myFrmElm[6].value.trim(); //document.getElementById("opnElm").value.trim();
  const nopDrone = myFrmElm[1].checked;
  const nopWillReturn = document.getElementById("willReturnElm").checked;

  //3. Verify the data
  if (nopName == "" || nopOpn == "") {
    window.alert("Please, enter both your name and opinion");
    return;
  }

  //3. Add the data to the array opinions and local storage
  const newOpinion = {
    name: nopName,
    comment: nopOpn,
    willReturn: nopWillReturn,
    // drone: nopDrone,
    created: new Date(/*Date.now() - 8.64e+7*/)
  };

  opinions.push(newOpinion);
  localStorage.myTreesComments = JSON.stringify(opinions);

  console.log("New opinion:\n " + JSON.stringify(newOpinion));

  //4. Update HTML
  opinionsElm.innerHTML += opinion2html(newOpinion);

  //5. Reset the form
  myForm.reset(); //resets the form
}

/*  Reset button  */
//-------------------------------------------------------------------------------------

let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", reset);

function reset(event) {
  let isChange = false;

  for (let i = 0; i < opinions.length; i++) {
    if (Date.now() - new Date(opinions[i].created) >= 8.64e7) {
      console.log(i);
      opinions.splice(i, 1);
      i--;
      isChange = true;
    }
  }

  if (isChange) {
    localStorage.myTreesComments = opinions;

    opinionsElm.innerHTML = opinionArray2html(opinions);

    myForm.reset();
  }
}
