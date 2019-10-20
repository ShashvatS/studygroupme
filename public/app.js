let userdata = null;

$.getJSON("/userdata", (data) => {
    userdata = data;

    let x = document.getElementById("selectclass").getElementsByTagName("select")[0];
    for (let course of userdata.courses) {
        let option = document.createElement("option");
        option.appendChild(document.createTextNode(course));
        option.value = course;
        x.appendChild(option);
    }

    console.log(userdata);
});

function prepareFrame(parent, url) {
    let ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", url);
    ifrm.style.width = "800px";
    ifrm.style.height = "600px";
    ifrm.style.border = "0px";
    ifrm.frameBorder = "0px";
    ifrm.scrolling = "no";
    parent.appendChild(ifrm);
}

let selectChangedAlready = false;
function changed_select() {
    let x = document.getElementById("selectclass").getElementsByTagName("select")[0];
    if (!selectChangedAlready) {
        selectChangedAlready = true;

        x.removeChild(x.options[0]);
    }

    console.log(x.value);

    const course = x.value;
    const calendar_link = userdata.calendar_links[course];

    //change iframe source
    let url = `https://calendar.google.com/calendar/embed?src=${calendar_link}&ctz=America%2FNew_York`;
    
    document.getElementById("calendar").src = url;
    document.getElementById("groupchatlink").href = userdata.group_links[course];

    document.getElementById('class_info').hidden = false;
}


function creategroup() {
    document.getElementById("class_info").hidden = true;
    document.getElementById("creategroup").hidden = false;
}

async function postData(url, data) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.  
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response
  }


function submitgroup() {
    let fields = ["location", "start", "end", "max", "purpose"];
    const data = {

    };

    for (let field of fields) {
        data[field] = document.getElementById(field).value;
    }

    data["course"] = document.getElementById("selectclass").getElementsByTagName("select")[0].value;

    postData("/createevent", { data: data});

    console.log(data); 
}


function hidegroup() {
    document.getElementById("class_info").hidden = false;
    document.getElementById("creategroup").hidden = true;

}