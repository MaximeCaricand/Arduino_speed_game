import * as mongoose from 'mongoose';
export * as GameResultService from './services/gameResult.service';

const DB_NAME = 'speedGameResults';

export async function connectDB(port: number) {
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect(`mongodb://mongo:${port}/${DB_NAME}`, (err) => {
                if (err) console.log(err);
                resolve('[mongo] connection success');
            });
        } catch (err) {
            console.log("connection failure", err);
            reject();
        }
    })
}