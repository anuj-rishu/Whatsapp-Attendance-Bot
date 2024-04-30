import MessageType from "../../types/message";
import axios from "axios";
import Mess from "../../models/Mess";
import SendMessage from "../../utils/SendMessage";
import client from "../../utils/redisConnection";

const getDayandTime = () => {
  const indianTimeOffset = 5.5 * 60 * 60 * 1000;
  const now = new Date(Date.now() + indianTimeOffset);

  type DayOfWeek = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  const daysOfWeek : DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  let day = daysOfWeek[now.getUTCDay()];

  type MealType = "Breakfast" | "Lunch" | "Snacks" | "Dinner";

  const mealTimings: {
    [key in MealType]: { start: number; end: number };
  
  } = {
    Breakfast: { start: 21.5, end: 9 },
    Lunch: { start: 9, end: 13.5 },
    Snacks: { start: 13.5, end: 17.5 },
    Dinner: { start: 17.5, end: 21.5 },
  };

  let currentMeal: MealType = "Breakfast";
  const currentHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  const entries: [MealType, { start: number; end: number }][] = Object.entries(mealTimings).map(([meal, timing]) => [meal as MealType, timing as { start: number; end: number }]);

  for (const [meal, timing] of entries) {
    const { start, end } = timing;
    if (currentHour >= start || currentHour < end) {
      currentMeal = meal;
      break;
    }
  }
  if (currentHour > 21.5) {
    const index = daysOfWeek.findIndex((item) => item === day);
    day = daysOfWeek[index + 1];
  }
  return { day, currentMeal };
};

const messHandler = async (message: MessageType) => {
  try {
    const mess = await Mess.findOne({ __v: 0 });
    const { day, currentMeal } = getDayandTime();
    if (!mess) {
      const res = await axios.get(process.env.WHATS_MESS_URL!);
      await Mess.create({
        monday: res.data.data[0].monday,
        tuesday: res.data.data[0].tuesday,
        wednesday: res.data.data[0].wednesday,
        thursday: res.data.data[0].thursday,
        friday: res.data.data[0].friday,
        saturday: res.data.data[0].saturday,
        sunday: res.data.data[0].sunday,
        updatedAt: Date(),
      });
      const array = res.data.data[0][day][currentMeal];
      let stringtosend = "";
      if (currentMeal == "Breakfast") {
        stringtosend += "[7:00 AM - 9:00 AM]\n";
      }
      if (currentMeal == "Lunch") {
        stringtosend += "[11:30 AM - 1:30 PM]\n";
      }
      if (currentMeal == "Snacks") {
        stringtosend += "[4:30 PM - 5:30 PM]\n";
      }
      if (currentMeal == "Dinner") {
        stringtosend += "[7:30 PM - 9:00 PM]\n";
      }
      stringtosend += `${day}: (${currentMeal})\n\n${array}`;
      client.incr(message.payload.source);
      // await client.disconnect()
      await SendMessage({ to: message.payload.source, message: stringtosend });
      return;
    } else if (Date.now() - mess.updatedAt.getTime() > 86400000) {
      const res = await axios.get(process.env.WHATS_MESS_URL!);
      await Mess.findByIdAndUpdate(mess._id, {
        monday: res.data.data[0].monday,
        tuesday: res.data.data[0].tuesday,
        wednesday: res.data.data[0].wednesday,
        thursday: res.data.data[0].thursday,
        friday: res.data.data[0].friday,
        saturday: res.data.data[0].saturday,
        sunday: res.data.data[0].sunday,
        updatedAt: Date(),
      });
      const array = res.data.data[0][day][currentMeal];
      let stringtosend = "";
      if (currentMeal == "Breakfast") {
        stringtosend += "[7:30 AM - 9:00 AM]\n";
      }
      if (currentMeal == "Lunch") {
        stringtosend += "[11:30 AM - 1:30 PM]\n";
      }
      if (currentMeal == "Snacks") {
        stringtosend += "[4:30 PM - 5:30 PM]\n";
      }
      if (currentMeal == "Dinner") {
        stringtosend += "[7:30 PM - 9:00 PM]\n";
      }
      stringtosend += `${day}: (${currentMeal})\n\n${array.join(", ")}`;
      client.incr(message.payload.source);
      // await client.disconnect()
      await SendMessage({ to: message.payload.source, message: stringtosend });
      return;
    } else {
      const array = mess[day][currentMeal];
      let stringtosend = "";
      if (currentMeal == "Breakfast") {
        stringtosend += "[7:30 AM - 9:00 AM]\n";
      }
      if (currentMeal == "Lunch") {
        stringtosend += "[11:30 AM - 1:30 PM]\n";
      }
      if (currentMeal == "Snacks") {
        stringtosend += "[4:30 PM - 5:30 PM]\n";
      }
      if (currentMeal == "Dinner") {
        stringtosend += "[7:30 PM - 9:00 PM]\n";
      }
      stringtosend += `${day}: (${currentMeal})\n\n${array.join(", ")}`;
      client.incr(message.payload.source);
      // await client.disconnect()
      await SendMessage({ to: message.payload.source, message: stringtosend });
      return;
    }
  } catch (error) {
    console.log(error)
    const stringtosend = `There was a error fetching Mess details, Please try again!`;
    client.incr(message.payload.source);
    // await client.disconnect()
    await SendMessage({ to: message.payload.source, message: stringtosend });
    return;
  }
};

export default messHandler;
