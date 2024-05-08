export async function randomJawa() {
    let data = {
        status: false,
        data: []
    }
    try {
        const url = await fetch('https://senaraiistilahjawa.kemdikbud.go.id/api/v1/public/random/50');
        const result = await url.json();
        data.status = true;
        data.data = result;
        return data
    } catch (error) {
        return data
    }
}

export async function searchJawa(istilah) {
    let data = {
        status: false,
        data: []
    }
    try {
        const url = await fetch(`https://senaraiistilahjawa.kemdikbud.go.id/api/v1/public/search/terms/${istilah}`);
        const result = await url.json();
        data.status = true;
        data.data = result;
        return data
    } catch (error) {
        return data
    }
}

export async function detailJawa(istilah) {
    let data: any = {
        status: false,
        data: {}
    }
    try {
        const url = await fetch(`https://senaraiistilahjawa.kemdikbud.go.id/api/v1/public/detail/${istilah}`);
        const result = await url.json();
        data.status = true;
        data.data = result;
        return data
    } catch (error) {
        return data
    }
}
export async function tipeKata() {
    let data = {
        status: false,
        data: []
    }
    try {
        const url = await fetch(`https://senaraiistilahjawa.kemdikbud.go.id/api/v1/public/types/`);
        const result = await url.json();
        data.status = true;
        data.data = result.data;
        return data
    } catch (error) {
        return data
    }
}

