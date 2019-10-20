//tried to do this, but it doesn't work...

const data = {
    courses: []
}

function prepareFrame(src) {
    let ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", src);
    ifrm.style.width = "640px";
    ifrm.style.height = "480px";
    document.body.appendChild(ifrm);

    return ifrm.contentDocument || ifrm.contentWindow.document;
}

const allCourses = prepareFrame("https://canvas.harvard.edu/courses");
console.log(allCourses);

allCourses.onload = () => {
    
    let courses = allCourses.getElementsByClassName("course-list-table-row");

    let numCourses = 0;
    for (let course of courses) {
        let courseLink = course.getElementsByTagName("a");
        let title = courseLink[0].title;

        if (title != null) {
            data.courses.push(title);
            numCourses += 1;
        }
    }

    console.log(data);
};
