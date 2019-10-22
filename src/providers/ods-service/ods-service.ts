import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { PaceEnvironment } from '../../common/PaceEnvironment';

@Injectable()
export class OdsServiceProvider {

  http: any;
  constructor(http: Http, public appconst: PaceEnvironment) {
    this.http = http;
  }

  // GetEmployeeInfo(employeeid: any) {
  //   let options = new RequestOptions({ headers: this.appconst.headers })
  //   return this.http.get(this.appconst.ApiUrl + "EmployeeInfo/" + employeeid)
  //     .map((res: Response) => res.json())
  // }


  GetEmployeeInfo(employeeid: any) {
    let options = new RequestOptions({ headers: this.appconst.headers })
    return this.http.get(this.appconst.ApiUrl + "CMSEmployeeInformation/" + employeeid)
      .map((res: Response) => res.json())
  }




  // GetEmployeeInformation(employeeid: any) {
  //   return this.http.get(this.appconst.ApiUrl + "EmployeeInformation/" + employeeid)
  //     .map((res: Response) => res.json())
  // }

  GetEmployeeInformation(employeeid: any) {
    let body = { "strSearchString": "<Employees><ID>"+employeeid+"</ID></Employees>" };
    return this.http.post(this.appconst.ApiUrl + "CMSEmployeeInfo", body)
      .map((res: Response) => res.json())
  }


  // GetEmployeeSiteInfo(empid) {
  //   let options = new RequestOptions({ headers: this.appconst.headers })
  //   return this.http.get(this.appconst.ApiUrl + "/EmployeeSiteInfo/" + empid, options)
  //     .map((res: Response) => res)
  // }
  GetEmployeeSiteInfo(empid) {
    let options = new RequestOptions({ headers: this.appconst.headers })
   if(empid==1)
   return this.http.get(this.appconst.ApiUrl + "SitesInformationXML/", options)
   .map((res: Response) => res)
   else
   return this.http.get(this.appconst.ApiUrl + "EmployeeSitesInformationXML/" + empid, options)
   .map((res: Response) => res)
  }
  
  GetStockPORODetails(siteid)
  {
    let options = new RequestOptions({ headers: this.appconst.headers })
  
   return this.http.get(this.appconst.ApiUrl + "SiteInfoforCreateWO/" + siteid, options)
   .map((res: Response) => res.json())
  }


  EmployeeTraditionalCheckIn(userid, pcode,deviceid) {
    const header = new Headers;
    header.append('strUserId', userid);
    header.append('strPasscode', pcode);
    let body = { 'strSearchString': '<deviceInfo> <deviceType>m</deviceType> <loginType>2</loginType> <deviceId>'+deviceid+'</deviceId> <ipAddress>'+this.appconst.ipAddress+'</ipAddress> </deviceInfo>' };
    const options = new RequestOptions({ headers: header });
    return this.http.post(this.appconst.ApiUrl + "UserLogin", body, options)
      .map((res: Response) => res.json())
  }


  //  EmployeeTraditionalCheckIn(userid,pcode){
  //   let options=new RequestOptions({headers:this.appconst.headers})
  //   return this.http.get(this.appconst.ApiUrl+"EmployeeTraditionalLogin/"+userid+"/"+pcode+"/mob/GN/0/login.aspx/10.10.10.10")
  //   .map((res:Response)=>res.json())
  //  }

  GetWorkOrderStatus(SrchStr) {
    let body = { "strSearchString": SrchStr };
    let options = new RequestOptions({ headers: this.appconst.headers });
    return this.http.post(this.appconst.ApiUrl + '/woqueue', body, options)
      .map((res: Response) => res);
  }

  // GetRequestedByUsers(siteid, role, target) {
  //   let options = new RequestOptions({ headers: this.appconst.headers });
  //   // return this.http.get(this.appconst.ApiUrl+"/RequestedByEmployees/"+siteid+"/SA/"+target,options)
  //   // .map((res:Response)=>res)
  //   return this.http.get(this.appconst.ApiUrl + "/SalesPersonInfo/" + siteid, options)
  //     .map((res: Response) => res);
  // }

  GetRequestedByUsers(siteid, role, target) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body={
      "strSearchString":"<info><role>SP</role><siteid>"+siteid+"</siteid></info>"
    }
    return this.http.post(this.appconst.ApiUrl + "/RetriveEmployeebySiteRole/",body, options)
      .map((res: Response) => res);
  }
  CreateWorkOrder(woxml,notesxml,partsxml,servicexml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woxml,
      "wonotes":notesxml,
      "woparts":partsxml,
      "woservices":servicexml
    }
  return this.http.post(this.appconst.ApiUrl+"CreateWorkOrder",body,options)
   .map((res:Response)=>res.json());
}

CheckWOExceptions(woxml,servicexml) {
  let options = new RequestOptions({ headers: this.appconst.headers });
  let body = {
    "WOInfo": woxml,
    "WOService":servicexml
   
  }
return this.http.post(this.appconst.ApiUrl+"CheckWOExceptions",body,options)
 .map((res:Response)=>res.json());
}
GetWOPermissionDetails(empid,siteid)
{
  let options = new RequestOptions({ headers: this.appconst.headers });
  let body = {
   "strSearchString":`<Info><empid>${empid}</empid><siteid>${siteid}</siteid></Info>`
   }
return this.http.post(this.appconst.ApiUrl+"GetWOPermissionDetails",body,options)
 .map((res:Response)=>res.json());
}


   GetSiteServicesInfo(siteid,empid)
   {
     let str="<Info><s_id>"+siteid+"</s_id>";
     str+="<packagename></packagename>";
     str+="<sdid>0</sdid>";
     str+="<status>A</status>";
     str+="<pagenumber>1</pagenumber>";
     str+="<pagesize>25</pagesize></Info>"
     let body={
       "strSearchString":str
     }
    let options=new RequestOptions({headers:this.appconst.headers});
    return this.http.post(this.appconst.ApiUrl+"GetPackages",body,options)
    .map((res:Response)=>res)
   }

   SearchInfo(srchxml)
   {
     let options=new RequestOptions({headers:this.appconst.headers});
     let body={"WoSearchString":srchxml};
     return this.http.post(this.appconst.ApiUrl+"/WOSearchInfobyServiceItem",body,options)
     .map((res:Response)=>res);
   }
   vehicleSearch(srchxml)
   {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/RetriveWoVINSearch",body,options)
    .map((res:Response)=>res);
   }

   SubmitSupportReq(EmpId,EName,Email,Phone,Desc)
    {
  let options=new RequestOptions({headers:this.appconst.headers});
  let body={
     "strEmpId":EmpId,
     "strEName":EName,
     "strEmail":Email,
     "strPhone":Phone,
     "strDesc":Desc
    }
    return this.http.post(this.appconst.ApiUrl + "/CUDSupportInfo", body, options)
      .map((res: Response) => res);
  }

  // CreateWorkOrder(obj: any) {
  //   let options = new RequestOptions({ headers: this.appconst.headers });
  //   let body = obj;
  //   return this.http.post(this.appconst.ApiUrl + "/AddWorkOrderInfoV3", body, options)
  //     .map((res: Response) => res);
  // }

  SendFCMToken(empid: any, fcmtoken: any, ip: any) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "EmpId": empid,
      "DeviceToken": fcmtoken,
      "DeviceType": "M",
      "Devicelog": "",
      "IpAddress": ip,
      "AppPckgVersion": "com.pllc.pace2ods"
    }
    return this.http.post(this.appconst.ApiUrl + "/EmployeeDevicePackageLogInfo", options)
      .map((res: Response) => res);
  }


}
