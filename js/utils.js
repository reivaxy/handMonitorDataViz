

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

