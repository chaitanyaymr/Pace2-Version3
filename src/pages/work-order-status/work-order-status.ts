import { Component } from '@angular/core';
import { IonicPage,   ModalController, ToastOptions, ToastController,LoadingController, Platform } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';

@IonicPage({
  name:"workorder-status"
})
@Component({
  selector: 'page-work-order-status',
  templateUrl: 'work-order-status.html',
})
export class WorkOrderStatusPage {
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
  sitenumber:any="";
   constructor(public OdsSvc:OdsServiceProvider,
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
      this.sitenumber=res[0].SiteNumber;
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
      // console.log("Sample Data : <Info><siteid>"+res[0].SiteID+"</siteid><pageNumber>"+this.PageNo+"</pageNumber><pageSize>20</pageSize><eid>"+res[0].EmpId+"</eid></Info>");
      this.OdsSvc.GetWorkOrderStatus("<Info><siteid>"+this.sitenumber+"</siteid><pageNumber>"+this.PageNo+"</pageNumber><pageSize>20</pageSize><eid>"+this.empid+"</eid></Info>").subscribe(Response=>{
      let body=JSON.parse(Response._body);
      let result=JSON.parse(body[0].result)
      console.log("requestedbyusers : ",result);
      this.resArr = result;
       
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
    this.OdsSvc.GetWorkOrderStatus("<Info><siteid>"+this.sitenumber+"</siteid><pageNumber>"+this.PageNo+"</pageNumber><pageSize>20</pageSize><eid>"+this.empid+"</eid></Info>").subscribe(Response=>{            
      let body=JSON.parse(Response._body);
      if(body[0].result!="")
      {
        let result=JSON.parse(body[0].result)     
        this.ScrollresArr=result;  
      }
   else {
        event.enable(false);
      }            
      this.resArr=this.resArr.concat(this.ScrollresArr);
      event.complete();
    });  
  }

  OpenDetails(WO,flag,index){
    console.log("WOID",WO,"flag::",flag,"index::",index);
    let WOID:any={}
     if(flag=="SUB")
     {
       let sub:any=WO;
       let womid=sub.WOMID;
       let w:any={}
       
       WOID={
        VINID:WO.VINID,
        STOCKID:WO.STOCKID,
        RO:WO.RO,
        PO:WO.PO,
        WONUMBER:WO.SUBWORKORDER[index].WONUMBER,
        REQDATE:WO.REQDATE,
        REQTIME:WO.REQTIME,
        REQUESTEDBYNAME:WO.REQUESTEDBYNAME,
        TS:WO.TS,
        ACCEPTEDBYNAME:WO.ACCEPTEDBYNAME,
        WOSERVICES:WO.SUBWORKORDER[index].WOSERVICES
       }
     
     }
     else{
      WOID={
        VINID:WO.VINID,
        STOCKID:WO.STOCKID,
        RO:WO.RO,
        PO:WO.PO,
        WONUMBER:WO.WONUMBER,
        REQDATE:WO.REQDATE,
        REQTIME:WO.REQTIME,
        REQUESTEDBYNAME:WO.REQUESTEDBYNAME,
        TS:WO.TS,
        ACCEPTEDBYNAME:WO.ACCEPTEDBYNAME,
        WOSERVICES:WO.WOSERVICES

       }
     }
    let WoItem={'WOID':WOID,'Title':this.siteTitle,'EmpId':this.empid,'SiteId':this.siteId,'Flag':flag,'Index':index};
    let model=this.modal.create('page-WO-DetailsView',{'WoItem':WoItem});
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
