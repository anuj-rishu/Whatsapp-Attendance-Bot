function getSubjectsWithMoreAbsentHours(
  attendance: {
    absent_hours?: number | undefined;
    subject_name?: string | undefined;
    conducted_hours?: number | undefined;
  }[],
  data: any
) {
  const subjectsWithMoreAbsentHours = [];

  for (const course of data.courses) {
    const attendanceInfo = attendance.find(
      (item) =>
        item.subject_name ===
        course.subject_name.concat(" (").concat(course.category).concat(")")
    );
    if (
      attendanceInfo && attendanceInfo.absent_hours &&
      attendanceInfo.absent_hours < parseInt(course.absent_hours)
    ) {
      subjectsWithMoreAbsentHours.push({
        subject_name: attendanceInfo.subject_name,
        difference_in_hours:
          parseInt(course.absent_hours) - attendanceInfo.absent_hours,
      });
    }
  }
  return subjectsWithMoreAbsentHours;
}

export default getSubjectsWithMoreAbsentHours;
