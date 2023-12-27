const cluster = require("cluster");
const os = require("os");
const http = require("http");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);

    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      cluster.worker.kill();
      res.writeHead(200);
      res.end(`Worker ${process.pid} started`);
    })
    .listen(3000);

  console.log(`Worker ${process.pid} listening on port 3000`);
}
