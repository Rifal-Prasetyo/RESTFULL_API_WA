import fs from 'fs';
import ytdl, { chooseFormatOptions, downloadOptions, Filter } from 'ytdl-core';
import { getSession } from '../../../whatsapp/whatsapp';
import { delay } from '@whiskeysockets/baileys';
import ffmpeg from 'fluent-ffmpeg';

interface DataMessage {
    name: string,
    type: string,
    number: string,
    message: string,
    group?: string
}

// configuration ytDOwnloader

// max duration video can be downloaded
let maxSecondDownload = 360 // 5 menute


export async function yt_core_dl(data: DataMessage, linkYT: string, type: Filter) {
    const session = getSession('admin');
    await session.sendPresenceUpdate("composing", data.number);
    await delay(2000);
    await session.sendMessage(data.number, { text: 'Mengambil informasi Youtube' });
    // get basic metadata video
    const basicInfoYt = await ytdl.getInfo(linkYT);
    let basicDataYt = {
        title: basicInfoYt.videoDetails.title,
        author: basicInfoYt.videoDetails.author.name,
        time: basicInfoYt.videoDetails.lengthSeconds,
        thumbnail: basicInfoYt.videoDetails.thumbnails
    };
    let msg1 = `*INFORMASI VIDEO YOUTUBE*\n\n`;
    msg1 += `============\n`;
    msg1 += `*${basicDataYt.title}*\n`;
    msg1 += `📹: _${basicDataYt.author}_`;
    await session.sendMessage(data.number, {
        image: {
            url: basicDataYt.thumbnail[1].url
        },
        caption: msg1
    });
    await delay(1000);
    // skip if duration exceeds
    if (parseInt(basicDataYt.time) > maxSecondDownload) {
        await session.sendPresenceUpdate("composing", data.number);
        await session.sendMessage(data.number, { text: 'Durasi Video terlalu panjang.... maks ' + maxSecondDownload + ' Detik' });
    } else {
        await session.sendPresenceUpdate("composing", data.number);
        await session.sendMessage(data.number, { text: 'Mengunduh Audio/Video Youtube. Mohon tunggu' });
        try {
            const downloadYt = ytdl(linkYT, { filter: type });
            const titleForDownloadedYT = changeFormatTitleYT(basicDataYt.title);
            let path = ``;
            if (type == 'audioandvideo') {
                path = 'app/storage/youtube/' + titleForDownloadedYT + ".mp4"
            } else if (type == 'audioonly') {
                path = 'app/storage/youtube/' + titleForDownloadedYT + ".mp3"
            }
            if (type == 'audioandvideo') {
                const downloadingYT = downloadYt.pipe(fs.createWriteStream(path));
                downloadingYT.on('finish', async () => {
                    await session.sendMessage(data.number, {
                        video: fs.readFileSync(path),
                        caption: basicDataYt.title
                    })
                });
            } else if (type == 'audioonly') {
                ffmpeg(downloadYt).audioCodec('libmp3lame')
                    .save(path)
                    .on('end', async () => {
                        await session.sendMessage(data.number, {
                            audio: fs.readFileSync(path),
                            mimetype: 'audio/mp4'
                        })
                    });

            }
            fs.unlink(path, (err) => {
                if (err) {
                    // Handle specific error if any
                    if (err.code === 'ENOENT') {
                        console.error('File does not exist.');
                    } else {
                        console.log(err);
                    }
                }
            });
        } catch (error) {
            await session.sendMessage(data.number, { text: 'Masukkan URL kamu dengan benar' });
        }
    }


    function changeFormatTitleYT(title: string) {
        // // Mengubah semua spasi menjadi tanda "_"
        // let transformedString = title.replace(/ /g, "_");

        // // Membuat angka acak antara 0 dan 1000
        let randomInteger = Math.floor(Math.random() * 1000);

        // // Menggabungkan string yang sudah diubah dengan angka acak
        // let result = transformedString + randomInteger;

        // return result;
        return randomInteger;
    }

}
