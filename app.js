import fs from 'fs';
import path from 'path';

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

findDeepestDirectory('C:/Users/Nune/OneDrive/Рабочий стол/EPAM Node/deepest directory/node_modules')
    .then((result) => {
        console.log(`Deepest directory is: ${result.item} with depth of ${result.level}`);
        fs.writeFile(`${result.item}/file.txt`, 'Hello world!',err => {
            if (err) {
                console.error(err);
            }
        });
    })