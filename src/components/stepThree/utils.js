import moment from 'moment';

export function defaultCompanyStartDate() {
  let crowdsaleStartDate = moment().add(5, 'minutes');
  let crowdsaleStartDateFormatted = crowdsaleStartDate.format('YYYY-MM-DDTHH:mm');
  return crowdsaleStartDateFormatted;
}

export const defaultCompanyEndDate = (startDate) => {
  const crowdsaleEndDate = moment(startDate).add(4, 'days').startOf('day')
  return crowdsaleEndDate.format('YYYY-MM-DDTHH:mm')
}
