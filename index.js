import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
// request logger
app.use((request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
})

app.get('/', (req, res) => {
    res.send("Hello world")
})

const contactPerson = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.route('/api/persons')
    .get((req, res) => {
        res.json(contactPerson)
    })
    .post((req, res) => {
        const { name, number } = req.body

        if (name && number) {
            const isDuplicate = contactPerson.find((element) => element.name === name)
            if (isDuplicate) {
                res.status(400).send('Duplicate name found. Please use another name.')
                return
            }

            const newId = Math.floor(Math.random() * 100)
            const newPerson = {
                id: newId,
                name: name,
                number: number
            }
            contactPerson.push(newPerson)
            res.json(newPerson)
            return
        }

        res.status(400).json({ error: 'name must be unique' })

    })

app.route('/api/persons/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const person = contactPerson.find((element => element.id == id))

        if (person) {
            res.json(person)
            return
        }

        res.status(404).end()
    })
    .delete((req, res) => {
        const id = Number(req.params.id)
        const personIndex = contactPerson.findIndex((element => element.id == id))

        if (personIndex >= 0) {
            contactPerson.splice(personIndex, 1)
            res.status(200).end()
            return
        }

        res.status(404).end()
    })

app.get("/info", (req, res) => {
    res.send(`Phonebook has info for ${contactPerson.length} people.\n ${new Date()}`)
})

// unknown endpoint
app.use((req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
})