import moment from 'moment';

export function defaultCompanyStartDate() {
  let crowdsaleStartDate = moment().add(5, 'minutes');
  let crowdsaleStartDateFormatted = crowdsaleStartDate.format('YYYY-MM-DDTHH:mm');
  return crowdsaleStartDateFormatted;
}
