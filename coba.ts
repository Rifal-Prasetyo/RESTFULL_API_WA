import prisma from "./app/database/prisma";
async function apalah() {
    let data = [];
    const result = await prisma.user.findFirst({
        where: {
            api: {
                api: ""
            }
        },
        select: {
            name: true,
            organization: true,
            api: true,
            pushes: true
        },

    });
    // result.forEach(user => {
    //     data = data.concat(user.pushes)
    // });
    result.pushes.forEach(push => {
        data = data.concat(push);
    })
    return {
        result: result,
        data: data
    }
}
apalah().then((r) => {
    console.log(r)
}).catch((e) => {
    console.log(e)
})