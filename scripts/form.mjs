import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { romanize } from '../app/utils/romanize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathToKernScores = `${__dirname}/../schubert-dances/kern/`;
const formYamlPath = `${__dirname}/../content/raw-data/form.yaml`;
const formContentYamlPath = `${__dirname}/../content/data/form.yaml`;

function getIdFromFilename(path) {
    return path.split(/[\\\/]/).pop().replace(/\..+$/, '');
}

function getFiles(directory, fileList) {
    fileList = fileList || [];
    let files = fs.readdirSync(directory);
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    for (let i in files) {
        const name = `${directory}/${files[i]}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, fileList);
        } else {
            fileList.push(name);
        }
    }
    return fileList;
}

const pieces = {};

getFiles(pathToKernScores).forEach(file => {
const formData = {};

    const id = 'schubert-' + getIdFromFilename(file);
    console.log(id);
    const stdout = execSync(`awk '{print NR "\t" $0}' ${file} | grep -E '^[0-9]+\t\\*[a-zA-Z][-#]*:'`).toString().trim();
    const beatStdout = execSync(`cat ${file} | beat -cp | beat -dp | beat -da --attacks 0 | extractxx -I '**text' | extractxx -I '**dynam' | extractxx -I '**kern' | ridxx -LGTMId`).toString().trim();

    const keys = stdout.trim().split('\n').map(line => {
        let [lineNumber, key] = line.split('\t').slice(0, 2);
        return [parseInt(lineNumber, 10), key.replaceAll(/[*:]/g, '')];
    });

    const beatData = beatStdout.trim().split('\n').map(line => {
        let [beatDur, beat, lineNumber, beatDurAttacksNull] = line.split('\t');
        return [parseInt(lineNumber, 10), parseFloat(beatDur), parseFloat(beat), parseFloat(beatDurAttacksNull)];
    });

    const indexMap = {
        lineNumber: 0,
        beatDur: 1,
        beat: 2,
        beatDurAttacksNull: 3,
    };

    let maxBeat = parseFloat(beatData.at(-1)[indexMap.beat]);

    let lastBeatDur = parseFloat(beatData.at(-1)[indexMap.beatDur])
        || parseFloat(beatData.at(-1)[indexMap.beatDurAttacksNull])
        || 0;

    maxBeat += lastBeatDur;

    let forms = [];

    let pieceKey = null;

    keys.forEach(([lineNumber, key], index) => {
        pieceKey ??= key;

        const tokens = beatData.find((item, index) => {
            return item[indexMap.lineNumber] > lineNumber;
        });

        if (tokens) {
            const degScore = `**kern
*${pieceKey}:
1${key.toLowerCase()}`;
    
            const stdout = execSync(`echo "${degScore}" | degx | extractxx -i deg | ridx -I`).toString().trim();
            let deg = romanize(stdout.replaceAll(/\D/g, ''));
            deg = key === key.toLowerCase() ? deg.toLowerCase() : deg.toUpperCase();
            deg += stdout.replaceAll(/\d/g, '').replaceAll('-', '♭').replaceAll('+', '♯');
    
            form.push({
                name,
                startBeat: tokens[indexMap.beat],
                endBeat: null,
                startLine: tokens[indexMap.lineNumber],
                endLine: null,
            });
        }

    });

    forms.forEach((form, index) => {
        form.endBeat = forms[index + 1]?.startBeat ?? maxBeat;
        form.endLine = forms[index + 1]?.startLine ?? beatData.at(-1)[indexMap.lineNumber];
    });

    forms = forms.reduce((accumulator, item) => {
        if (item.startBeat !== item.endBeat) {
            accumulator.push(item);
        }
        return accumulator;
    }, []);

    pieces[id] = forms;
});



fs.writeFileSync(formContentYamlPath, yaml.dump(formData, {
    indent: 4,
    lineWidth: -1,
    sortKeys: true,
}));
