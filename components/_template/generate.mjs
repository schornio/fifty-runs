import { mkdir, readFile, readdir, writeFile } from 'fs/promises';

async function generate(coponentName, template) {
  const templatePath = `components/_template/${template}`;
  const componentPath = `components/${template}/${coponentName}`;

  await mkdir(componentPath, { recursive: true });

  const fileNames = await readdir(templatePath);
  for (const fileName of fileNames) {
    const file = await readFile(`${templatePath}/${fileName}`, 'utf-8');

    const newFile = file.replace(/\{\{ComponentName\}\}/gu, coponentName);
    const newFileName = fileName
      .replace(/\{\{ComponentName\}\}/gu, coponentName)
      .replace(/\.template$/gu, '');
    const newFilePath = `${componentPath}/${newFileName}`;

    await writeFile(newFilePath, newFile);
  }
}

generate(process.argv[2], process.argv[3]);
