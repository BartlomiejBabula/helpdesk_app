export function formatDate(date: Date) {
  if (date === new Date(0)) {
    return "";
  } else {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hour = "" + d.getHours(),
      minutes = "" + d.getMinutes(),
      sec = "" + d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (sec.length < 2) sec = "0" + sec;
    if (minutes.length < 2) minutes = "0" + minutes;
    if (hour.length < 2) hour = "0" + hour;

    let formattedDate =
      day + "." + month + "." + year + " " + hour + ":" + minutes + ":" + sec;
    return formattedDate;
  }
}

export function formatErrorMessage(error: string | null) {
  let errorMessage = error;
  let messageContain = [
    "Description:",
    "SOAPFaultException",
    "SocketTimeoutException:",
    "IllegalArgumentException:",
    "Exception:",
    "<Message>",
    "Błąd:",
    "<OperationResultCode>",
  ];
  let founded = false;
  messageContain.forEach((item) => {
    if (errorMessage !== null) {
      let startIndex = errorMessage.indexOf(item);
      if (founded === false && startIndex !== -1) {
        errorMessage = errorMessage.slice(startIndex);
        founded = true;
      }
    }
  });
  return errorMessage;
}

export function formatDateWithoutHours(date: Date) {
  if (date === new Date(0)) {
    return "";
  } else {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    let formattedDate = day + "." + month + "." + year;
    return formattedDate;
  }
}
