export function defaultCompanyStartDate() {
    let curDate = new Date();
    /*curDate = curDate.setDate(curDate.getDate() + 1);
    curDate = new Date(curDate).setUTCHours(0);
    curDate = new Date(curDate).setMinutes(0);*/
    curDate = new Date(curDate).setUTCHours(new Date().getHours());
    curDate = new Date(curDate).setMinutes(new Date(curDate).getMinutes() + 5);
    let curDateISO = new Date(curDate).toISOString();
    let targetDate = curDateISO.split(".")[0].substring(0, curDateISO.lastIndexOf(":"))
    return targetDate;
}