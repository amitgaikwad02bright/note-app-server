// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const http = require("http");
const server = http.createServer((req, res) => {
  try {
    enableCors(res);
    console.log("req received");
    const methodType = req.method.toUpperCase();
    const url = req.url;
    console.log("methodType", methodType);
    switch (methodType) {
      case "GET":
        getMethodHandler(url, req, res);
        break;
      case "POST":
        postMethodHandler(url, req, res);
        break;
      case "PUT":
        putMethodHandler(url, req, res);
        break;
      case "DELETE":
        deleteMethodHandler(url, req, res);
        break;
      case "OPTIONS":
        res.writeHead(204);
        res.end();
        break;
      default:
        res.writeHead(400);
        res.end("not found error");
    }
  } catch (ex) {
    console.error(ex);
    res.writeHead(500);
    res.end("server error");
  }
});

const noteList = [
  {
    id: 1,
    text: "thia is note"
  }
];

const getMethodHandler = (url, req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify(noteList));
};

const postMethodHandler = (url, req, res) => {
  res.writeHead(200);
  console.log("post called");
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
    console.log("received data", chunk);
  });
  req.on("end", () => {
    try {
      const noteReq = JSON.parse(data);
      console.log("noteReq ", noteReq);
      const maxId = Math.max(...noteList.map((n) => n.id));
      const newNote = { id: maxId + 1, text: noteReq.text };
      noteList.push(newNote);
      console.log("pushing new note");
      res.write(JSON.stringify(newNote));
      res.end();
    } catch (ex) {
      console.error(ex);
      res.writeHead(500);
      res.end("server error");
    }
  });
};

const putMethodHandler = (url, req, res) => {
  res.writeHead(200);
  let data = "";
  console.log("url", url);
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    handleUpdateNote(url, data, res);
  });
};

function handleUpdateNote(url, jsonBody, res) {
  try {
    const path = url;

    const parts = path.split("/");
    const idParam = Number(parts[parts.length - 1]);
    console.log("parts", parts);
    console.log("idParam", idParam);
    console.log("jsonBody", jsonBody);
    const noteReq = JSON.parse(jsonBody);
    const note = noteList.find((n) => n.id === idParam);
    note.text = noteReq.text;
    res.write(JSON.stringify(note));
    res.end();
  } catch (ex) {
    console.error("handling expection", ex);
    res.writeHead(500);
    res.end();
    console.log("server error occurred");
  }
}

const deleteMethodHandler = (url, req, res) => {
  res.writeHead(200);
  const path = url;

  const parts = path.split("/");
  const idParam = Number(parts[parts.length - 1]);
  const noteIndex = noteList.findIndex((n) => n.id === idParam);
  noteList.splice(noteIndex, 1);
  res.end();
};

function enableCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Max-Age", 2592000);
  res.setHeader("Access-Control-Allow-Headers", "*");
}
server.listen(8080);

console.log("server startef");
