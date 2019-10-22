import { Component } from '@angular/core';
import { IonicPage,  NavParams, ViewController, ToastOptions, ToastController, Platform } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';


@IonicPage(
  {
    name:"page-WO-DetailsView"
  }
)
@Component({
  selector: 'page-wo-details-view',
  templateUrl: 'wo-details-view.html',
})
export class WoDetailsViewPage {
  dlrname:string="";
   vin:string="";
   stock:string="";
   ro:string="";
   po:string="";
   wo:string="";
   dueby:string="";
   device:string="";
   createdby:string="";
   createdTs:string="";
   requestedby:string="";
   requestedTs:string="";
   approvedby:string="";
   approvedTs:string="";
   tostoptions:ToastOptions;
   service_details:any=[];
   moreInfo : any;
   colors:any=[];
   selCorlor : any;
   float_button:boolean=false;
   flag:any="";
  constructor( public navParams: NavParams,private odsservce:OdsServiceProvider,public viewctrl:ViewController,private tostcntrl:ToastController
  ,public appconst:PaceEnvironment,public platform:Platform) {
   // this.appconst.startLoading();
    this.float_button=false;
    if(platform.is('ios'))
    {
      this.float_button=true;
    }
    else
    {
      this.float_button=false;
    }
    this.colors.push(
      {
        name:'Assigned', code:'#1861bf', key:'A'
      },
      {
        name:'Completed', code:'green',key:'C'
      },
      {
        name:'In-Progress', code:'orange', key:'I' 
      },
      {
        name:'New', code:'blue',key:'N'
      },
      {
        name:'Open',code:'dodgerblue',key:'O'
      }
      
   )
      let params=this.navParams.get('WoItem');     
      this.moreInfo = params.WOID; 
      
      this.dlrname=params.Title;
      this.flag=params.Flag;
      //   if(this.flag=="SUB")
      //   {
      //     this.moreInfo.WOSERVICES=params.WOID.SUBWORKORDER[params.Index].WOSERVICES;
      //     this.moreInfo.WONUMBER=params.WOID.SUBWORKORDER[params.Index].WONUMBER;
      //   }
      // else{
      //   this.moreInfo.WOSERVICES=params.WOID.WOSERVICES;
      //     this.moreInfo.WONUMBER=params.WOID.WONUMBER;
      // }
      
      let srchstr="";
      let searchby="W";
      let wonum=params.WOID.WONUMBER;
       if(wonum=="")
       {
         wonum=params.WOID.VINID;
         searchby="V";
       }
      // srchstr+="<workOrderSearch><pageNumber>1</pageNumber><pageSize>5</pageSize>";
      // srchstr+="<loggedInemployeeId>"+params.EmpId+"</loggedInemployeeId>";
      // srchstr+="<siteNumber>"+params.SiteId+"</siteNumber>";
      // srchstr+="<dateSearch>Cu</dateSearch><startDate>0</startDate><endDate>0</endDate><statuSearch>A</statuSearch>";
      // srchstr+="<searchBy>"+searchby+"</searchBy>";
      // srchstr+="<searchInput>"+wonum+"</searchInput><OrderBy>ALL</OrderBy><ItemBy>0</ItemBy><SortBy>1</SortBy></workOrderSearch>";

      //srchstr = " <Info><siteid>"+params.SiteId+"</siteid><pageNumber>1</pageNumber><pageSize>5</pageSize><eid>"+params.EmpId+"</eid><searchtype></searchtype><searchtext>"+wonum+"</searchtext><searchstatus>A</searchstatus></Info>";
     

      //console.log(srchstr);
      
      // this.odsservce.SearchInfo(srchstr).subscribe((data)=>{
      //   var val=data.json();
      //   if(val.length>0)
      //   {
      //     let details=val[0].workOrderInfo;
      //     let service_details_src=val[0].workOrderServiceDetails;
      //      if(details.length>0)
      //      {
      //        details=val[0].workOrderInfo[0];
      //       this.vin=details.workOrderVinNumber;
      //       this.stock=details.workOrderStockId;
      //       this.ro=details.workOrderROId;
      //       this.po=details.poId;
      //       this.wo=details.workOrderId;
      //       this.device=(details.workOrderDeviceType.toLowerCase()=="m")?details.workOrderDeviceName:"";
      //       this.createdby=details.workOrderCreatedBy.toUpperCase();
      //       this.createdTs=details.workOrderCreatedDate;
      //       if(this.createdTs!="") this.createdTs="@ "+this.createdTs;
      //       this.requestedby=details.workOrderRequestedBy.toUpperCase();
      //       let reqtime=details.workOrderRequestTime.split('');
      //      let reqstr="";
      //        if(reqtime[reqtime.length-3]!="")
      //        {
      //           for(var i=0;i<=reqtime.length-3;i++)
      //           {
      //             reqstr+=reqtime[i];
      //           }
      //           reqstr=reqstr+" ";
      //           for(var j=reqtime.length-2;j<reqtime.length;j++)
      //           {
      //             reqstr+=reqtime[j].toUpperCase();
      //           }
      //        }
      //        else
      //        {
      //          reqstr=details.workOrderRequestTime;
      //        }
      //       this.dueby=details.workOrderRequestDate+" "+reqstr;
      //         if(this.requestedby=="" || this.requestedby==null || this.requestedby=="NA")
      //          {
      //             this.requestedby= this.createdby;
      //          }
      //          this.requestedTs=this.createdTs;
      //       if((this.requestedTs!="") && (this.requestedTs.indexOf('@')==-1))this.requestedTs="@ "+this.requestedTs;
      //       this.approvedby=details.workOrderApprovedByName.toUpperCase();
      //       this.approvedTs=details.workOrderApprovedDate+" "+details.workOrderApprovedTime;
      //       if(this.approvedTs==" ")
      //               this.approvedTs="";
      //       if(this.approvedby=="NA" || this.approvedby==null)
      //          this.approvedby="--";
      //          this.appconst.stopLoading();
      //     }else{
      //       this.appconst.stopLoading();
      //       this.tostoptions={
      //         message:"No data found",
      //         duration:3000
      //       }
      //       this.tostcntrl.create(this.tostoptions).present();
      //     }
      //      if(service_details_src.length>0)
      //      {
      //       for(var t=0;t<service_details_src.length;t++)
      //       {
      //         let status=service_details_src[t].workOrderServiceStatus;
      //         let clr="";
      //         this.colors.forEach(element => {
      //           if(element.key.toLowerCase()==status.toLowerCase())
      //           {
      //             clr=element.code;
      //             status=element.name.toUpperCase();
      //           }
      //         });
      //         let assign_to=service_details_src[t].workOrderServiceToName;
      //          if(assign_to=="NA" || assign_to=="")
      //              assign_to="-";
      //         let selfassign=service_details_src[t].workOrderServiceIsSelfAssigned;
      //          if(selfassign.toLowerCase()=="y")
      //             assign_to="Self Assigned";
      //         let assign_by=service_details_src[t].workOrderServiceAssignedByName;
      //            if(assign_by=="NA" || assign_by=="")
      //              assign_by="-"
      //        this.service_details.push({
      //          Title:service_details_src[t].workOrderServiceCategoryName+" "+service_details_src[t].workOrderServiceTitle,
      //          Status:status,
      //          Clr:clr,
      //          Assigned_To:assign_to,
      //          Assigned_By:assign_by,
      //          Img:"",
      //      })
      //       }
      //      }
      //      }else{
      //       this.appconst.stopLoading();
      //       this.tostoptions={
      //         message:"No data found",
      //         duration:3000
      //       }
      //       this.tostcntrl.create(this.tostoptions).present();
      //     }
      // })

  }

  ionViewDidEnter(){
    this.appconst.CheckNetwork_Connection();
  }

  closeModal()
  {
    this.moreInfo={};
        this.viewctrl.dismiss();
  }
  getColor(status)
  {
    let clr = this.colors.filter(function(e){ 
      if(e.key == status){
        return e.name;
      }
    });
   
    return clr[0].code;
  }


  getStatus(st){   

    let clr = this.colors.filter(function(e){ 
      if(e.key == st){
        return e.name;
      }
    });
    
    return clr[0].name;
    // if(st == 'N'){
    //   return 'NEW';
    // }else if(st == 'A'){
    //   return 'APPROVED';
    // }else if(st == 'O'){
    //   return 'OPENED';
    // }else if(st == 'C'){
    //   return 'COMPLETED';
    // }else if(st == 'P'){
    //   return 'PROGRESS';
    // }
  }
}
