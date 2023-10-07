function getSubjectsWithMoreAbsentHours(attendance, data) {
    const subjectsWithMoreAbsentHours = [];
  
    for (const course of data.courses) {
      const attendanceInfo = attendance.find((item) => item.subject_name === course.subject_name.concat(" (").concat(course.category).concat(")"));
      if (attendanceInfo && parseInt(attendanceInfo.absent_hours) < parseInt(course.absent_hours)) {
        subjectsWithMoreAbsentHours.push({
          subject_name: attendanceInfo.subject_name,
          difference_in_hours: parseInt(course.absent_hours) - parseInt(attendanceInfo.absent_hours)
        });
      }
    }
    return subjectsWithMoreAbsentHours;
  }


  module.exports = getSubjectsWithMoreAbsentHours