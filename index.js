const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: "invalid arguments",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const note = persons.find((note) => note.id === Number(request.params.id));

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  persons = persons.filter((note) => note.id !== Number(request.params.id));
  response.status(204).end();
});

app.get("/info", (request, response) => {
  const number_of_persons = persons.length;
  const current_date = new Date();

  response.send(
    `<p>Phonebook has info for ${number_of_persons} people</p><p>${current_date}</p>`
  );
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});