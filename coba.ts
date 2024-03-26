import prisma from "./app/database/prisma";
async function apalah() {

    // const apiKey = prisma.apiKey.findFirst({
    //     where: {
    //         api: "MFAKORuZR5Ida/CasL8V6W2kTVXsFI990/jk0KszoqM="
    //     },
    //     include: {
    //         User_use: true
    //     }
    // });
    // return apiKey
    const text = "083109895990";
    const mentions = [text.matchAll(/@(\d{0,16})/g)].map((v) => v[1] + "@s.whatsapp.net");
    return mentions
}
apalah().then((r) => {
    console.log(r)
}).catch((e) => {
    console.log(e)
})