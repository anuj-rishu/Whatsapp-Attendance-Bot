import MessageType from "../types/message";
import { ChatDocument } from "./../models/Chat";
import Chat from "../models/Chat";
import axios from "axios";
import getSubjectsWithMoreAbsentHours from "../utils/getSubjectsWithMoreAbsentHours";
import Update from "../models/Update";
import SendMessage from "../utils/SendMessage";
import extractDetails from "../utils/extractDetails";
import client from "../utils/redisConnection";

function calculateMargin(totalConducted: number, presentHours: number) {
	let margin = 0;
    let absent = totalConducted - presentHours;
	let present = totalConducted - absent;
	let current = (present / totalConducted) * 100;
	let conducted = totalConducted;

	if (current > 75) {
		while (current >= 75) {
			conducted++;
			margin++;
			current = (present / conducted) * 100;
		}
		margin--;
	} else {
		while (current < 75) {
			conducted++;
			margin--;
			present++;
			current = (present / conducted) * 100;
		}
	}

	return margin;
}

const attHandler = async (chat: ChatDocument, message: MessageType) => {
  const attendance = chat.courses!;
  try {
    let res;
    res = await axios.post(
      process.env.SRM_USER_URL!,
      {},
      {
        headers: {
          "X-Access-Token": chat.token,
        },
      }
    );
    if (res.data.error) {
      const newchat = await Chat.findById(chat._id);
      if (!newchat) return;
      let res2 = await axios.post(process.env.SRM_TOKEN_URL!, {
        username: newchat.userid,
        password: newchat.password,
      });
      let res3 = await axios.post(
        process.env.SRM_USER_URL!,
        {},
        {
          headers: {
            "X-Access-Token": res2.data.token,
          },
        }
      );
      if (res3.data.error) {
        await Chat.findByIdAndUpdate(chat._id, {
          hasIssue: true,
        });
        throw res3.data.error;
      } else {
        res = res3;
        await Chat.findByIdAndUpdate(chat._id, {
          hasIssue: false,
          token: res2.data.token,
        });
        await Update.findOneAndUpdate(
          {
            chatid: chat._id,
          },
          {
            token: res2.data.token,
          }
        );
      }
    }
    const data = getSubjectsWithMoreAbsentHours(attendance, res.data);
    if (data.length <= 0) {
      let messagetosend = "Attendance:\n\n";
      attendance.forEach((Object) => {
        if (
          !Object ||
          !Object.subject_name ||
          !Object.conducted_hours ||
          !Object.absent_hours
        )
          return;
        messagetosend +=
          Object.subject_name.length > 32
            ? `${Object.subject_name.slice(
                0,
                20
              )}... ${Object.subject_name.slice(-8)}\n`
            : `${Object.subject_name}\n`;
        const marorreq = calculateMargin(
          Object.conducted_hours,
          Object.conducted_hours - Object.absent_hours
        );
        messagetosend += `${
          marorreq >= 0 ? `Margin:*${marorreq}*` : `Required:*${-1 * marorreq}*`
        }  Abs:*${Object.absent_hours}*  %:*${Math.round(
          ((Object.conducted_hours - Object.absent_hours) * 100) /
            Object.conducted_hours
        )}*\n\n`;
      });
      client.incr(message.payload.source);
      // await client.disconnect()
      await SendMessage({
        to: message.payload.source,
        message: `${messagetosend.slice(
          0,
          -2
        )}\nYay! Your Attendance was not decreased since last checked!`,
      });
    } else {
      let texttosend = "";
      data.forEach((tt) => {
        if(!tt || !tt.subject_name || !tt.difference_in_hours) return;
        texttosend +=
          tt.subject_name.length > 32
            ? `${tt.subject_name.slice(0, 20)}... ${tt.subject_name.slice(
                -8
              )}\n`
            : `${tt.subject_name}\n`;
        texttosend += `Hours marked Absent: ${tt.difference_in_hours}\n\n`;
      });
      client.incr(message.payload.source);
      // await client.disconnect()
      await SendMessage({
        to: message.payload.source,
        message: `${texttosend.slice(0, -2)}\nAttendance Decreased!`,
      });
    }
    const { courses, time_table } = extractDetails(res.data);
    await Chat.findByIdAndUpdate(chat._id, {
      timetable: time_table,
      courses: courses,
      branch: res.data.user.spec ? res.data.user.spec : "",
      sem: res.data.user.sem,
      program: res.data.user.program,
      phone_number_from_database: res.data.user.number,
    });
    await Update.findOne(
      {
        chatid: chat._id,
      },
      {
        courses: courses,
      }
    );
    return;
  } catch (error) {
    let messagetosend = "Old Attendance:\n\n";
    attendance.forEach((Object) => {
      if (
        !Object ||
        !Object.subject_name ||
        !Object.conducted_hours ||
        !Object.absent_hours
      )
        return;
      messagetosend +=
        Object.subject_name.length > 20
          ? `${Object.subject_name.slice(0, 20)}... ${Object.subject_name.slice(
              -7
            )}\n`
          : `${Object.subject_name}\n`;
      const marorreq = calculateMargin(
        Object.conducted_hours,
        Object.conducted_hours - Object.absent_hours
      );
      messagetosend += `${
        marorreq >= 0 ? `Margin:*${marorreq}*` : `Required:*${-1 * marorreq}*`
      }  Abs:*${Object.absent_hours}*  %:*${Math.round(
        ((Object.conducted_hours - Object.absent_hours) * 100) /
          Object.conducted_hours
      )}*\n\n`;
    });
    await Chat.findByIdAndUpdate(chat._id, {
      hasIssue: true,
    });
    client.incr(message.payload.source);
    // await client.disconnect()
    await SendMessage({
      to: message.payload.source,
      message: `Could not fetch attendance, Showing you last attendance!\n${messagetosend}\nPlease verify your password again, Use */cp* command`,
    });
    return;
  }
};

export default attHandler;
