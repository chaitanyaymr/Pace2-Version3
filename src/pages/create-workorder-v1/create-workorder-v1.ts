import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastOptions, AlertController, ToastController, Platform } from 'ionic-angular';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';
import { DatabaseProvider } from '../../providers/database/database';

import { PaceEnvironment } from '../../common/PaceEnvironment';
import { Device } from '@ionic-native/device';
import { OdsServiceV1Provider } from '../../providers/ods-service-v1/ods-service-v1';

/**
 * Generated class for the CreateWorkorderV1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name:'page-createworkorder_v1'
  }
)
@Component({
  selector: 'page-create-workorder-v1',
  templateUrl: 'create-workorder-v1.html',
})
export class CreateWorkorderV1Page {

  empid:any="";
  empsiteid:any="";
  emproleid:any="";
  empdeptid:any="";
    dlrname:string="";
    entry:string="";
    vin:string="";
    stock:string="";
    ro:string="";
    po:string="";  
    changev:string="";
    changevehicle_obj:any={};
    services_select:any=[];
    totalservices:any=[];
    totaldepartments:any=[];
    date:string;
    time:string="";
    time2:string="";
    changedue:string="";
    note:string="";
    requestBy:any=[];
    requestddl:string="";
    tostoptions:ToastOptions;
    datepicker_mindate:any;
    intialserve:any="0";
    isScan:string="N";
    po_required:any=1;
    stock_length:any=0;
    platform_tabclass:boolean=false;
    /************************BarCode Data*************************************************** */
         options:BarcodeScannerOptions;
          scannedData:any={};
/*********************************************************************************************** */
  constructor(public navCtrl: NavController,public alertcontroller:AlertController,public scanner:BarcodeScanner,
             private dt:DatePicker,private db:DatabaseProvider, private odsservice:OdsServiceV1Provider ,public appconstants:PaceEnvironment,private tostcntrl:ToastController,public platform:Platform
            ,public device:Device) 
             {
               if(platform.is('ios'))
               {
                 this.platform_tabclass=true;
               }
               else
               {
                 this.platform_tabclass=false;
               }
              this.datepicker_mindate=platform.is('ios')==true?new Date(): new Date().valueOf();
              this.db.getAllUsers().then(emdata=>{
                    this.empid=emdata[0].EmpId;
                    this.empsiteid=emdata[0].SiteID;
                    this.empdeptid=emdata[0].DeaprtmentId;
                    if(emdata[0].SiteID!="0" && emdata[0].SiteID!="")
                    {   
                      this.emproleid=emdata[0].RoleID;
                      this.dlrname=emdata[0].SiteTitle;
                      this.refreshdata("0");
                    }
                    else{
                     this.tostoptions={
                       message:"Please Select Site!",
                       duration:3000
                     }
                     this.tostcntrl.create(this.tostoptions).present();
                    }
                   });
                 

  }//end for constructor

 
  refreshdata(flag)
  {
    this.intialserve="0";
    this.entry="single";
    this.vin="";
    this.stock="";
    this.ro="";
    this.po="";
    this.changev="";
    this.changevehicle_obj={};
    this.changedue="";
    this.note="";
    this.po_required=1;
    this.stock_length=0;
    this.isScan="N";
    this.setDateAndTime(0,0);
    this.getSelectedServices(this.empsiteid,this.empid);
    this.requestedByUsers(this.empsiteid,this.emproleid,"M");
  }
  setDateAndTime(hours,minutes)
  {
    var d=new Date();
     d.setHours(d.getHours()+hours);
     d.setMinutes(d.getMinutes()+minutes);
     var mon=(d.getMonth()+1)<10?"0"+(d.getMonth()+1):(d.getMonth()+1)
     var day=d.getDate()<10?"0"+d.getDate():d.getDate()
    this.date=(mon+"/"+day+"/"+d.getFullYear()).toString();
    var apm=d.getHours()>=12?"PM":"AM";
    let hr:any=d.getHours()%12;
     hr=hr?hr:12;
     hr=hr<10?'0'+hr:hr;
     let min:any=d.getMinutes();
     min=min<10?'0'+d.getMinutes():d.getMinutes();
     this.time=hr+ ":"+min+" "+apm;
 }
setThisTime()
{
  var hrs:number=0;
  var mins:number=0;
  this.services_select.forEach(element => {
        if(element.selected==true)
        {
           let hr=parseInt(element.time.split(":")[0]);
           let min=parseInt(element.time.split(":")[1]);
           hrs=hrs+hr;
           mins=mins+min;
        }
  });
  
  this.setDateAndTime(hrs,mins);
}
 
showDatePicker()
{
  
       this.dt.show({
         date:new Date(this.date),
         mode:'date',
         minDate:this.datepicker_mindate,
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
   androidTheme:this.dt.ANDROID_THEMES.THEME_HOLO_LIGHT,
    minDate:this.datepicker_mindate
    
  }).then((data:any)=>{

    this.time2=data.getHours()+":"+data.getMinutes();
    var apm=data.getHours()>=12?"PM":"AM";
    let hr:any=data.getHours()%12;
      hr=hr?hr:12;
      hr=hr<10?'0'+hr:hr;
      var min=data.getMinutes()<10?'0'+data.getMinutes():data.getMinutes();
    this.time=hr+ ":"+min+" "+apm;
  },(error)=>console.log("Date Error",error))
}
FillStock()
{
  this.isScan="N";
  if(this.vin.length>=17)
  {
    this.stock=this.vin.substring(this.vin.length-this.stock_length);
  }
  else
  this.stock="";
}
maxVin(event){

  let newValue = event.value;
  
      let regExp = new RegExp('^[A-Za-z0-9]+$');
  
      if (! regExp.test(newValue)) {
        
        event.value = newValue.slice(0, -1);
        
      }
  if(event.value.length>18)
  event.value=event.value.substring(0,18)
}
maxStock(event){

 let newValue = event.value;
      let regExp = new RegExp('^[A-Za-z0-9]+$');
  
      if (! regExp.test(newValue)) {
        
        event.value = newValue.slice(0, -1);
        
      }
  if(event.value.length>this.stock_length)
  event.value=event.value.substring(0,this.stock_length)
}

changeEntry(value)
{
   this.entry=value;
}
changeVehicle(value)
{
  let count=0;;
  for(var i=0;i<this.services_select.length;i++)
  {
     
    if(this.services_select[i].selected==true)
     {
      count++;
     }
  }
  if(count>0)
  {
      let alert=this.alertcontroller.create({
        title:'Selected service items will be removed. Do you want to continue?',
        buttons:[{
             text:'Ok',
             handler:()=>{
              this.changev=value.Name;
              this.changevehicle_obj=value;
              var filarr=this.filterArray(this.totalservices,this.changev);
                this.copyToServicesArray(filarr);
                this.setDateAndTime(0,0);
             }
        },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
      });
      alert.present();
  }
  else{
    this.changev=value.Name;
    this.changevehicle_obj=value;
    var filarr=this.filterArray(this.totalservices,this.changev);
      this.copyToServicesArray(filarr);
      this.setDateAndTime(0,0);
  }
  
}

selectedService(service)
{
 
   let count=0;;
   for(var i=0;i<this.services_select.length;i++)
   {
      
     if(this.services_select[i].selected==true)
      {
       count++;
      }
   }
   
  
    for(var k=0;k<this.services_select.length;k++)
    {
        if(this.services_select[k].name==service.name)
        {
         
 
          if(this.services_select[k].selected==true)
          {
            this.services_select[k].selected=false;
           this.setThisTime();
          }
         else
          {
            if(count>=5)
            {
                 this.appconstants.ShowAlert("You can select only 5 service items");
            }
            else{
              this.services_select[k].selected=true;
              this.setThisTime();
            }
           
          }
         
        }
    }
  }

changeDueBy(element)
{
  this.changedue=element;
  
}
changeddlrequestedby(ele)
{
  this.requestddl=ele.id;
 
}



/*****************************************BarCode Reader Methods*********************************************************************************** */
scan(){
  this.vin="";
  this.stock="";
  this.options={
    prompt:"Place a barcode inside the viewfinder rectangle to scan it"
  }
   this.scanner.scan(this.options).then((data)=>{
      
      if(data.text.length>18)
      {
       this.appconstants.addErrorMessage("VIN characters should not be more than 17");
       this.appconstants.displayErrors();
       this.vin="";
      }
      else if(data.text.length==18)
      {
        this.vin=data.text.substring(1,18);
        this.stock=this.vin.substring(18-this.stock_length);
        this.isScan="Y";
      }
      else{
        this.vin=data.text;
        this.stock=this.vin.substring(17-this.stock_length);
        this.isScan="Y";
       }
   },(err)=>{
     console.log("Error:",err);
   })
}
/****************************************************************************************************************************************************** */



getSelectedServices(siteid,empid)
{
  this.appconstants.startLoading();
  this.totaldepartments=[];
  this.odsservice.GetSiteServicesInfo(siteid,this.empid).subscribe((data)=>{
     let wopreference:any=data.json()[0].workOrderSitePreferencesInfo[0];
     let porequired=wopreference.ispoRequired;
     let stockcount=wopreference.stockNumberCnt;
     this.po_required=(porequired.toUpperCase()=='Y')?1:0;
     this.stock_length=(stockcount!=0)?stockcount:10;
     this.totalservices=data.json()[0].workOrderSiteServicesItems;
   let totaldepartments:any=data.json()[0].workOrderSiteServicesType;
      if(totaldepartments.length>0)
      {
        for(var j=0;j<totaldepartments.length;j++)
        {
          this.totaldepartments.push({
              "Id":totaldepartments[j].siteServiceTypeNumber,
              "Name":totaldepartments[j].siteServiceTypeName,
              "ServicesCount":0
          });
        }
      }
      else
      {
        this.totaldepartments=[];
      }
  
    this.totaldepartments.forEach(element => {
      var fill_arr:any=[];
      fill_arr=this.filterArray(this.totalservices,element.Name);
       element.ServicesCount=fill_arr.length;
    });
  
    this.changev=this.totaldepartments[0].Name;
    this.changevehicle_obj=this.totaldepartments[0];
    var filarr=this.filterArray(this.totalservices,this.totaldepartments[0].Name);
  
      this.copyToServicesArray(filarr);
      this.intialserve="1";
     this.appconstants.stopLoading();
   })
  
}
filterArray(arr,key)
{
  return arr.filter((item)=>{
     if(item.siteServiceTypeName.toLowerCase().indexOf(key.toLowerCase())>=0)
     {
       return true;
     } 
     return false;
  })
}
copyToServicesArray(filteredarray)
{
        this.services_select=[];
        for(var i=0;i<filteredarray.length;i++)
        {
         this.services_select.push({
            "name":filteredarray[i].siteServiceItemName+" ("+filteredarray[i].siteServiceTimeRequired+")",
            "time":filteredarray[i].siteServiceTimeRequired,
            "id":filteredarray[i].siteServiceNumber,//filteredarray[i].siteServiceItemId,
            "selected":false
          })
        }
}


requestedByUsers(siteid,role,target)
{ 
  this.requestddl="0";
  this.requestBy=[];
  this.requestBy.push({
    "id":0,
    "name":"Select"
  });
    this.odsservice.GetRequestedByUsers(siteid,role,target).subscribe((response)=>{
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

////////////////////////////////////Submit work order///////////////////////////////////////////////////////////////
submitWorkOrder()
{
  if(this.appconstants.CheckNetwork_Connection()==true){
   let notesxml:string="";
   let count=0;
   for(var i=0;i<this.services_select.length;i++)
   {
      
     if(this.services_select[i].selected==true)
      {
       count++;
      }
   }

   if(this.vin=="" && this.stock=="")
   {
        this.appconstants.addErrorMessage("Enter VIN or STOCK");
   }
   if(count==0)
   {
     this.appconstants.addErrorMessage("Please select atleast any one service item");
   }
   if(this.vin!="")
   {
     if(this.vin.length<17)
     {
      this.appconstants.addErrorMessage("Enter valid Vin Number");
     }
     else if(this.isScan=="N")
     {
       if(this.vin.length>=18)
       {
        this.appconstants.addErrorMessage("VIN characters should not be more than 17");
       }
     }
   }

   if(this.appconstants.displayErrors()==true)
   {
    let servicexml = '';
    let servicenotesxml = '';
    for(var i=0;i<this.services_select.length;i++)
    {
       
      if(this.services_select[i].selected==true)
       {
        servicexml+=`<ServiceInfo><SiteServiceNumber>${this.services_select[i].id}</SiteServiceNumber></ServiceInfo>`;
       }
    }
    notesxml=(this.note!='')?`<Notes><NText>${this.note.trim()}</NText><NType>W</NType></Notes>`:""
  
    let duetime=this.changedue;
    if(duetime!="")
    {
      if(duetime.toLowerCase()=="waiting")
      {
        duetime="CW"
      }
      else  if(duetime.toLowerCase()=="spot")
      {
        duetime="SPOT";
      }
    }
    var d=new Date();
    var day=(d.getDate()>=10)?d.getDate():'0'+d.getDate();
    var mon=(d.getMonth()+1);
   var month=mon>=10?mon:"0"+mon;
    var year=d.getFullYear();
    var hours = d.getHours();
    var mins = d.getMinutes()>=10?d.getMinutes():"0"+d.getMinutes();
    let hr=hours<10?'0'+hours:hours;
    var created_day=month+'/'+day+'/'+year+'  '+hr+':'+mins;  


  if((this.isScan=='Y')&& (this.vin.length==18))
  {
    this.vin=this.vin.substring(1,18);
    this.stock=this.vin.substring(this.vin.length-10);  
  }
  



    let reqObj:any={
      "WOSiteId": this.empsiteid,
      "WOEmpId": this.empid,
      "WONumber": 0,
      "WOVinNumber": this.vin.trim().toUpperCase(),
      "WOStockId": this.stock.trim().toUpperCase(),
      "WOROId": this.po_required == 1 ? this.ro.trim().toUpperCase() : '',
      "WOPOId": this.po_required == 1 ? this.po.trim().toUpperCase() : '',
      "WODate": this.date,
      "WOTime": this.time,
      "WODueTime":duetime,
      "WORequestedBy": this.requestddl == '0' ?this.empid :this.requestddl,
      "WOCreatedDate": created_day,
      "WOIPAddress": this.db.ipAddress,
      "WOServiceXML": servicexml,
      "WONotesXML": notesxml,
      "WOServiceNotesXML": servicenotesxml,
      "WOVinImagesXML": '',
      "WOStockImagesXML": '',
      "WOType": 'I',
      "WOCreatedType": 'M',
      "WOCreatedDevice": this.device.platform+" "+this.device.version,
      "WOIsScanned": this.isScan

    };
    
  
      this.odsservice.CreateWorkOrder(reqObj).subscribe((data)=>{
  
        var val=data.json();
        if(val.toLowerCase().indexOf("sucess")>=0)
        {
          this.appconstants.ShowAlert('Work Order Created Successfully');
          this.appconstants.displayErrors();
          //this.refreshdata("1");
          this.navCtrl.setRoot('home-page');
        }
        else{

        }
       
       
      })
      
    
   }
  
  }
}

ionViewDidEnter(){
  this.appconstants.CheckNetwork_Connection();
}

}
