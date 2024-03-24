import hashing from "../../services/hashPassword";
import log from "../../services/pretty-logger";
import prisma from "../prisma";

const d = new Date();

async function seeder() {
    await prisma.$transaction([
        prisma.user.createMany({
            data: [
                {
                    name: "Muhammad Rifal Prasetyo",
                    role: "owner",
                    noWa: "6283109895990",
                    password: hashing("sukidakara"),
                    time: d
                },
                {
                    name: "Nisaazzahra",
                    noWa: "6283109895990",
                    password: hashing("sukidakara"),
                    time: d
                }
            ]
        }),
        prisma.apiKey.createMany({
            data: [
                {

                    user_id: 1,
                    totalUse: 1
                },
                {

                    user_id: 2,
                    totalUse: 1
                }
            ]
        })
    ])
}
seeder()
    .then(async () => {
        log.info("Berhasil Seeding Data")
        await prisma.$disconnect()
    }).catch(async (e) => {
        log.error("gagal Seeding Data")
        await prisma.$disconnect()
        process.exit(1)
    });

