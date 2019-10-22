import { Injectable } from '@angular/core';
import {Http,RequestOptions,Response} from '@angular/http';
import 'rxjs/Rx';
import {PaceEnvironment}from '../../common/PaceEnvironment';

@Injectable()
export class OdsServiceV1Provider {

  http:any;
  constructor( http: Http,public appconst:PaceEnvironment) {
    this.http=http;
  }

    GetEmployeeInfo(employeeid:any)
     {
      let options=new RequestOptions({headers:this.appconst.headers})
      return this.http.get(this.appconst.ApiUrl_v1+"EmployeeInfo/"+employeeid)
      .map((res:Response)=> res.json())
     }
     GetEmployeeInformation(employeeid:any)
     {
      return this.http.get(this.appconst.ApiUrl_v1+"EmployeeInformation/"+employeeid)
      .map((res:Response)=> res.json())
     }

   GetEmployeeSiteInfo(empid)
   {
     let options=new RequestOptions({headers:this.appconst.headers})
     return this.http.get(this.appconst.ApiUrl_v1+"/EmployeeSiteInfo/"+empid,options)
     .map((res:Response)=>res)
   }
    
   EmployeeTraditionalCheckIn(userid,pcode){
    let options=new RequestOptions({headers:this.appconst.headers})
    return this.http.get(this.appconst.ApiUrl_v1+"EmployeeTraditionalLogin/"+userid+"/"+pcode+"/mob/GN/0/login.aspx/10.10.10.10")
    .map((res:Response)=>res.json())
   }

   GetWorkOrderStatus(SrchStr) {
    let body = {"strSearchString":SrchStr};
    let options = new RequestOptions({ headers: this.appconst.headers });
    return this.http.post(this.appconst.ApiUrl_v1 +'/RetriveWorkOrderStatusView', body, options)
    .map((res: Response) => res);
    }

  GetRequestedByUsers(siteid,role,target)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    // return this.http.get(this.appconst.ApiUrl_v1+"/RequestedByEmployees/"+siteid+"/SA/"+target,options)
    // .map((res:Response)=>res)
    return this.http.get(this.appconst.ApiUrl_v1+"/SalesPersonInfo/"+siteid,options)
    .map((res:Response)=>res);
  }
  CreateSoldDeliverySlip(dataxml,notesxml)
    {
  let options=new RequestOptions({headers:this.appconst.headers});
  let body={
     "strSearchString":dataxml,
     "strNotes":notesxml
    }
  return this.http.post(this.appconst.ApiUrl_v1+"CreateDeliveryWorkOrderAction",body,options)
   .map((res:Response)=>res);
}
   GetSiteServicesInfo(siteid,empid)
   {
    let options=new RequestOptions({headers:this.appconst.headers});
    return this.http.get(this.appconst.ApiUrl_v1+"SiteServicesInfo/"+siteid+"/"+empid)
    .map((res:Response)=>res)
   }

   SearchInfo(srchxml)
   {
     let options=new RequestOptions({headers:this.appconst.headers});
     let body={"WoSearchString":srchxml};
     return this.http.post(this.appconst.ApiUrl_v1+"/WOSearchInfobyServiceItem",body,options)
     .map((res:Response)=>res);
   }
   vehicleSearch(srchxml)
   {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl_v1+"/RetriveWorkOrderSearch",body,options)
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
  return this.http.post(this.appconst.ApiUrl_v1+"/CUDSupportInfo",body,options)
   .map((res:Response)=>res);
}

CreateWorkOrder(obj:any)
{
  let options=new RequestOptions({headers:this.appconst.headers});
  let body=obj;
  return this.http.post(this.appconst.ApiUrl_v1+"/AddWorkOrderInfoV3",body,options)
  .map((res:Response)=>res);
}

SendFCMToken(empid:any,fcmtoken:any,ip:any)
{
  let options=new RequestOptions({headers:this.appconst.headers});
  let body={
    "EmpId":empid,
    "DeviceToken":fcmtoken,
    "DeviceType":"M",
    "Devicelog":"",
    "IpAddress":ip,
    "AppPckgVersion":"com.pllc.pace2ods"
  }
  return this.http.post(this.appconst.ApiUrl_v1+"/EmployeeDevicePackageLogInfo",options)
  .map((res:Response)=>res);
}


}
