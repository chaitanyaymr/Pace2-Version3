import { SitesearchPage } from './../sitesearch/sitesearch';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastOptions, ToastController, Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from "../../providers/ods-service/ods-service";
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { Device } from '@ionic-native/Device';
import { timestamp } from 'rxjs/operator/timestamp';

@IonicPage(
  { name: "page-createworkorder" }
)
@Component({
  selector: 'page-create-workorder',
  templateUrl: 'create-workorder.html',
})
export class CreateWorkorderPage {

  empid: any = "";
  empsiteid: any = "";
  emproleid: any = "";
  empdeptid: string = "";
  dlrname: string = "";
  entry: string = "";
  vin: string = "";
  stock: string = "";
  ro: string = "";
  po: string = "";
  changev: string = "";
  changevehicle_obj: any = {};
  services_select: any = [];
  totalservices: any = [];
  totaldepartments: any = [];
  totalpackages: any = [];
  date: string;
  time: string = "";
  time2: string = "";
  changedue: string = "";
  note: string = "";
  requestBy: any = [];
  requestddl: string = "";
  tostoptions: ToastOptions;
  datepicker_mindate: any;
  intialserve: any = "0";
  isScan: string = "N";
  po_required: any = 1;
  ro_required:any=1;
  stock_length: any = 0;
  platform_tabclass: boolean = false;
  siteNumber: any = "";
  change_package: any = "";
  departments_select: any = [];
  emplogtype:any="";
  stockcount_db:any="";
  po_db:any="";
  ro_db:any="";
  /************************BarCode Data*************************************************** */
  options: BarcodeScannerOptions;
  scannedData: any = {};
  /*********************************************************************************************** */
  constructor(public navCtrl: NavController, public alertcontroller: AlertController, public scanner: BarcodeScanner,
    private dt: DatePicker, private db: DatabaseProvider, private odsservice: OdsServiceProvider, public appconstants: PaceEnvironment, private tostcntrl: ToastController, public platform: Platform
    , public device: Device) {
    if (platform.is('ios')) {
      this.platform_tabclass = true;
    }
    else {
      this.platform_tabclass = false;
    }
    this.datepicker_mindate = platform.is('ios') == true ? new Date() : new Date().valueOf();
    this.db.getAllUsers().then(emdata => {
      console.log("db data CW",emdata[0]);
      this.empid = emdata[0].EmpId;
      this.empsiteid = emdata[0].SiteID;
      this.empdeptid = emdata[0].DeaprtmentId;
      this.siteNumber = emdata[0].SiteNumber;
      this.emplogtype=emdata[0].LogType;
      this.stockcount_db=emdata[0].StockCount;
      this.po_db=emdata[0].PO;
      this.ro_db=emdata[0].RO;
      if (emdata[0].SiteID != "0" && emdata[0].SiteID != "") {
        this.emproleid = emdata[0].RoleID;
        this.dlrname = emdata[0].SiteTitle;
        this.refreshdata("0");
      this.po_required = (this.po_db.toUpperCase() == 'Y') ? 1 : 0;
      this.ro_required = (this.ro_db.toUpperCase() == 'Y') ? 1 : 0;
      this.stock_length = (this.stockcount_db != 0) ? this.stockcount_db : 10;
      }
      else {
        this.tostoptions = {
          message: "Please Select Site!",
          duration: 3000
        }
        this.tostcntrl.create(this.tostoptions).present();
      }
    });


  }//end for constructor


  refreshdata(flag) {
    this.intialserve = "0";
    this.entry = "single";
    this.vin = "";
    this.stock = "";
    this.ro = "";
    this.po = "";
    this.changev = "";
    this.changevehicle_obj = {};
    this.changedue = "";
    this.note = "";
    this.po_required = 1;
    this.stock_length = 0;
    this.isScan = "N";
    this.setDateAndTime(0, 0);
    this.getSelectedServices(this.siteNumber, this.empid);
    this.requestedByUsers(this.empsiteid, this.emproleid, "M");
  }
  setDateAndTime(hours, minutes) {
    var d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(d.getMinutes() + minutes);
    var mon = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
    var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    this.date = (mon + "/" + day + "/" + d.getFullYear()).toString();
    var apm = d.getHours() >= 12 ? "PM" : "AM";
    let hr: any = d.getHours() % 12;
    hr = hr ? hr : 12;
    hr = hr < 10 ? '0' + hr : hr;
    let min: any = d.getMinutes();
    min = min < 10 ? '0' + d.getMinutes() : d.getMinutes();
    this.time = hr + ":" + min + " " + apm;
  }
  setThisTime() {
    var hrs: number = 0;
    var mins: number = 0;
    this.services_select.forEach(element => {
      if (element.selected == true) {
        let hr = parseInt(element.time.split(":")[0]);
        let min = parseInt(element.time.split(":")[1]);
        hrs = hrs + hr;
        mins = mins + min;
      }
    });

    this.setDateAndTime(hrs, mins);
  }

  showDatePicker() {

    this.dt.show({
      date: new Date(this.date),
      mode: 'date',
      minDate: this.datepicker_mindate,
      androidTheme: this.dt.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then((data) => {
      var mon = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1)
      var day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate()
      this.date = (mon + "/" + day + "/" + data.getFullYear()).toString();
    }, (error) => console.log("Date Error", error))
  }

  showTimePicker() {
    var dts: any = this.date.split("/");
    var tt_hr: any = this.time.split(":")[0];
    var tt_min: any = this.time.split(":")[1].substring(0, 2);
    var tt_apm: any = this.time.split(":")[1].substring(2);
    if (tt_apm.indexOf("P") >= 0) {
      if (tt_hr != 12) {
        tt_hr = parseInt(tt_hr) + 12;
      }
    }
    else if (tt_apm.indexOf("A") >= 0) {
      if (tt_hr == 12) {
        tt_hr = parseInt(tt_hr) + 12;
      }
    }

    var mon: any = parseInt(dts[0]) - 1;

    this.dt.show({
      date: new Date(dts[2], mon, dts[0], tt_hr, tt_min),
      mode: 'time',
      androidTheme: this.dt.ANDROID_THEMES.THEME_HOLO_LIGHT,
      minDate: this.datepicker_mindate

    }).then((data: any) => {

      this.time2 = data.getHours() + ":" + data.getMinutes();
      var apm = data.getHours() >= 12 ? "PM" : "AM";
      let hr: any = data.getHours() % 12;
      hr = hr ? hr : 12;
      hr = hr < 10 ? '0' + hr : hr;
      var min = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
      this.time = hr + ":" + min + " " + apm;
    }, (error) => console.log("Date Error", error))
  }
  FillStock() {
    this.isScan = "N";
    if (this.vin.length >= 17) {
      this.stock = this.vin.substring(this.vin.length - this.stock_length);
    }
    else
      this.stock = "";
  }
  maxVin(event) {

    let newValue = event.value;

    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > 18)
      event.value = event.value.substring(0, 18)
  }
  maxStock(event) {

    let newValue = event.value;
    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > this.stock_length)
      event.value = event.value.substring(0, this.stock_length)
  }

  changeEntry(value) {
    this.entry = value;
  }

  changePackage(value) {
    let s_count = 0, d_count = 0;
    for (let i = 0; i < this.services_select.length; i++) {

      if (this.services_select[i].selected == true) {
        s_count++;
      }
    }
    for (let j = 0; j < this.departments_select.length; j++) {

      if (this.departments_select[j].selected == true) {
        d_count++;
      }
    }
    if (d_count > 0 || s_count > 0) {
      if(value.SSIID!==this.changevehicle_obj.SSIID)
      {
        let alert = this.alertcontroller.create({
          title: 'Selected department and service items will be removed if you change the Package. Do you want to continue?',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.change_package = value.TITLE;
              this.changevehicle_obj=value;
              this.departments_select = [];
              this.services_select = [];
              this.copyDeptAndService_select(value);
              this.changev="";
            //  this.setDateAndTime(0, 0);
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
      
    }
    else 
    {
      this.change_package = value.TITLE;
      this.departments_select=[];
      this.services_select=[];
      this.changev="";
      this.changevehicle_obj=value;
     this.copyDeptAndService_select(value);
      }
  }
  copyDeptAndService_select(value)
  {
    let departments = value.Departments;
    if (departments.length > 0) 
    {
      departments.forEach(element => {
        this.departments_select.push({
          "ACTIVE": element.ACTIVE,
          "DEPARTMENT": element.DEPARTMENT,
          "SDID": element.SDID,
          "SISID": element.SISID,
          "SSIID": element.SSIID,
          "selected": false
        })
      });
    }
    else 
    {
      this.departments_select = [];
    }
    let serviceItems = value.ServiceItems;
    if (serviceItems.length > 0)
     {
      serviceItems.forEach(element => {
        this.services_select.push({
          "ACTIVE": element.ACTIVE,
          "APPROVALREQUIRED": element.APPROVALREQUIRED,
          "ISINDWO": element.ISINDWO,
          "ISINVOICE": element.ISINVOICE,
          "ISSEPINVOICE": element.ISSEPINVOICE,
          "ITEMPRICE": element.ITEMPRICE,
          "MASKNAME": element.MASKNAME,
          "MSSIID": element.MSSIID,
          "PIECEPAY": element.PIECEPAY,
          "RATINGREQUIRED": element.RATINGREQUIRED,
          "ROREQUIRED": element.ROREQUIRED,
          "SERVICEITEMNAME": element.SERVICEITEMNAME,
          "SICODE": element.SICODE,
          "SIID": element.SIID,
          "SSIID": element.SSIID,
          "selected": false
        })
      });
      }
    else
     {
      this.services_select = [];
     }
  }


  selectDepartment(dept) {

    this.changev=dept.DEPARTMENT
    this.departments_select.forEach(element => {

      if (element.DEPARTMENT == dept.DEPARTMENT) {
        if (element.selected == true) {
          element.selected = false;
         
        }
        else {
          element.selected = true;
        }
      }
    });

  }

 selectedService(service) {

    let count = 0;;
    for (var i = 0; i < this.services_select.length; i++) {

      if (this.services_select[i].selected == true) {
        count++;
      }
    }


    for (var k = 0; k < this.services_select.length; k++) {
      if (this.services_select[k].SERVICEITEMNAME == service.SERVICEITEMNAME) {


        if (this.services_select[k].selected == true) {
          this.services_select[k].selected = false;
         // this.setThisTime();
        }
        else {
          if (count >= 5) {
            this.appconstants.ShowAlert("You can select only 5 service items");
          }
          else {
            this.services_select[k].selected = true;
           // this.setThisTime();
          }

        }

      }
    }
  }

  changeDueBy(element) {
    this.changedue = element;

  }
  changeddlrequestedby(ele) {
    this.requestddl = ele.id;

  }



  /*****************************************BarCode Reader Methods*********************************************************************************** */
  scan() {
    this.vin = "";
    this.stock = "";
    this.options = {
      prompt: "Place a barcode inside the viewfinder rectangle to scan it"
    }
    this.scanner.scan(this.options).then((data) => {

      if (data.text.length > 18) {
        this.appconstants.addErrorMessage("VIN characters should not be more than 17");
        this.appconstants.displayErrors();
        this.vin = "";
      }
      else if (data.text.length == 18) {
        this.vin = data.text.substring(1, 18);
        this.stock = this.vin.substring(18 - this.stock_length);
        this.isScan = "Y";
      }
      else {
        this.vin = data.text;
        this.stock = this.vin.substring(17 - this.stock_length);
        this.isScan = "Y";
      }
    }, (err) => {
      console.log("Error:", err);
    })
  }
  /****************************************************************************************************************************************************** */



  getSelectedServices(siteid, empid) {
    this.appconstants.startLoading();
    this.totaldepartments = [];
    this.odsservice.GetSiteServicesInfo(siteid, this.empid).subscribe((data) => {
      let body = JSON.parse(data._body);
      let result = JSON.parse(body[0].result);
      console.log("Sites info", result);
      let totalpackages: any = result[0].PACKAGES;
      if (totalpackages.length > 0) {
        totalpackages.forEach(element => {
          this.totalpackages.push({
            "SSIID": element.SSIID,
            "UNIQUE_PACKAGE_ID": element.UNIQUE_PACKAGE_ID,
            "PACKAGE_TITLE": element.PACKAGE_TITLE,
            "PRICE": element.PRICE,
            "TITLE": element.TITLE,
            "TOTALPAYOUT": element.TOTALPAYOUT,
            "Departments": element.SITESERVICEDEPARTMENTS,
            "ServiceItems": element.SERVICEITEMS
          })
        });
        this.change_package = this.totalpackages[0].TITLE;
        this.changevehicle_obj = this.totalpackages[0];
        let departments = this.totalpackages[0].Departments;
        if (departments.length > 0) {
          departments.forEach(element => {
            this.departments_select.push({
              "ACTIVE": element.ACTIVE,
              "DEPARTMENT": element.DEPARTMENT,
              "SDID": element.SDID,
              "SISID": element.SISID,
              "SSIID": element.SSIID,
              "selected": false
            })
          });
        }
        else {
          this.departments_select = [];
        }
        let serviceItems = this.totalpackages[0].ServiceItems;
        if (serviceItems.length > 0) {
          serviceItems.forEach(element => {
            this.services_select.push({
              "ACTIVE": element.ACTIVE,
              "APPROVALREQUIRED": element.APPROVALREQUIRED,
              "ISINDWO": element.ISINDWO,
              "ISINVOICE": element.ISINVOICE,
              "ISSEPINVOICE": element.ISSEPINVOICE,
              "ITEMPRICE": element.ITEMPRICE,
              "MASKNAME": element.MASKNAME,
              "MSSIID": element.MSSIID,
              "PIECEPAY": element.PIECEPAY,
              "RATINGREQUIRED": element.RATINGREQUIRED,
              "ROREQUIRED": element.ROREQUIRED,
              "SERVICEITEMNAME": element.SERVICEITEMNAME,
              "SICODE": element.SICODE,
              "SIID": element.SIID,
              "SSIID": element.SSIID,
              "selected": false
            })
          });
        }
        else {
          this.services_select = [];
        }
      }
      else {
       this.totalpackages = [];
       this.departments_select = [];
       this.services_select = [];
      }
      //let wopreference: any = data.json()[0].workOrderSitePreferencesInfo[0];
      
     

      this.intialserve = "1";
      this.appconstants.stopLoading();
    })

  }
  filterArray(arr, key) {
    return arr.filter((item) => {
      if (item.siteServiceTypeName.toLowerCase().indexOf(key.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    })
  }
  copyToServicesArray(filteredarray) {
    this.services_select = [];
    for (var i = 0; i < filteredarray.length; i++) {
      this.services_select.push({
        "name": filteredarray[i].siteServiceItemName + " (" + filteredarray[i].siteServiceTimeRequired + ")",
        "time": filteredarray[i].siteServiceTimeRequired,
        "id": filteredarray[i].siteServiceNumber,//filteredarray[i].siteServiceItemId,
        "selected": false
      })
    }
  }


  requestedByUsers(siteid, role, target) {
    this.requestddl = "0";
    this.requestBy = [];
    this.requestBy.push({
      "id": 0,
      "name": "Select"
    });
    this.odsservice.GetRequestedByUsers(siteid, role, target).subscribe((response) => {
      if (response.status == 200) {
        var arr = response.json();
        for (var g = 0; g < arr.length; g++) {
          this.requestBy.push({
            "id": arr[g].employeeId,
            "name": arr[g].employeeName
          })
        }
      }

    })
  }

  ////////////////////////////////////Submit work order///////////////////////////////////////////////////////////////
  submitWorkOrder() {
    if (this.appconstants.CheckNetwork_Connection() == true) {
      let notesxml: string = "";
      let count = 0;
      for (var i = 0; i < this.departments_select.length; i++) {

        if (this.departments_select[i].selected == true) {
          count++;
        }
      }

      if (this.vin == "" && this.stock == "") {
        this.appconstants.addErrorMessage("Enter VIN or STOCK");
      }
      if (this.vin != "") {
        if (this.vin.length < 17) {
          this.appconstants.addErrorMessage("Enter valid Vin Number");
        }
        else if (this.isScan == "N") {
          if (this.vin.length >= 18) {
            this.appconstants.addErrorMessage("VIN characters should not be more than 17");
          }
        }
      }
      if(this.stock!="")
      {
         if(this.stock.length<this.stock_length)
         this.appconstants.addErrorMessage("Enter valid Stock Number");
      }
     
      if(this.po_required==1)
      {
        if(this.po=="")
        this.appconstants.addErrorMessage("Enter PO");
      }
      if(this.ro_required==1)
      {
        if(this.ro=="")
        this.appconstants.addErrorMessage("Enter RO");
      }
      if (count == 0) {
        //this.appconstants.addErrorMessage("Select at least one service item");
        this.appconstants.addErrorMessage("Select Department");
      }

      if (this.appconstants.displayErrors() == true) {
        // let servicexml = '<Info>';
        // let servicenotesxml = '';
        // for (let i = 0; i < this.services_select.length; i++) {

        //   if (this.services_select[i].selected == true) {
        //     servicexml += `<ssiid>`+this.services_select[i].SSIID+`</ssiid> `;
        //   }
        // }
        // servicexml+=`</Info>`;
        // notesxml = (this.note != '') ? `<Info><ssiid>${this.changevehicle_obj.SSIID}</ssiid><notes>${this.note.trim()}</notes> <NType>W</NType></Info>` : ""
       let servicexml=`<Info><ssiid>${this.changevehicle_obj.SSIID}</ssiid></Info>`;
       let notesxml:any="";
           notesxml=(this.note != '') ? `<Info><ssiid>0</ssiid><notes>${this.note.trim()}</notes><NType>W</NType></Info>`:"";
        let duetime = this.changedue;
        if (duetime != "") {
          if (duetime.toLowerCase() == "waiting") {
            duetime = "CW"
          }
          else if (duetime.toLowerCase() == "spot") {
            duetime = "SPOT";
          }
        }
        var d = new Date();
        var day = (d.getDate() >= 10) ? d.getDate() : '0' + d.getDate();
        var mon = (d.getMonth() + 1);
        var month = mon >= 10 ? mon : "0" + mon;
        var year = d.getFullYear();
        var hours = d.getHours();
        var mins = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
        let hr = hours < 10 ? '0' + hours : hours;
        var created_day = month + '/' + day + '/' + year + '  ' + hr + ':' + mins;


        if ((this.isScan == 'Y') && (this.vin.length == 18)) {
          this.vin = this.vin.substring(1, 18);
          this.stock = this.vin.substring(this.vin.length - this.stock_length);
        }
        let wodetails:any={};
        let po=this.po_required == 1 ? this.po.trim().toUpperCase() : this.po.trim().toUpperCase();
        let ro=this.ro_required == 1 ? this.ro.trim().toUpperCase() : this.ro.trim().toUpperCase();
        wodetails=`<Info>
                  <mwoid>0</mwoid> 
                  <vin>`+this.vin.trim().toUpperCase()+`</vin> 
                  <stock>`+this.stock.trim().toUpperCase()+`</stock> 
                  <poid>`+po+`</poid> 
                  <roid>`+ro+`</roid> 
                  <siteid>`+this.empsiteid+`</siteid> 
                  <wodate>`+this.date+`</wodate> 
                  <wotime>`+this.time+`</wotime> 
                  <duetime>`+duetime+`</duetime> 
                  <requestedby>`+this.empid+`</requestedby> 
                  <requestedbylogtype>${this.emplogtype}</requestedbylogtype> 
                  <wotype>I</wotype> 
                  <createtype>M</createtype> 
                  <devicetype>`+this.device.platform+` `+this.device.version+ `</devicetype> 
                  <scantype>`+this.isScan+`</scantype> 
                  <ipaddress>`+this.db.ipAddress+`</ipaddress> 
                  <createddate>`+created_day+`</createddate> 
                  <deptid>`+this.departments_select[0].SDID+`</deptid> 
                  <empid>`+this.empid+`</empid> 
                  <empidlogtype>${this.emplogtype}</empidlogtype> 
                  </Info>`;

      this.odsservice.CheckWOExceptions(wodetails,servicexml).subscribe(result=>{
      
        if(result[0].result!="")
          {
             alert(JSON.parse(result[0].result)[0].Message);
          }
          else{
             this.odsservice.CreateWorkOrder(wodetails,notesxml,"",servicexml).subscribe((data) => {

          var val = data[0].errId;
          if (val== 0) {
            this.appconstants.ShowAlert('Work Order Created Successfully');
            this.appconstants.displayErrors();
            //this.refreshdata("1");
            this.navCtrl.setRoot('home-page');
          }
          else {

          }


        })
          }
      })

       


      }

    }
  }

  ionViewDidEnter() {
    this.appconstants.CheckNetwork_Connection();
  }
}