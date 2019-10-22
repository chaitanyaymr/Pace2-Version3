import { Component } from '@angular/core';
import { IonicPage, NavController,  ToastController, ToastOptions, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';


@IonicPage({
  name:'support-page'
})
@Component({
  selector: 'page-support-request',
  templateUrl: 'support-request.html',
})
export class SupportRequestPage {
  platform_tabclass: boolean=false;
  dlrname:any="";
  empid:any="";
  empsiteid:any='';
 name:any="";
 email:any="";
 phone:any="";
 message:any="";
 tostoptions:ToastOptions;
  constructor(public navCtrl: NavController, 
    private db:DatabaseProvider, 
    private odsservice:OdsServiceProvider ,
    public appconstants:PaceEnvironment,
    private tostcntrl:ToastController,public platform:Platform) {
      if(platform.is('ios'))
      {
        this.platform_tabclass=true;
      }
      else
      {
        this.platform_tabclass=false;
      }
      this.db.getAllUsers().then(emdata=>{
        this.appconstants.startLoading();
        this.empid=emdata[0].EmpId;
        this.empsiteid=emdata[0].SiteID;
        if(emdata[0].SiteID!="0" && emdata[0].SiteID!="")
        {   
           this.dlrname=emdata[0].SiteTitle;
           this.odsservice.GetEmployeeInformation(this.empid).subscribe(data=>{
          let empinfo:any = JSON.parse(data)[0].TBL_EMP[0];
            this.name=empinfo.EmployeeName
             this.email=empinfo.EmployeeEmail;
             this.phone=empinfo.EmployeePhone;
             this.appconstants.stopLoading();
           });
        }
        else{
         this.tostoptions={
           message:"Please Select Site!",
           duration:3000
         }
         this.tostcntrl.create(this.tostoptions).present();
         this.appconstants.stopLoading();
        }
       });
  }//end for constructor

  maxPhone(event)
  {
    let newValue = event.value;
        let regExp = new RegExp('^[0-9]+$');
        if (! regExp.test(newValue)) {
          event.value = newValue.slice(0, -1);
        }
    if(event.value.length>12)
    event.value=event.value.substring(0,12);
  }
  chkBeforeSubmit()
  {
    let regExp=new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
    if(this.name=="")
    {
         this.appconstants.addErrorMessage("Enter Name");
    }
    if(this.email=="")
    {
         this.appconstants.addErrorMessage("Enter Email");
    }
    if(this.email!="")
    {
      if(! regExp.test(this.email))
      {
        this.appconstants.addErrorMessage("Enter Valid Email");
      }
    }
    if(this.phone=="")
    {
         this.appconstants.addErrorMessage("Enter Phone");
    }
   if(this.message=="")
    {
         this.appconstants.addErrorMessage("Enter Message");
    }
    
    
   return  this.appconstants.displayErrors();
  }
  submitRequest()
  {
    if(this.appconstants.CheckNetwork_Connection()==true){
     
      if(this.chkBeforeSubmit()==true)
      {
       this.odsservice.SubmitSupportReq(this.empid,this.name,this.email,this.phone,this.message)
       .subscribe(data=>{
        if(data.json()[0].errorId==0)
        {
          this.appconstants.ShowAlert('Request Submitted Successfully');
          this.appconstants.displayErrors();
          this.navCtrl.setRoot('home-page');
        }
       })

      }

    }//end for network check
  }

}
