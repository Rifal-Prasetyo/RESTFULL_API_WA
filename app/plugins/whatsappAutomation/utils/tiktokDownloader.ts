import * as TiktokDownloader from "@tobyg74/tiktok-api-dl"
let data = {
    'status': '',
    'type': '',
    'description': '',
    'video': '',
    'message': ''
}
export async function linkTT(link_tt: string) {
    try {
        const tiktok = await TiktokDownloader.Downloader(link_tt, {
            version: "v3" //  version: "v1" | "v2" | "v3"
        });
        const response = tiktok;
        data = {
            'status': response.status,
            'type': response.result.type,
            'description': response.result.desc,
            'video': response.result.video2,
            'message': ''
        };
        if (data.type == "video" && data.status == "success") {
            return data;
        }
        if (data.type == "image" && data.status == 'success') {
            data = {
                status: 'failed',
                message: 'Tidak bisa download gambar!!!',
                type: '',
                description: '',
                video: ''
            }
            return data
        }
        if (data.status == "error") {
            return await alternateV2(link_tt);
        }
    } catch (error) {
        return await alternateV2(link_tt);
    }
}

async function alternateV2(link_tt: string) {
    try {
        const tiktok = await TiktokDownloader.Downloader(link_tt, {
            version: "v2" //  version: "v1" | "v2" | "v3"
        });
        const response = tiktok;
        data = {
            'status': response.status,
            'type': response.result.type,
            'description': response.result.desc,
            'video': response.result.video,
            'message': ''
        };
        if (data.type == "video" && data.status == "success") {
            return data;
        }
        if (data.type == "image" && data.status == 'success') {
            data = {
                status: 'failed',
                message: 'Tidak bisa download gambar!!!',
                type: '',
                description: '',
                video: ''
            }
            return data
        }
        if (data.status == "error") {
            data = {
                status: 'failed',
                message: 'Gagal Mengunduh...',
                type: '',
                description: '',
                video: ''
            }
            return data
        }
    } catch (error) {
        data = {
            status: 'failed',
            message: 'Tidak bisa download gambar!!!',
            type: '',
            description: '',
            video: ''
        }
        return data
    }
}