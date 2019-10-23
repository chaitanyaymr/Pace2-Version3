import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, Events } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';


@IonicPage({ name: 'home-page' })
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  dlrname: string = "";
  dealersiteId: any;
  empid: any = "";
  empresult: any = [];
  emplog: any;
  sitecount: any = "";
  platform_dlrlbl: boolean = false;
  platform_dlrarrow: boolean = false;
  sitenumber: any = "";
  access_permission:any="";
  change_version:any="new";
  constructor(private db: DatabaseProvider,
    public odsservice: OdsServiceProvider, private appconst: PaceEnvironment,
    public modalctrl: ModalController, public platform: Platform,private events:Events) {
    if (platform.is('ios')) {
      this.platform_dlrarrow = true;
      this.platform_dlrlbl = true;
    }
    else {
      this.platform_dlrarrow = false;
      this.platform_dlrlbl = false;
    }

    this.db.getAllUsers().then(res => {
      this.empresult = res[0];

      this.empid = res[0].EmpId;
      this.dlrname = res[0].SiteTitle;
      this.sitenumber = res[0].SiteNumber;
      if (this.dlrname.length > 26) {
        this.dlrname = this.dlrname.substring(0, 26) + "..";
      }
      this.dealersiteId = res[0].SiteID;
      this.sitecount = res[0].SiteCount;
    
      if (this.empresult.SiteID == 0) {
        this.getSiteInfo(this.empid);
      }
      else {
          if(res[0].Permission=="Y"){
            this.events.publish('permission:Y');
            this.access_permission="Y";
          }
         
          else
          {
            this.events.publish('permission:N');  
            this.access_permission="N";
          } 
          
      }
    });


  }


  /*************Getting Site info****************** */
  getSiteInfo(empid) {
    this.change_version="new";
    this.odsservice.GetEmployeeSiteInfo(empid).subscribe((data) => {

      if (data.status == 200) {
        let value = data.json();

        if (value.length > 0) {

          this.sitecount = value.length;
          //  this.dealersiteId=value[0].empSiteNumber;
          //  this.dlrname=value[0].empSiteTitle;
          this.dealersiteId = value[0].siteId;
          this.dlrname = value[0].siteTitle;
          this.sitenumber = value[0].siteNumber;
          if (this.dlrname.length > 26) {
            this.dlrname = this.dlrname.substring(0, 26) + "..";
          }
          let siteLogo = value[0].siteLogo,stockcount:any="8",po:any="N",ro:any="N"
          this.odsservice.GetStockPORODetails(this.dealersiteId).subscribe(resdata => {
            console.log("result", JSON.parse(resdata[0].result));
            let result = JSON.parse(resdata[0].result)[0];
            if (result.SITEPREFERENCES.length > 0) {
                let dt=result.SITEPREFERENCES[0];
                  stockcount=dt.STOCKLENGTH;
                  po=dt.POREQ;
                  ro=dt.ROREQ;
            }
            else{
              stockcount=8;
              po="N";
              ro="N";
            }
            let siteno=this.empid==1?0:this.sitenumber;
            this.odsservice.GetWOPermissionDetails(this.empid,siteno).subscribe(response=>{
              if(response[0].result!="")
              {
                let value=JSON.parse(response[0].result)[0];
                console.log("Permission Response",value);
                let create:any="N"
                if(value.Create.toUpperCase()=="Y"){
                  create="Y";
                  this.access_permission="Y";
                
                  this.events.publish('permission:Y');
                }
                else{
                  this.access_permission="N";
                 
                  this.events.publish('permission:N');
                }
               
                  
                this.db.UpdateSiteInfo_EMP(this.dealersiteId,siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount,this.sitenumber,stockcount,po,ro,create).then((data) => {
  
                })
              }
              else{
                this.access_permission="N";
               
                this.events.publish('permission:N');
                this.db.UpdateSiteInfo_EMP(this.dealersiteId,siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount,this.sitenumber,stockcount,po,ro,'N').then((data) => {
  
                })
              }
              
          })
            
          })
         
        }
        else {
          this.dlrname = "Please select site";
          this.dealersiteId = 0;
        }
      }
    })
  }



  ionViewDidEnter() {
    this.appconst.CheckNetwork_Connection();
  }

  changeSite() {
    this.change_version=this.change_version=="new"?"old":"new";
    let site = [];
    this.appconst.startLoading();

    this.odsservice.GetEmployeeSiteInfo(this.empresult.EmpId).subscribe((data) => {

      let value = data.json();
      for (let i = 0; i < value.length; i++) {
        let status: boolean = false
        if (value[i].siteId == this.dealersiteId) {
          status = true;
        }
        site.push({
          "siteId": value[i].siteId,
          "siteTitle": value[i].siteTitle,
          "siteLogo": value[i].siteLogo,
          "siteNumber": value[i].siteNumber,
          "status": status
        })
      }

      this.appconst.stopLoading();
      let modal = this.modalctrl.create('page-sitesearch', { 'Data': site });
      modal.present();

      modal.onDidDismiss((data) => {

        if (typeof data == "undefined" || data.sitesearchresult == "") {

        }
        else {
          this.dealersiteId = data.sitesearchresult.siteId;
          this.dlrname = data.sitesearchresult.siteTitle;
          this.sitenumber = data.sitesearchresult.siteNumber;
          if (this.dlrname.length > 26) {
            this.dlrname = this.dlrname.substring(0, 26) + ".."
          }
          let stockcount:any="8",po:any="N",ro:any="N";
          this.odsservice.GetStockPORODetails(this.dealersiteId).subscribe(resdata => {
            console.log("result", JSON.parse(resdata[0].result));
            let result = JSON.parse(resdata[0].result)[0];
            if (result.SITEPREFERENCES.length > 0) {
                let dt=result.SITEPREFERENCES[0];
                  stockcount=dt.STOCKLENGTH;
                  po=dt.POREQ;
                  ro=dt.ROREQ;
            }
            else{
              stockcount=8;
              po="N";
              ro="N";
            }
            let siteno=this.empid==1?0:this.sitenumber;
            this.odsservice.GetWOPermissionDetails(this.empid,siteno).subscribe(response=>{
              if(response[0].result!="")
              {
                let value=JSON.parse(response[0].result)[0];
                console.log("Permission Response",value);
                let create:any="N"
                if(value.Create.toUpperCase()=="Y")
                {
                  create="Y";
                  this.access_permission="Y";
                  this.events.publish('permission:Y');
                }
                else{
                  this.access_permission="N";
                  this.events.publish('permission:N');
                }
                  
                this.db.UpdateSiteInfo_EMP(this.dealersiteId,data.sitesearchresult.siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount,this.sitenumber,stockcount,po,ro,create).then((data) => {
  
                })
              }
              else{
                  this.access_permission="N";
                   this.events.publish("permission:N");
                   this.db.UpdateSiteInfo_EMP(this.dealersiteId,data.sitesearchresult.siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount,this.sitenumber,stockcount,po,ro,'N').then((data) => {
  
                  })
   

              }
          })
            
          })
         
        }
      })
    })
  }//end for changeSite()

  displayStatusMsg()
  {
    alert("You have no permissions to create work order");
  }

}
