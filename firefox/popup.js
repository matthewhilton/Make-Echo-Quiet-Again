function sendDisableMessage(message) {
    disabled = message;
    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {disable: message});
    });
}

document.addEventListener("click", e => {
    if(e.target.id == 'disable'){
        sendDisableMessage(true)
    } else if(e.target.id == 'enable') {
        sendDisableMessage(false)
    }
})
