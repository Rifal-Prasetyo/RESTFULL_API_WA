const nameSession = document.getElementById('nameSession');
const numberSession = document.getElementById('numberSession');
const connectionSession = document.getElementById('statusSession');
const wrapperSesion = document.getElementById('wrapperSession');
const qrCodeDisplay = document.getElementById('qrcode');
// const delay1 = 1000;
const eventSource = new EventSource("/api/info/detailwhatsapp");
    eventSource.onmessage = async function (event) {
        const json = JSON.parse(event.data);
        const number = json.number ?  json.number.split(':')[0] : "";
        nameSession.innerHTML = json.name ? json.name : "NULL";
        numberSession.innerHTML = number ? number : "NULL";
        connectionSession.innerHTML = json.connection ? json.connection  : "NULL";
        let insertData = ``;
        json.log.forEach(log => {
            insertData += `<pre>[${log.type} | ${log.date}] ${log.log}</pre>`;
        })
        wrapperSesion.innerHTML =  insertData;
        if( json.connection == 'CONNECTING' && json.isNewLogin) {
            qrCodeDisplay.src = "/whatsapp/qr"    
        }

        if(json.connection == "OPEN") {
            qrCodeDisplay.src = "/img/profile.png"  
        }
}



// Fungsi untuk membuat elemen <pre> dan mengisi dengan teks dari objek
// function tambahkanPre(div, teks) {


//     const pre = document.createElement("pre");
//     pre.textContent =  `[${teks.type} | ${teks.date}] ${teks.log}`;
//     div.appendChild(pre);
// }

// change information every 10 second



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