function date0h(dateTime) {
  let d = new Date(dateTime);
  d.setHours(0, 0, 0, 0);
  return new Date(d);
}

function date24h(dateTime) {
  let d = date0h(dateTime);
  d = new Date(d.setDate(d.getDate() + 1));
  return new Date(d);

}

function firstMonthDay(dateTime) {
  let d = date0h(dateTime).setDate(1);
  return new Date(d);
}

function lastMonthDay(dateTime) {
  let d = date0h(dateTime).setMonth(dateTime.getMonth() + 1);
  d = new Date(d).setDate(0);
  return new Date(d);
}

function nextDay(dateTime) {
  return date24h(dateTime);
}

function toHMN(mn) {
  let hours = Math.floor(mn / 60);
  let min = "0" + (mn - hours * 60);
  min = min.substring(min.length - 2);
  return hours + "h" + min + "mn\n" + mn + "mn";
}

function isMidnight(dateTime) {
  return(dateTime.getHours() === 0
        && dateTime.getMinutes() === 0
        && dateTime.getSeconds() === 0
        && dateTime.getMilliseconds() === 0
        )     
}

function translateD3DateTicks(date, offset, tickLabel) {
  let label = tickLabel.split(' ');
  let translation = label[0];
  switch (label[0]) {
    case "Mon":
      translation = "Lundi";
      break;
    case "Tue":
      translation = "Mardi";
      break;
    case "Wed":
      translation = "Mercredi";
      break;
    case "Thu":
      translation = "Jeudi";
      break;
    case "Fri":
      translation = "Vendredi";
      break;
    case "Sat":
      translation = "Samedi";
      break;
    case "Sun":
      translation = "Dimanche";
      break;

    // months
    case "January":
    case "Jan":
      translation = "Janvier";
      break;
    case "February":
    case "Feb":
      translation = "Février";
      break;
    case "March":
    case "Mar":
      translation = "Mars";
      break;
    case "April":
    case "Apr":
      translation = "Avril";
      break;
    case "May":
      translation = "Mai";
      break;
    case "June":
    case "Jun":
      translation = "Juin";
      break;
    case "July":
    case "Jul":
      translation = "Juillet";
      break;
    case "August":
    case "Aug":
      translation = "Août";
      break;
    case "September":
    case "Sep":
      translation = "Septembre";
      break;
    case "October":
    case "Oct":
      translation = "Octobre";
      break;
    case "November":
    case "Nov":
      translation = "Novembre";
      break;
    case "December":
    case "Dec":
      translation = "Décembre";
      break;
  }
  if (label[1]) {
    if (date.getDay() === 0) {
      return "Dim " + label[1] + " " + translation;
    } else {
      return translation + " " + label[1];
    }
  } else {
    return translation;
  }

}