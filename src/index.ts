import cors from 'cors'
import express from 'express'
import path from 'path'

import flagsInfo from './flags.json'
import exp from 'constants'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use('/flags', express.static(path.join(__dirname, '..', 'assets', 'svgs')))

app.get('/', (_, res) => {
    res.send("Express + TypeScript Server")
})

app.get('/flags/info', (req, res) => {
    const { lang = 'en' } = req.query
    let language: 'en' | 'cs' = 'en'
    switch(lang) {
        case 'en':
        case 'cs':
            language = lang
            break
    }
    const result = flagsInfo.map(flagInfo => ({
        ...flagInfo,
        name: flagInfo.name[language],
        continent: flagInfo.continent[language]
    }))
    res.json(result)
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})

export default app
