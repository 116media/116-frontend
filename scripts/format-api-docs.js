import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiFilePath = join(__dirname, '../src/shared/infrastructure/api/generated/116.api.ts');

const swagger = await fetch('http://localhost:5025/swagger/v1/swagger.json').then(r => r.json());

const operations = Object.values(swagger.paths)
    .flatMap(methods => Object.values(methods))
    .filter(op => op.operationId && op.description);

function formatDescription(description) {
    const lines = description.split('\n').map(l => l.trim());
    const formatted = [];
    let prevEmpty = true, prevBullet = false, prevHeader = false;

    for (const line of lines) {
        const isEmpty = !line;
        const isBullet = line.startsWith('-');
        const isHeader = line.endsWith(':') || line.endsWith(':**');
        const isMarkdownHeader = line.startsWith('**') && line.endsWith(':**') && !isBullet;
        const isBoldBullet = isBullet && line.includes('**');

        if (!formatted.length && isEmpty) continue;

        if (isEmpty) {
            if (prevHeader || (!prevBullet && !prevEmpty)) formatted.push('');
            prevEmpty = true;
            continue;
        }

        const needsBlank = formatted.length &&
            ((isMarkdownHeader && !prevEmpty) || (isHeader && !isBoldBullet && prevBullet));

        if (needsBlank) formatted.push('');
        formatted.push(line);

        prevEmpty = false;
        prevBullet = isBullet;
        prevHeader = isHeader;
    }

    while (formatted.at(-1) === '') formatted.pop();
    return formatted.join('\n     * ');
}

const descriptionMap = new Map(
    operations.map(op => [op.operationId, formatDescription(op.description)])
);

let content = readFileSync(apiFilePath, 'utf-8');

content = content.replace(
    /\/\*\*\s*\n\s*\* @description (.+?)\n\s*\*\s*\n\s*\* @tags (.+?)\n\s*\* @name (\w+)/gs,
    (_, desc, tags, operationId) => {
        const formattedDesc = descriptionMap.get(operationId) || desc;
        return `/**\n     * @description ${formattedDesc}\n     *\n     * @tags ${tags}\n     * @name ${operationId}`;
    }
);

writeFileSync(apiFilePath, content, 'utf-8');
console.log('\x1b[32m✔\x1b[0m API documentation formatted successfully');
