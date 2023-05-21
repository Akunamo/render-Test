const fs = require('fs')
const express = require('express');

const app = express()

app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

// app.get('/api/v1/tours/:id/:x/:y?', (req,res) => {
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;              // Implicit conversion use

    if(id > tours.length) {
        return res.status(404).json({
            status:'fail',
            message: 'Invalid id'
        })
    }
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body) // did not wnated to mutate original (req.body.id = newId) dont use
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})


const PORT = process.env.PORT || 4200;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
})
