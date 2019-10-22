import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DateFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value:Date):string {

        var res ='';
      var d=new Date(value);
      var day=(d.getDate()>10)?d.getDate():'0'+d.getDate();
      var mon=(d.getMonth()+1);
     var month=mon>10?mon:"0"+mon;
      var year=d.getFullYear();
      var hours = d.getHours();
      var mins = d.getMinutes()>10?d.getMinutes():"0"+d.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      let hr=hours<10?'0'+hours:hours;
     var minutes = mins < 10 ? '0'+mins : mins;
    res=month+'/'+day+'/'+year+'  '+hr+':'+minutes+' '+ampm  
    return res;
  }
}
