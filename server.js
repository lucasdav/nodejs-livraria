// import http from "http";
import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("servidor escutando");
});



// abaixo exemplo com http
// const http = require("http")
// const server = http.createServer((req, res) => {
//     res.writeHead(200, {"Content-Type": "text/plain"});
//     res.end(rotas[req.url])
// });

// abaixo exemplo com htttp
// const rotas = {
//     "/": "Curso de Node.js",
//     "/livros": "Entrei na rota livros",
//     "/autores": "Entrei na rota autores"
// };

// abaixo exemplo com http
// server.listen(PORT, () => {
//     console.log("servidor escutando");
// });