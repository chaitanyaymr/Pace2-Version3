import { Component } from '@angular/core';
import { IonicPage, ToastOptions, ToastController, ModalController, LoadingController, Platform } from 'ionic-angular';
import { OdsServiceV1Provider } from '../../providers/ods-service-v1/ods-service-v1';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';

/**
 * Generated class for the WorkOrderStatusV1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:"workorder-status_v1"
})
@Component({
  selector: 'page-work-order-status-v1',
  templateUrl: 'work-order-status-v1.html',
})
export class WorkOrderStatusV1Page {

  resArr:any=[];
  ScrollresArr:any=[];
  PageNo:number=1;
  tostoptions:ToastOptions;
  empid:string="";
  siteId:string="";
  siteTitle:string="";
  emplogo:string="";
  empname:string="";
  emprole:string="";
  intialserve:any=0;
   constructor(public OdsSvc:OdsServiceV1Provider,
    private db:DatabaseProvider,private tostcntrl:ToastController,public modal:ModalController,
    public loadingCtrl:LoadingController,public pacenv:PaceEnvironment,public platform:Platform) {
      this.resArr=[];
      this.presentLoadingCustom();      
    this.db.getAllUsers().then(res=>{
      this.intialserve=0;
     if(res[0].SiteID!="0" && res[0].SiteID!="")
     {
       this.empid=res[0].EmpId;
       this.siteId=res[0].SiteID;
       this.siteTitle=res[0].SiteTitle;
       let empimg:any="";
       if(res[0].Emplogo!="" && res[0].Emplogo !=null)
       {empimg=this.pacenv.Paceimg+"profile/"+res[0].Emplogo;}
       this.emplogo=empimg;
       //this.emplogo=res[0].Emplogo;
       this.empname=res[0].Empname;
       if(this.empname.length>13)
       {
         this.empname=this.empname.substring(0,12)+'..';
       }
       this.emprole=res[0].Rolename;
      this.OdsSvc.GetWorkOrderStatus("<Info><siteid>"+res[0].SiteID+"</siteid><pageNumber>"+this.PageNo+"</pageNumber><pageSize>20</pageSize><eid>"+res[0].EmpId+"</eid></Info>").subscribe(Response=>{
     let arr=Response.json()[0].result;
     this.resArr=(JSON.parse(arr)[0].WOSTATUSVIEW);
     if(this.resArr.length>0)
     this.intialserve=0;
     else
     this.intialserve=1;
  });
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

  doInfinite(event){
    this.PageNo=(this.PageNo)+1;    
    this.OdsSvc.GetWorkOrderStatus("<Info><siteid>"+this.siteId+"</siteid><pageNumber>"+this.PageNo+"</pageNumber><pageSize>20</pageSize><eid>"+this.empid+"</eid></Info>").subscribe(Response=>{            
      let arr=Response.json()[0].result;      
      this.ScrollresArr=(JSON.parse(arr)[0].WOSTATUSVIEW);      
      if (this.ScrollresArr.length == 0) {
        event.enable(false);
      }            
      this.resArr=this.resArr.concat(this.ScrollresArr);
      event.complete();
    });  
  }

  OpenDetails(WOID){
    let WoItem={'WOID':WOID,'Title':this.siteTitle,'EmpId':this.empid,'SiteId':this.siteId}
    let model=this.modal.create('page-WO-DetailsView_v1',{'WoItem':WoItem});
    model.present();
  }
  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: '',
      content:'Loading...',
      cssClass: 'my-loading-class',
      duration: 2000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }
  ionViewDidEnter(){
    this.pacenv.CheckNetwork_Connection();
  }


}
