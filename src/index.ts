import 'dotenv/config'
import cors from 'cors'
import express from 'express'

import { supabase } from './supabase'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.get('/', (_, res) => {
    res.send('Flag API')
})

app.get('/continents', async (_, res) => {
    const { data, error } = await supabase.from('continents').select('*')

    if (error !== null) {
        res.status(500).send('Internal server error')
        return
    }

    if (data !== null) {
        res.send(data)
        return
    }

    res.status(500).send('Internal server error')
})

app.get('/flags', async (_, res) => {
    const { data, error } = await supabase.from('flags').select('*')

    if (error !== null) {
        res.status(500).send('Internal server error')
        return
    }

    if (data !== null) {
        res.send(data)
        return
    }

    res.status(500).send('Internal server error')
})

app.get('/flags/:id/url', async (req, res) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
        res.status(400).send('Invalid url')
        return
    }

    const { data: flag, error } = await supabase.from('flags').select().eq('id', id).single()
    if (error !== null) {
        res.status(500).send('Internal server error')
        return
    }

    const name = flag?.svg.name
    if (name === undefined) {
        res.status(404).send('Not found')
        return
    }
    const { data } = supabase.storage.from('flags').getPublicUrl(`${name}.svg`)

    res.send({url: data.publicUrl})
})

app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[server]: Server is running at http://localhost:${port}`)
    }
})

export default app
