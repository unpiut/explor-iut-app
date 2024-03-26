const DATE_FORMAT = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit',
});

const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit', minute: '2-digit',
});

function formatDate(dateFormat, d) {
  if (!d) {
    return null;
  }
  try {
    return dateFormat.format(d);
  } catch (e) {
    console.warn(`Wrong date to format: ${d}`, e);
    return null;
  }
}

export function dateToLocalDateString(d) {
  return formatDate(DATE_FORMAT, d);
}
export function dateToLocalTimeString(d) {
  return formatDate(TIME_FORMAT, d);
}

export function dateToLocalDateTimeString(d) {
  return `${dateToLocalDateString(d)} ${dateToLocalTimeString(d)}`;
}
