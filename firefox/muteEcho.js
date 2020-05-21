// Intro goes for 8 seconds
const ECHO_INTRO_TIME = 8
const NOTIFICATION_ID = 'muteEchoNotification'

// Remove scrollbars this extension causes on load
let body = document.getElementsByTagName('body')[0]
body.style.overflow = 'hidden';

var userDisabled = false

console.log("Make Echo Quiet Again! - Saving yours ears from echo 360!")


function pressMuteButton() {
    // Get the mute button element
    const muteButton = document.getElementsByClassName("volume-btn")[0]
    muteButton.click()
}

function isMuted(){
    // Query mute button, see if has muted class
    const volumeButton = document.getElementsByClassName("volume-btn")[0]
    return(volumeButton.classList.contains("muted"))
}

function isNotificationShowing(){
    const notification = document.getElementById(NOTIFICATION_ID)
    if(notification){
        return true
    } else {
        return false
    }
}

function removeNotification(){
    let notify_elem = document.getElementById(NOTIFICATION_ID)
    notify_elem.parentElement.removeChild(notify_elem)
}

function addNotification(){
    // Append a div to let user know we are automatically muting the lecture!
    let main_content = document.getElementsByClassName("classroomNav")[0]

    let html_text = `
            <div style="background-color: #eb4034; color: white; text-align: center; padding: 5px" id="${NOTIFICATION_ID}"> 
                <h1> Echo360 Is being told to be quiet 🤫 by Make Echo Quiet Again! </h1>
            </div>
        `
    main_content.insertAdjacentHTML('afterend', html_text)
}

function updateMuteInfo(){
    notificationShowing = isNotificationShowing();

    if(userDisabled){
        removeNotification()
    } else {
        // Muted and notification not showing
        if(isMuted() && !notificationShowing){
            addNotification()

            // Not muted, and notification showing (remove)
        } else if(!isMuted() && notificationShowing) {
            // Ensure notification is removed
            removeNotification()
        }
    }
}

function setMute(mute){
    if(mute){
        if(!isMuted()){
            pressMuteButton()
        }
    } else {
        if(isMuted()){
            pressMuteButton()
        }
    }
}

function parseLectureTime(timerVal){
    let split = timerVal.split(":")

    let mins = undefined;
    let seconds = undefined;
    let hours = undefined;

    if(split.length == 3){
        mins = parseInt(split[1])
        seconds = parseInt(split[2])
        hours = parseInt(split[0])
    } else if(split.length == 2) {
        mins = parseInt(split[0])
        seconds = parseInt(split[1])
    }

    let combined = 0
    if(seconds) combined += seconds;
    if(mins) combined += mins * 60;
    if(hours) combined += hours * 60 * 60;

    return combined;
}

chrome.runtime.onMessage.addListener(r => {
    console.log("Manually disabled value set to: " + r.disable)
    userDisabled = r.disable
    setMute(false)
});

setInterval(() => {
    const timer = document.getElementsByClassName("currTime");
    const time_split = timer[0].innerHTML.split(' ');

    // Parse times from the lecture timer
    let curr = parseLectureTime(time_split[0])
    let total = parseLectureTime(time_split[2])

    if(!userDisabled){
        if(curr < ECHO_INTRO_TIME){
            setMute(true)
        } else if(total - curr < (ECHO_INTRO_TIME + 3)){
            setMute(true)
        } else {
            setMute(false)
        }
    }

    updateMuteInfo()
}, 1000)
