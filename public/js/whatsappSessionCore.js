const nameSession = document.getElementById('nameSession');
const numberSession = document.getElementById('numberSession');
const delay1 = 10000;
async function getwhatsappSession() {
    const data = await fetch('/api/info/detailwhatsapp');
    const json = await data.json();
    const number = json.number.split(':')[0];
    nameSession.innerHTML = json.name ? json.name : "NULL";
    numberSession.innerHTML = number ? number : "NULL";
}
// change information every 10 second
setInterval(() => {
    getwhatsappSession();
}, delay1)



// BUTTON ACTION
async function actionButton(action) {
    await fetch('/api/info/actionbuttonwhatsapp', {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ action: action }),
    });
}