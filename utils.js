const getDateInRequiredFormat = (date) => {
  var d = date ? new Date(date) : new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const getRandomItem = (data) => {
  return data[Math.floor(Math.random() * data.length)];
};

module.exports = { getDateInRequiredFormat, getRandomItem };
