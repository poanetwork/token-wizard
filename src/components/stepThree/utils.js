import moment from 'moment';

export function defaultCompanyStartDate() {
  let crowdsaleStartDate = moment().add(5, 'minutes');
  let crowdsaleStartDateFormatted = crowdsaleStartDate.format('YYYY-MM-DDTHH:mm');
  return crowdsaleStartDateFormatted;
}

export function defaultCompanyEndDate(startDate) {
  let endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 4);
  endDate = new Date(endDate).setUTCHours(0);
  return new Date(endDate).toISOString().split(".")[0];
}
