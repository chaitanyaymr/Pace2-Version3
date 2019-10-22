import { Component } from '@angular/core';
import { IonicPage, AlertController , ToastOptions, ToastController, Platform, App } from 'ionic-angular';
import{BarcodeScanner,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import {OdsServiceProvider} from '../../providers/ods-service/ods-service'
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage(
  {name:'vin-searchpage'}
)
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {
  empsiteid: any;
  options:BarcodeScannerOptions;
  scannedData:any={};
  dlrname:string="";
  ddlscantype:string="";
  ddlstatustype:string="";
  site:any=[];
  colors:any=[];
  workOrderInfo:any=[];
  empid:string="";
  maxlength:any;
  tostoptions:ToastOptions;
  initialserve:any=0;
  platform_tabclass:boolean=false;
  row_height:any="";
  lbl_ddlscantype:string="Scan Type";
  constructor(public scanner:BarcodeScanner,private tostcntrl:ToastController,
    public odsservice:OdsServiceProvider,public alertcontroller:AlertController,public appconst:PaceEnvironment,private db:DatabaseProvider,public platform:Platform,public app:App) {
      if(platform.is('ios'))
      {
        this.platform_tabclass=true;
      }
      else
      {
        this.platform_tabclass=false;
      }
      console.log("Device height",platform.height());
      if(platform.height()>=700)
      {
        this.row_height=2;
      }
      this.db.getAllUsers().then(emdata=>{
        this.initialserve=0;
        this.empid=emdata[0].EmpId;
        this.empsiteid=emdata[0].SiteID;
        if(emdata[0].SiteID!="0" && emdata[0].SiteID!="")
        {        

         this.dlrname=emdata[0].SiteTitle;
         this.ddlscantype="V";
         this.ddlstatustype="A";
         this.scannedData.text="";
      this.colors.push(
        {
          name:'Assigned', code:'#1861bf', key:'A'
        },
        {
          name:'Completed', code:'green',key:'C'
        },
        {
          name:'In Progress', code:'orange', key:'I' 
        },
        {
          name:'New', code:'white',key:'N'
        },
        {
          name:'Open',code:'dodgerblue',key:'O'
        }
      
       
      
     )
       this.maxlength=20;
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

  scan(){
    this.options={
      prompt:"Place a barcode inside the viewfinder rectangle to scan it"
    }
     this.scanner.scan(this.options).then((data)=>{
      if(data.text.length>18)
      {
       this.appconst.addErrorMessage("VIN must be of 17 digits only");
       this.appconst.displayErrors();
       this.scannedData.text="";
      }
      else if(data.text.length==18)
      {
        this.scannedData=data;
        this.scannedData.text=data.text.substring(1,18);
       
      }
      else{
        this.scannedData=data;
       }
     },(err)=>{
       console.log("Error:",err);
     })
  }
  changeddlscantype(value)
  {
        this.ddlscantype=value;
        this.scannedData.text="";
        this.ddlstatustype="A";
        this.workOrderInfo=[];
        this.initialserve=0;
        if(value=='V')
         this.lbl_ddlscantype="Scan Type";
        else
        this.lbl_ddlscantype="Search Type";
   
  }
  changeddlstatustype(value)
  {
    this.ddlstatustype=value;
    this.workOrderInfo=[];
    this.initialserve=0;
  }
  search()
  {
    if( this.appconst.CheckNetwork_Connection()==true)
    {
      this.workOrderInfo=[];
      if((this.scannedData.text)=="")
      {
          this.appconst.addErrorMessage("Enter data to Search");
      }
      if(this.appconst.displayErrors()==true)
      {
        this.appconst.startLoading();
        let srchstr="";
      srchstr+="<Info>";
      srchstr+="<type>"+this.ddlscantype+"</type>";
      srchstr+="<statustype>"+this.ddlstatustype+"</statustype>";
      //srchstr+="<text>"+this.scannedData.text.toUpperCase()+"</text>";
      srchstr+="<text>"+this.scannedData.text.toUpperCase()+"</text>";
      srchstr+="<eid>"+this.empid+"</eid>";
    //  srchstr+='<siteid>'+this.empsiteid+'</siteid>';
    srchstr+='<siteid>'+this.empsiteid+'</siteid>';
      srchstr+="</Info>";


      //  srchstr+="<Info>";
      // srchstr+="<type>"+'V'+"</type>";
      // srchstr+="<statustype>"+'A'+"</statustype>";
      // srchstr+="<text></text>";
      // srchstr+="<eid>7983</eid>";
      // srchstr+='<siteid>1000</siteid>';
      // srchstr+="</Info>";

  
   
        this.odsservice.vehicleSearch(srchstr).subscribe((data)=>{
          var val=data.json();
          if(val.length>0)
          {
          val=JSON.parse(val[0].result);
          val=val[0].VECHILESEARCH;
         console.log("serach vehicle",val);
         if(val.length>0){

          for(var i=0;i<val.length;i++)
          {
           let clr=val[i].STATUS;
           let status:any="";
             this.colors.forEach(element => {
                if(element.key.toLowerCase()==clr.toLowerCase())   
                {
                  clr=element.code;
                  status=element.name;
                }         
                 
             });
        //     this.workOrderInfo.push({
        //       Stock:val[i].WODETAILS[0].STOCK,
        //       Vin:val[i].WODETAILS[0].VIN,
        //       WO:val[i].WODETAILS[0].WONUMBER,
        //       ItemNo:val[i].ITEMNUMBER,
        //       ItemDesc:val[i].DEPARTMENT+" "+val[i].SERVICEITEM,
        //       Status:status,
        //       InvoiceId:val[i].WODETAILS[0].INVOICEID,
        //       InvoiceDate:val[i].WODETAILS[0].INVOICEDAATE,
        //       Amount:"$ "+val[i].PRICE,
        //       clr:clr
        // });

        this.workOrderInfo.push({
          Stock:val[i].STOCK,
          Vin:val[i].VIN,
          WO:val[i].WONUMBER,
         // ItemNo:val[i].ITEMNUMBER,
        //  ItemDesc:val[i].DEPARTMENT+" "+val[i].SERVICEITEM,
          Status:status,
          InvoiceId:val[i].INVOICEID,
          InvoiceDate:val[i].INVOICEDAATE,
          Amount:"$ "+val[i].PRICE,
          clr:clr
    });

          }
          this.initialserve=0;
         }
         else{
               this.initialserve=1;
        }
    } 
          else{
           
            this.initialserve=1;
          }
          this.appconst.stopLoading();
        });
      
      }
    }
   
  }

  getColor(clr)
  {
    clr='6px solid '+clr;
    return clr;
  }
  getSize()
  {
    if(this.ddlscantype=="V")
    return '17';
    else if(this.ddlscantype=="S")
    return '10';
    else
    return '20';
  }
  ionViewDidEnter(){
    this.appconst.CheckNetwork_Connection();
  }

  maxVin(event){
   if(event.value.length>17)
    event.value=event.value.substring(0,17)
  }
  maxStock(event)
  {
    if(event.value.length>10)
    event.value=event.value.substring(0,10);
  }
  
}
