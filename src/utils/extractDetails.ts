function extractDetails(data: any) {
    let courses = [];
    let i = 0;
    for (const course of data.courses) {
        courses[i] = {
            absent_hours: Number(course.absent_hours),
            subject_name: `${(course.subject_name)} (${course.category})`,
            conducted_hours: Number(course.conducted_hours)
        }
        i = i + 1;
    }
    let time_table = [];
    let j = 0;
    for (const tto of data["time-table"]) {
        let table = [];
        for (const timeSlot of Object.keys(tto)) {
            if(tto[timeSlot][0] !== undefined){
                table.push({
                    course_name: tto[timeSlot][0],
                    time: timeSlot
                });
            }
        }
        time_table[j] = {
            day_order: Number(tto.day_order),
            time_table: table
        }
        j = j + 1;
    }
    return { courses, time_table };
}

export default extractDetails