interface Server {
    host: string,
    port: number
}

const server: Server = {
    host: "0.0.0.0",
    port: 3001
}

export const secretKey: string = "Apabjir";
export default server;
