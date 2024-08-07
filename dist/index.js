"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const flags_json_1 = __importDefault(require("./flags.json"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use('/flags', express_1.default.static(path_1.default.join(__dirname, '..', 'assets', 'svgs')));
app.get('/', (_, res) => {
    res.send("Express + TypeScript Server");
});
app.get('/flags/info', (req, res) => {
    const { lang = 'en' } = req.query;
    let language = 'en';
    switch (lang) {
        case 'en':
        case 'cs':
            language = lang;
            break;
    }
    const result = flags_json_1.default.map(flagInfo => (Object.assign(Object.assign({}, flagInfo), { name: flagInfo.name[language], continent: flagInfo.continent[language] })));
    res.json(result);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
