"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const supabase_1 = require("./supabase");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.get('/', (_, res) => {
    res.send('Flag API');
});
app.get('/continents', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase.from('continents').select('*');
    if (error !== null) {
        res.status(500).send('Internal server error');
        return;
    }
    if (data !== null) {
        res.send(data);
        return;
    }
    res.status(500).send('Internal server error');
}));
app.get('/flags', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase.from('flags').select('*');
    if (error !== null) {
        res.status(500).send('Internal server error');
        return;
    }
    if (data !== null) {
        res.send(data);
        return;
    }
    res.status(500).send('Internal server error');
}));
app.get('/flags/:id/url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).send('Invalid url');
        return;
    }
    const { data: flag, error } = yield supabase_1.supabase.from('flags').select().eq('id', id).single();
    if (error !== null) {
        res.status(500).send('Internal server error');
        return;
    }
    const name = flag === null || flag === void 0 ? void 0 : flag.svg.name;
    if (name === undefined) {
        res.status(404).send('Not found');
        return;
    }
    const { data } = supabase_1.supabase.storage.from('flags').getPublicUrl(`${name}.svg`);
    res.send({ url: data.publicUrl });
}));
app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    }
});
exports.default = app;
