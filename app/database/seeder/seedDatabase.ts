import hashing from "../../services/hashPassword";
import log from "../../services/pretty-logger";
import prisma from "../prisma";

const date = new Date();



async function seeder() {
    await prisma.$transaction([
        prisma.user.createMany({
            data: [
                {

                    name: "Muhammad Rifal Prasetyo",
                    role: "owner",
                    organization: "XI TEFA",
                    address: "Srikandang Bangsri Jepara",
                    note: "ingin menggunakan layanan anda karena sangat bermanfaat pada aplikasi saya",
                    name_project: "Siladu",
                    noWa: "083109895990",
                    isVerified: 1,
                    image: 'profile.png',
                    password: hashing("sukidakara"),
                    time: date
                },
                {

                    name: "Nisaazzahra",
                    noWa: "083104841191",
                    organization: "OTKP",
                    address: "Mlonggo",
                    note: "ingin menggunakan layanan anda karena sangat bermanfaat pada aplikasi saya",
                    name_project: "MPLB",
                    image: 'profile.png',
                    password: hashing("sukidakara"),
                    time: date
                }
            ]
        }),
        prisma.apiKey.createMany({
            data: [
                {

                    user_id: 1,
                    api: "$2a$12$L0o4RlZsxhPiZB5MUY7oFO24qWDcr2Tehj9vDw8FKFT9bivAYgrau",
                    totalUse: 0
                },
                {

                    user_id: 2,
                    api: "$2a$12$L0o4RlZsxhPiZB5MUY7oFO24qWDcr2Tehj9vDw8FKFT9bivAYgrau",
                    totalUse: 0
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
        log.error("gagal Seeding Data");
        console.log(e);
        await prisma.$disconnect()
        process.exit(1)
    });

