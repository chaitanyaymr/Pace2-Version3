import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastOptions, ToastController, Platform } from 'ionic-angular';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner';
import { OdsServiceV1Provider } from '../../providers/ods-service-v1/ods-service-v1';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { Device } from '@ionic-native/device';
import { DatabaseProvider } from '../../providers/database/database';
import { DatePicker } from '@ionic-native/date-picker';

/**
 * Generated class for the SoldDeliveryslipV1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-preownedcar_v1'
})
@Component({
  selector: 'page-sold-deliveryslip-v1',
  templateUrl: 'sold-deliveryslip-v1.html',
})
export class SoldDeliveryslipV1Page {

  platform_tabclass: boolean=false;
  options:BarcodeScannerOptions;
  VINscannedData:any={};
  SoldDeliveryData:any={
    VIN:"",
    StockNumber:"",    
    SalesMan:"",
    Notes:"",
    deliverycheck :  true
  }
  ResetSoldDeliveryData:any={
    VIN:"",
    StockNumber:"",    
    SalesMan:"",
    Notes:"",
    deliverycheck :  true
  }
  dealersite:string="";
  ddlscantype:string="";
  requestBy:any=[];
  requestddl:string="";
  empid:string="";
  empsiteid:number=1000;
  emproleid:string="sp";
  empdeptid:any="";
  IsScan:string="N";
  tostoptions:ToastOptions;
  
  date:string;
  date_min:any;
  time:string="";
  time2:string="";
  siteTitle:string="";

  constructor(public navCtrl: NavController, public scanner:BarcodeScanner,public OdsSvc:OdsServiceV1Provider,
    public PaceEnv:PaceEnvironment,public Dvc:Device,private db:DatabaseProvider,private tostcntrl:ToastController,private dt:DatePicker,
    public platform:Platform) {
      if(platform.is('ios'))
      {
        this.platform_tabclass=true;
      }
      else
      {
        this.platform_tabclass=false;
      }
      this.date_min=platform.is('ios')==true?new Date(): new Date().valueOf();
    this.Binddatetime();
    this.db.getAllUsers().then(emdata=>{
       this.empid=emdata[0].EmpId;
       this.emproleid=emdata[0].RoleID;
       this.empsiteid=emdata[0].SiteID;
       this.siteTitle=emdata[0].SiteTitle;
       this.empdeptid=emdata[0].DeaprtmentId;
      if(emdata[0].SiteID!="0" && emdata[0].SiteID!=""){        
      this.ddlscantype="VIN";
      this.VINscannedData.text="";
      this.requestedByUsers(this.empsiteid,this.emproleid,"M"); 
     }
     else{
      this.tostoptions={
        message:"Please Select Site!",
        duration:3000
      }
      this.tostcntrl.create(this.tostoptions).present();
     }
    });
   
  }

  Binddatetime(){
    var d=new Date();
    var mon=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1)
    var day=d.getDate()<10?"0"+d.getDate():d.getDate()
    this.date=(mon+"/"+day+"/"+d.getFullYear()).toString();
    d.setHours(d.getHours()+1);
    var apm=d.getHours()>=12?"PM":"AM";
    var hr:any=d.getHours()%12;
      hr=hr?hr:12;
      hr=hr<10?'0'+hr:hr;
      var min=d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
    this.time=hr+ ":"+min+" "+apm;
  }

  scan(){
    this.IsScan="Y";
    this.SoldDeliveryData.VIN="";
    this.SoldDeliveryData.StockNumber="";
    this.options={
      prompt:"Place a barcode inside the viewfinder rectangle to scan it"
    }
     this.scanner.scan(this.options).then((data)=>{
      if(data.text.length>18)
      {
       this.PaceEnv.addErrorMessage("VIN characters should not be more than 17");
       this.PaceEnv.displayErrors();
       this.SoldDeliveryData.VIN="";
       this.SoldDeliveryData.StockNumber="";
      }
      else if(data.text.length==18)
      {
        this.VINscannedData=data;
        this.SoldDeliveryData.VIN=this.VINscannedData.text.substring(1,18);   
        this.SoldDeliveryData.StockNumber=this.SoldDeliveryData.VIN.substring(8); 
      }
      else{ 
        this.VINscannedData=data;
        this.SoldDeliveryData.VIN=this.VINscannedData.text;
        this.SoldDeliveryData.StockNumber=this.SoldDeliveryData.VIN.substring(this.VINscannedData.text.length-10);
      }
     },(err)=>{
       console.log("Error:",err);
     })
  }

  ResetScanTyp(){
    this.IsScan="N";
    if(this.SoldDeliveryData.VIN.length>=17)
       this.SoldDeliveryData.StockNumber=this.SoldDeliveryData.VIN.substring(this.SoldDeliveryData.VIN.length-10);
    else
      this.SoldDeliveryData.StockNumber="";
  }
  maxVin(event)
  {
    let newValue = event.value;
        let regExp = new RegExp('^[A-Za-z0-9]+$');
        if (! regExp.test(newValue)) {
          event.value = newValue.slice(0, -1);
        }
        if(event.value.length>18)
        event.value=event.value.substring(0,18)
  }
  maxStock(event)
  {
    let newValue = event.value;
        let regExp = new RegExp('^[A-Za-z0-9]+$');
        if (! regExp.test(newValue)) {
          event.value = newValue.slice(0, -1);
        }
    if(event.value.length>10)
    event.value=event.value.substring(0,10)
  }
  changeddlscantype(value)
  {
        this.ddlscantype=value;
  }


  addValue(e){
    if(e.target.checked==true){
      this.SoldDeliveryData.deliverycheck="P"
      this.setDateAndTime(1,0);
    }
     
    else{
      this.SoldDeliveryData.deliverycheck=true;
      e.target.checked=true;
    }
      
  }
  setDateAndTime(hours,minutes)
  {
    var d=new Date();
    d.setHours(d.getHours()+hours);
    d.setMinutes(d.getMinutes()+minutes);
    var mon=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1)
    var day=d.getDate()<10?"0"+d.getDate():d.getDate()
    this.date=(mon+"."+day+"."+d.getFullYear()).toString();
   var apm=d.getHours()>=12?"PM":"AM";
   let hr:any=d.getHours()%12;
   hr=hr?hr:12;
    hr=hr<10?'0'+hr:hr;
    let min:any=d.getMinutes();
     min=min<10?'0'+d.getMinutes():d.getMinutes();
    this.time=hr+ ":"+min+" "+apm;
  }


  ionViewDidEnter(){
    this.PaceEnv.CheckNetwork_Connection();
  }
  submitSoldSlip()
  {
    if(this.PaceEnv.CheckNetwork_Connection()==true){
   let dataxml:string="";
   let notesxml:string="";
   
   if(this.SoldDeliveryData.VIN==""&&this.SoldDeliveryData.StockNumber=="")
   {
        this.PaceEnv.addErrorMessage("Enter VIN or STOCK");
   }
   if(this.SoldDeliveryData.VIN!="")
   {
     
     if(this.SoldDeliveryData.VIN.length<17)
     {
      this.PaceEnv.addErrorMessage("Enter valid Vin Number");
     }
    else if(this.IsScan=="N")
     {
      if(this.SoldDeliveryData.VIN.length>=18)
      {
        this.PaceEnv.addErrorMessage("VIN characters should not be more than 17");
      }
     }
   }
   if(this.PaceEnv.displayErrors()==true)
   {
    if((this.IsScan=='Y')&& (this.SoldDeliveryData.VIN.length==18))
    {
      this.SoldDeliveryData.VIN=this.SoldDeliveryData.VIN.substring(1,18);
      this.SoldDeliveryData.StockNumber=this.SoldDeliveryData.VIN.substring(this.SoldDeliveryData.VIN.length-10);  
    }
    this.requestddl=(this.empdeptid=="6")?this.requestddl:this.empid;
    var d=new Date();
    var day=(d.getDate()>=10)?d.getDate():'0'+d.getDate();
    var mon=(d.getMonth()+1);
   var month=mon>=10?mon:"0"+mon;
    var year=d.getFullYear();
    var hours = d.getHours();
    var mins = d.getMinutes()>=10?d.getMinutes():"0"+d.getMinutes();
    let hr=hours<10?'0'+hours:hours;
    this.requestddl=this.requestddl == '0' ?this.empid :this.requestddl;
  var created_day=month+'/'+day+'/'+year+'  '+hr+':'+mins;  
    dataxml="<Info>";
    dataxml+="<siteid>"+this.empsiteid+"</siteid>";
    dataxml+="<empid>"+this.empid+"</empid>";
    dataxml+="<vin>"+this.SoldDeliveryData.VIN+"</vin>";
    dataxml+="<stock>"+this.SoldDeliveryData.StockNumber+"</stock>";
    dataxml+="<wodate>"+this.date+"</wodate>";
    dataxml+="<wotime>"+this.time+"</wotime>";
    dataxml+="<requestedby>"+ this.requestddl+"</requestedby>";
    dataxml+="<createddate>"+created_day+"</createddate>";
    dataxml+="<ipaddress>"+this.db.ipAddress+"</ipaddress>";
    dataxml+="<wotype>P</wotype>";
    dataxml+="<createtype>M</createtype>";
    dataxml+="<devicetype>"+this.Dvc.platform+" "+this.Dvc.version+"</devicetype>";
    dataxml+="<scantype>"+this.IsScan+"</scantype>";
    dataxml+="</Info>";

    notesxml="<Notes>"; 
    notesxml+="<NText>"+this.SoldDeliveryData.Notes+"</NText>";
    notesxml+="<NType>W</NType>";
    notesxml+="</Notes> ";
    this.OdsSvc.CreateSoldDeliverySlip(dataxml,notesxml).subscribe(Response=>{
      let ErrId=JSON.parse(Response._body)[0].errorId;
      if(ErrId=="0"){
        this.PaceEnv.ShowAlert('Work Order Created Successfully');
        this.PaceEnv.displayErrors();
        this.SoldDeliveryData=this.ResetSoldDeliveryData;  
        this.requestddl="0";      
        this.Binddatetime();      
        this.navCtrl.setRoot('home-page');
      }
    });
   }
  }
  }

requestedByUsers(siteid,role,target)
{ 
  this.requestddl="0";
  this.requestBy.push({
    "id":0,
    "name":"Select"
  });
    this.OdsSvc.GetRequestedByUsers(siteid,role,target).subscribe((response)=>{
      if(response.status==200)
      {
               var arr=response.json();
               for(var g=0;g<arr.length;g++)
               {
                 this.requestBy.push({
                  "id":arr[g].employeeId,
                   "name":arr[g].employeeName
                 })
               }  
      }
    })
}

changeddlrequestedby(ele)
{
  this.requestddl=ele.id;  
}


showDatePicker()
{
       this.dt.show({
         date:new Date(this.date),
         mode:'date',
         minDate:this.date_min,
        androidTheme:this.dt.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
       }).then((data)=>{
        
         var mon=(data.getMonth()+1)<10?"0"+(data.getMonth()+1):(data.getMonth()+1)
         var day=data.getDate()<10?"0"+data.getDate():data.getDate()
         this.date=(mon+"/"+day+"/"+data.getFullYear()).toString();
       },(error)=>console.log("Date Error",error))
}

showTimePicker()
{ 
  var dts:any=this.date.split("/");
  var tt_hr:any=this.time.split(":")[0];
  var tt_min:any=this.time.split(":")[1].substring(0,2);
  var tt_apm:any=this.time.split(":")[1].substring(2);
  if(tt_apm.indexOf("P")>=0)
  {
    if(tt_hr!=12)
    {
      tt_hr=parseInt(tt_hr)+12;
    }
  }
  else if(tt_apm.indexOf("A")>=0)
  {
    if(tt_hr==12)
    {
      tt_hr=parseInt(tt_hr)+12;
    }
  }
   
  var mon:any=parseInt(dts[0])-1;
  this.dt.show({
    date:new Date(dts[2],mon,dts[0],tt_hr,tt_min),
    mode:'time',
    androidTheme:this.dt.ANDROID_THEMES.THEME_HOLO_LIGHT
  }).then((data:any)=>{
    this.time2=data.getHours()+":"+data.getMinutes();
    var apm=data.getHours()>=12?"PM":"AM";
    let hr:any=data.getHours()%12;
      hr=hr?hr:12;
      hr=hr<10?'0'+hr:hr
      var min=data.getMinutes()<10?'0'+data.getMinutes():data.getMinutes();
    this.time=hr+ ":"+min+" "+apm;
  },(error)=>console.log("Date Error",error))
}

}
