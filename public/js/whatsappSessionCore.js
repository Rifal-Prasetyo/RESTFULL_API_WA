const nameSession = document.getElementById('nameSession');
const numberSession = document.getElementById('numberSession');
const connectionSession = document.getElementById('statusSession');
const wrapperSesion = document.getElementById('wrapperSession');
const qrCodeDisplay = document.getElementById('qrcode');
const btn1 = document.getElementById('button1');
const btn2 = document.getElementById('button2');
const btn3 = document.getElementById('button3');

// const delay1 = 1000;
const eventSource = new EventSource("/api/info/detailwhatsapp");
eventSource.onmessage = async function (event) {
    const json = JSON.parse(event.data);
    const number = json.number ? json.number.split(':')[0] : "";
    nameSession.innerHTML = json.name ? json.name : "NULL";
    numberSession.innerHTML = number ? number : "NULL";
    connectionSession.innerHTML = json.connection ? json.connection : "NULL";
    let insertData = ``;
    json.log.forEach(log => {
        insertData += `<pre>[${log.type} | ${log.date}] ${log.log}</pre>`;
    });
    if (json.connection == "CONNECTING") {
        btn1.classList.add('disabled_button');
        btn1.disabled = true;
        btn2.classList.add('disabled_button');
        btn2.disabled = true;
        btn3.classList.add('disabled_button');
        btn3.disabled = true;
    } else if (json.connection == "OPEN") {
        btn1.classList.add('disabled_button');
        btn1.disabled = true;
        btn2.classList.remove('disabled_button');
        btn2.disabled = false;
        btn3.classList.remove('disabled_button');
        btn3.disabled = false;
    } else if (json.connection == "BADSESSION") {
        btn1.classList.remove('disabled_button');
        btn1.disabled = false;
        btn2.classList.add('disabled_button');
        btn2.disabled = true;
        btn3.classList.add('disabled_button');
        btn3.disabled = true;
    }

    wrapperSesion.innerHTML = insertData;
}

function refreshImage() {
    var img = qrCodeDisplay;
    img.src = img.src.split('?')[0] + '?' + new Date().getTime();
}
setInterval(refreshImage, 2000);

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