import { MessageType } from "../types";

function removeShorts(state:boolean){
        console.log("🔍 Checking for Shorts...");
    let shorts = document.querySelectorAll('ytd-rich-grid-renderer [is-show-less-hidden]')
    console.log(shorts) 
    shorts.forEach(elem => {
        if(state){
            elem.closest("div #content")?.classList.add('hidden')
        } else {
            elem.closest("div #content")?.classList.remove('hidden')
        }
    })      
    document.querySelectorAll('yt-formatted-string').forEach((e) => {
       if(e.innerHTML == "Shorts"){
            if(state){
                e.closest('ytd-guide-entry-renderer')?.classList.add('hidden')
                console.log(`toggled hidden ${e}`)
            } else {    
                e.closest('ytd-guide-entry-renderer')?.classList.remove('hidden')
                console.log(`toggled hidden ${e}`)
            }
           
       }   else {
        console.log('didnt find') 
       }
    })  
    // document.querySelector("ytd-reel-shelf-renderer ")?.remove()

    return {processed:true}
}

function runWhenReady(callback: () => void){
        if(document.readyState === "complete"){
            callback();
        } else {
            window.addEventListener("load",callback)
        }
}


chrome.runtime.onMessage.addListener(
   (message:MessageType, sender,sendResponse) => {
    console.log("📨 Received message:", message);
    switch(message.action){
        case 'toggleOffShorts':
            sendResponse({success:true, data:removeShorts(true)})
            break
        case 'toggleOnShorts':
            sendResponse({success:true, data:removeShorts(false)})
            break
    }
    return true;
})


const observer = new MutationObserver(() => {
    console.log("🔄 Page updated - reapplying Shorts removal...");
    chrome.storage.local.get("disableShorts",(data) =>{
        data.disableShorts ? removeShorts(true) : removeShorts(false)
    })
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

runWhenReady(() => {
    console.log("🚀 Page fully loaded - Checking Shorts state...");
    chrome.storage.local.get("disableShorts", (data) => {
        data.disableShorts ? removeShorts(true) : removeShorts(false)
    })

})
