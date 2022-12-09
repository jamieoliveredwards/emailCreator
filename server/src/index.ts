import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sha256 from 'sha256';
dotenv.config();

const fileDirectory = path.join(__dirname, '../', 'files');

const port = process.env['PORT'];

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(fileDirectory);
        return cb(null, fileDirectory);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').reverse()[0];
        const fileName = `${new Date().getMilliseconds()}.${ext}`;
        return cb(null, fileName);
    }
});
const uploader = multer({ storage });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/components', (req, res) => {
    const files = fs.readdirSync(fileDirectory).filter(name => name !== '.gitkeep');
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
    return res.json({ result: 'success' });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));