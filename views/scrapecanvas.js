const data = {
    courses: [],
    people: {}
}

async function postData(data) {
    const response = await fetch("https://studygroupme.herokuapp.com/register", {
      method: 'POST',
      mode: 'cors',     
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrer: 'no-referrer', 
      body: JSON.stringify(data)
    });
    return await response
  }

function sendDataToServer() {
    // let x = {
    //    data: data
    // };

    // postData(x);
    console.log(data);
}

const allCoursesWindow = window.open("/courses");

allCoursesWindow.onload = () => {
    let courses = allCoursesWindow.document.getElementsByClassName("course-list-table-row");

    let numCourses = 0;
    for (let course of courses) {
        let courseLink = course.getElementsByTagName("a");
        let title = courseLink[0].title;

        if (title == null) continue;

        data.courses.push(title);
        numCourses += 1;
    }

    let numDataCollected = 0;

    for (let i = 0; i < data.courses.length; ++i) {
        let course = courses[i];

        let courseLink = course.getElementsByTagName("a");
        let link = courseLink[0].href;

        if (link == null) continue;

        let courseWindow = window.open(link);

        courseWindow.onload = () => {
            let links = courseWindow.document.getElementsByTagName("a");
            links = Array.from(links);
            links = links.filter(link => link.title == "People");

            if (links.length > 0) {
                let peopleWindow = window.open(links[0].href);
                peopleWindow.onload = () => {
                    const target = peopleWindow.document.getElementsByClassName("v-gutter")[0];

                    const config = {
                        attributes: true,
                        childList: true,
                        subtree: true,
                        characterData: true
                    };

                    let observer = new MutationObserver(function (mutations) {
                        let list = peopleWindow.document.getElementsByClassName("roster_user_name");
                        list = Array.from(list).map(link => link.innerText);
    
                        data.people[data.courses[i]] = list;
                        numDataCollected += 1;
    
                        peopleWindow.close();
    
                        if (numDataCollected == numCourses) {
                            sendDataToServer();
                        }
                    });
    

                    observer.observe(target, config);
                };
            }

            else {
                data.people[data.courses[i]] = [];
                numDataCollected += 1;

                if (numDataCollected == numCourses) {
                    sendDataToServer();
                }
            }

            courseWindow.close();
        };
    }

    allCoursesWindow.close();
};