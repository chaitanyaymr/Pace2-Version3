import { Component } from '@angular/core';
import { Platform,ToastController,Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {App, IonicApp} from 'ionic-angular';
import {DatabaseProvider } from '../providers/database/database';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
import {FCM} from '@ionic-native/fcm';
import { PaceEnvironment } from '../common/PaceEnvironment';

@Component({
  templateUrl: 'app.html'
})
export class PACE2 {

  rootPage:any = '';
  user:any={Name:"",Password:""}
  pages:Array<{title:string,component:any,name:string}>
  platform_menulist:boolean=false;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
     public db:DatabaseProvider, public app:App,private network:Network,private toast:ToastController,public networkinteface:NetworkInterface,public ionicapp:IonicApp,
    public fcm:FCM,private appconst:PaceEnvironment,private events:Events) {
    platform.ready().then(() => {
 
      if(platform.is('ios'))
       {
          this.platform_menulist=true;
       }
       else
       {
         this.platform_menulist=false;
       }

    /********FCM TOken********************************************** */
      fcm.subscribeToTopic('all');
      fcm.getToken().then((token)=>{
         db.fcmtoken=token;
     })
     fcm.onNotification().subscribe((data)=>{
       if(data.wasTapped)
       {
         console.log("received Notification");
       }
       else
       {
        console.log("received Notification foreground");
       }
     });
     fcm.onTokenRefresh().subscribe((token)=>{
         db.fcmtoken=token;
     })

  /****************************************************** */
    /*******************IPADRESS*********************************** */
      this.networkinteface.getWiFiIPAddress().then((data:any)=>{
        this.db.ipAddress=data.ip;
        this.appconst.ipAddress=data.ip;
      }).catch(err=>{
        this.db.ipAddress="";
        this.appconst.ipAddress="";
        this.networkinteface.getCarrierIPAddress().then((data:any)=>{
          this.db.ipAddress=data.ip;
          this.appconst.ipAddress=data.ip;
       })
      })
        
      this.networkinteface.getCarrierIPAddress().then((data:any)=>{
        this.db.ipAddress=data.ip;
        this.appconst.ipAddress=data.ip;
       }).catch(err=>{
        this.db.ipAddress="";
        this.appconst.ipAddress="";
        this.networkinteface.getWiFiIPAddress().then((data:any)=>{
          this.db.ipAddress=data.ip;
          this.appconst.ipAddress=data.ip;
        })
      })
      /****************************************************** */
       /************************NETWORK CHECK****************************** */
     
      let connct= this.network.onConnect().subscribe((data) => {
         this.displayNetworkUpdate(data.type);
      });
     
     let disconnt= this.network.onDisconnect().subscribe((data) => {
         this.displayNetworkUpdate(data.type);
      });
 /****************************************************** */
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#131821");
      statusBar.styleLightContent();
      splashScreen.hide();
       
     
       /***************BACK BUTTON Handling*************************************** */
       if(platform.is('android'))
       {
        platform.registerBackButtonAction(()=>{
          let screen:any=this.app.getActiveNavs()[0];
             let activeview=screen.getActive();
             let id=screen.getActive().id;
             const activeModal = this.ionicapp._modalPortal.getActive();
            //  if(activeview.name.toLowerCase()=="homepage")
            if(id.toLowerCase()=="home-page")
                {
                  platform.exitApp();
                }
            //  else if(activeview.name.toLowerCase()=="loginpage")
            else if(id.toLowerCase()=="login-page")
                {
                  platform.exitApp();
                }
                
                // else if(activeview.name.toLowerCase()=="modalcmp")
                else if(activeview.name.toLowerCase()=="modalcmp")
                {
                  activeModal.dismiss();
                }
                else
                {
                 this.app.getActiveNav().setRoot('home-page'); 
                }
         })
       }
        /****************************************************** */
 this.db.getDatabaseState().subscribe((result)=>{
  console.log("Database State",result);
  if(result)
  {
    this.db.getAllUsers().then((data:any)=>{
      this.user=data;
      console.log("User data",this.user)
     if(this.user.length>0)
      {
       
      if(this.user[0].Rem=="Y")
       {
         this.app.getActiveNav().setRoot("home-page")
       }
      }
     else
     this.rootPage='login-page';
      
   })
  }
 })
    
  });

    
      this.pages=[
        {title:"Home",component:"home-page",name:"Home" },
        {title:"New Car Delivery Slip", component:"page-newcarsold",name:"Newcarsold"},
        {title:"Pre-Owned Delivery Slip",component:"page-preownedcar", name:"Preownedcar"},
        {title:"Vehicle Status", component:"workorder-status",name:"Status"},
        {title:"Search Vehicle", component:"vin-searchpage",name:"Scanner"},
        {title:"Create Work Order",component:"page-createworkorder", name:"CreateWorkorder"},
     ];
   
  events.subscribe("permission:N",()=>{
    this.pages=[
      {title:"Home",component:"home-page",name:"Home" },
      {title:"New Car Delivery Slip", component:"page-newcarsold",name:"Newcarsold"},
      {title:"Pre-Owned Delivery Slip",component:"page-preownedcar", name:"Preownedcar"},
      {title:"Vehicle Status", component:"workorder-status",name:"Status"},
      {title:"Search Vehicle", component:"vin-searchpage",name:"Scanner"}
     
   ];
  });
  events.subscribe("permission:Y",()=>{
    this.pages=[
      {title:"Home",component:"home-page",name:"Home" },
      {title:"New Car Delivery Slip", component:"page-newcarsold",name:"Newcarsold"},
      {title:"Pre-Owned Delivery Slip",component:"page-preownedcar", name:"Preownedcar"},
      {title:"Vehicle Status", component:"workorder-status",name:"Status"},
      {title:"Search Vehicle", component:"vin-searchpage",name:"Scanner"},
      {title:"Create Work Order",component:"page-createworkorder", name:"CreateWorkorder"},
   ];
  });
  



  }
   
  Logout()
  {
    
      this.db.deleteUser().then((data)=>
     {
        this.user.Name="";
        this.app.getActiveNav().setRoot("login-page");
     }
    
    ),(error)=>{console.log("Error while truncating",error)}
  }

  openPage(page) {
    let name= localStorage.getItem("Username")
  if(page.component=="home-page")
   this.app.getActiveNav().setRoot("home-page",{Name:name})
 else
    this.app.getActiveNav().push(page.component);
  }
  
  displayNetworkUpdate(connectionState: string){
    let networkType = (this.network.type=="none")?"":"via "+this.network.type;
    if(this.network.type.toLowerCase()=="wifi")
    {
      this.networkinteface.getWiFiIPAddress().then((data:any)=>{
         this.db.ipAddress=data.ip;
      }).catch(err=>{
        console.log("Error at wifi ip",err)
        this.db.ipAddress="";
      })
    }
    else{
      this.networkinteface.getCarrierIPAddress().then((data:any)=>{
         this.db.ipAddress=data.ip;
      }).catch(err=>{
        console.log("Error at carrier ip",err)
        this.db.ipAddress="";
      })
    }
    this.toast.create({
      message: `You are now ${connectionState} ${networkType}`,
      duration: 3000
    }).present();
  }
 
 

}

