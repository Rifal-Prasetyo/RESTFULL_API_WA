import prisma from "../database/prisma"

interface DataMessage {
    name: string,
    type: string,
    number: string,
    message: string,
    group?: string
}


export async function sendDatabase(message: DataMessage) {
    if (!message.number.endsWith('@g.us')) {
        try {
            const getUser = await prisma.contact.findFirst({
                where: {
                    number: message.number
                }
            });
            if (getUser) {
                await prisma.contact.update({
                    where: {
                        id: getUser.id,
                        number: getUser.number
                    },
                    data: {
                        nameUser: message.name,
                        useBot: {
                            increment: 1
                        }
                    }
                })
            } else {
                await prisma.contact.create({
                    data: {
                        nameUser: message.name,
                        number: message.number,
                        useBot: 1
                    }

                });
            }
        } catch (error) {
            console.log("dari send Database", error);
        }
    } else {
        return false;
    }

}