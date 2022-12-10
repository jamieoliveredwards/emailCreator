import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sha256 from 'sha256';
import { DataBase } from './database.interface';
dotenv.config();

const fileDirectory = path.join(__dirname, '../', 'files');
const getDataBase: () => DataBase = () => JSON.parse(fs.readFileSync(`${fileDirectory}/database/database.json`, { encoding: 'utf8' }));
const setDataBase: (newDbValue: DataBase) => void = (newDbValue) => {
    fs.writeFileSync(`${fileDirectory}/database/database.json`, JSON.stringify(newDbValue));
};

const port = process.env['PORT'];

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(fileDirectory);
        return cb(null, fileDirectory);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').reverse()[0];
        const fileName = `${sha256(file.originalname + new Date().getUTCMilliseconds())}.${ext}`;
        return cb(null, fileName);
    }
});
const uploader = multer({ storage });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/components', (req, res) => {
    const files = fs.readdirSync(fileDirectory).filter(name => !['.gitkeep', 'database'].includes(name));
    return res.json(files);
});

app.post('/components', uploader.single('image'), (req, res) => {
    return res.send({ result: 'success' });
});

app.get('/components/:fileName', (req, res) => {
    return res.sendFile(`${fileDirectory}/${req.params.fileName}`);
});

app.delete('/components/:fileName', (req, res) => {
    fs.unlinkSync(`${fileDirectory}/${req.params.fileName}`);
    const db = getDataBase();
    const templates = db.templates.map(t => ({
        ...t,
        components: t.components.filter(c => c !== req.params.fileName)
    }));
    setDataBase({
        ...db,
        templates
    });
    return res.json({ result: 'success' });
});

app.get('/templates', (req, res) => {
    const database = getDataBase();
    res.json(database.templates);
});

app.post('/templates', (req, res) => {
    const database = getDataBase();
    const templates = database.templates.filter(t => t.name !== req.body.name);
    const updatedDb: DataBase = {
        ...database,
        templates: [
            req.body,
            ...templates
        ]
    };
    setDataBase(updatedDb);

    return res.json([
        ...database.templates,
        req.body
    ]);
});

app.delete('/templates/:templateName', (req, res) => {
    const database = getDataBase();
    const name = req.params.templateName.replace('_', ' ');
    const templates = database.templates.filter(t => t.name !== name);
    setDataBase({
        ...database,
        templates
    });
    return res.json(templates);
})

app.listen(port, () => console.log(`Listening on port: ${port}`));