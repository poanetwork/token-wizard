import moment from 'moment';

export function defaultCompanyStartDate() {
  let now = moment();
  let crowdsaleStartDate = now.add(5, 'minutes');
  let crowdsaleStartDateFormatted = crowdsaleStartDate.format('YYYY-DD-MMTHH:mm');
  return crowdsaleStartDateFormatted;
}