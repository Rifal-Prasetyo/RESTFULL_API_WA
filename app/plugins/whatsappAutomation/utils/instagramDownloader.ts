import instagramDl from '@sasmeee/igdl';
export default async function instagramDownloader(linkIG: string) {
    const url = linkIG;

    try {
        const dataList = await instagramDl(url);
        const data = {
            'status': "success",
            'link_user': linkIG,
            'link_video': dataList[0].download_link
        };
        return data;
    } catch (error) {
        const data = {
            'status': "failed",
            'link_user': '',
            'link_video': ''
        }
        return data;
    }

}