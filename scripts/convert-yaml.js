import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const yamlPath = path.join(projectRoot, 'data', 'master-data.yaml');
const outputDir = path.join(projectRoot, 'src-resume', 'data');
const outputPath = path.join(outputDir, 'resume.json');

try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(yamlPath)) {
    console.error(`YAML file not found: ${yamlPath}`);
    console.error('Run "npm run sync" first to copy the YAML from ~/Documents/resume');
    process.exit(1);
  }

  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const data = yaml.load(yamlContent);

  // Extract all unique tags
  const allTags = extractAllTags(data);

  const output = {
    data,
    meta: {
      generatedAt: new Date().toISOString(),
      availableTags: allTags
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Converted YAML to JSON: ${outputPath}`);
  console.log(`Found ${allTags.length} tags: ${allTags.join(', ')}`);
} catch (error) {
  console.error('Error converting YAML:', error.message);
  process.exit(1);
}

function extractAllTags(data) {
  const tags = new Set();
  JSON.stringify(data, (key, value) => {
    if (key === 'tags' && Array.isArray(value)) {
      value.forEach(t => tags.add(t));
    }
    return value;
  });
  return Array.from(tags).sort();
}
