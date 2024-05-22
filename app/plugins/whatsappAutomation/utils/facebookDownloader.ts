import getFbVideoInfo from 'fb-downloader-scrapper';
export async function facebookDownloader(linkFB) {
    let data = {
        status: '',
        message: '',
        title: '',
        link_video: ''
    }
    try {
        const fbInfo = await getFbVideoInfo(linkFB);
        data = {
            status: 'success',
            message: 'berhasil fetching',
            title: fbInfo.title,
            link_video: fbInfo.sd
        }
        return data
    } catch (error) {
        data = {
            status: 'fail',
            message: 'gagal',
            title: '',
            link_video: ''
        }
        return data
    }
}