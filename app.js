import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findDeepestDirectory(directory) {
    let deepestLevel = 0;
    let deepestItem = '';

    const directories = await fs.promises.readdir(directory);

    for (const folder of directories) {
        const folderPath = path.join(directory, folder);
        const stats = await fs.promises.stat(folderPath);

        if (stats.isDirectory()) {
            const subdirectory = await findDeepestDirectory(folderPath);

            if (subdirectory.level > deepestLevel) {
                deepestLevel = subdirectory.level;
                deepestItem = subdirectory.item;
            }
        }
    }

    deepestLevel++;

    return { level: deepestLevel, item: deepestItem || directory };
}

findDeepestDirectory(__dirname)
    .then((result) => {
        console.log(`Deepest directory is: ${result.item} with depth of ${result.level}`);
        fs.writeFile(`${__dirname}/file.txt`, 'Hello world!',err => {
            if (err) {
                console.error(err);
            }
        });
    })