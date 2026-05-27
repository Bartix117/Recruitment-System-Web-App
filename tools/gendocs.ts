
import swaggerJsdoc from 'swagger-jsdoc';
import converter from 'widdershins';
import fs from 'fs';
import path from 'path';

async function generateDocumentation() {
  console.log('Rozpoczynam generowanie dokumentacji Markdown...');

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Systemu Rekrutacyjnego',
        version: '1.0.0',
        description: 'Dokumentacja backendu.',
      },
    },
    apis: ['./src/api/*.ts'], 
  };

  const openapiSpec = swaggerJsdoc(options);

  const widdershinsOptions = {
    codeSamples: true,
    language_tabs: [{ bash: 'cURL' }, { javascript: 'Node.js' }],
    theme: 'darkula',
    search: true,
  };

  try {
    const markdownContent = await converter.convert(openapiSpec, widdershinsOptions);
    
    const outputPath = path.join(__dirname, '../docs/api-documentation.md');
    
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, markdownContent, 'utf8');
    console.log(`Sukces! Dokumentacja MD zapisana w: ${outputPath}`);
    
  } catch (err) {
    console.error('Wystąpił błąd podczas generowania dokumentacji:', err);
  }
}

generateDocumentation();