import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const outputDir = path.join(projectRoot, 'src', 'data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert resume data
const resumeYamlPath = path.join(projectRoot, 'data', 'resume.yaml');
const resumeOutputPath = path.join(outputDir, 'resume.json');

try {
  if (!fs.existsSync(resumeYamlPath)) {
    console.error(`YAML file not found: ${resumeYamlPath}`);
    console.error('Run "npm run sync" first to copy the YAML from ~/Documents/resume');
    process.exit(1);
  }

  const yamlContent = fs.readFileSync(resumeYamlPath, 'utf8');
  const data = yaml.load(yamlContent);
  const allTags = extractAllTags(data);

  const output = {
    data,
    meta: {
      generatedAt: new Date().toISOString(),
      availableTags: allTags
    }
  };

  fs.writeFileSync(resumeOutputPath, JSON.stringify(output, null, 2));
  console.log(`Converted resume YAML to JSON: ${resumeOutputPath}`);
  console.log(`Found ${allTags.length} tags: ${allTags.join(', ')}`);
} catch (error) {
  console.error('Error converting resume YAML:', error.message);
  process.exit(1);
}

// Convert projects data (from individual files in data/projects/)
const projectsDir = path.join(projectRoot, 'data', 'projects');
const projectsOutputPath = path.join(outputDir, 'projects.json');

try {
  const projects = [];

  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .sort();

    for (const file of files) {
      const filePath = path.join(projectsDir, file);
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const project = yaml.load(yamlContent);
      projects.push(project);
      console.log(`  Loaded: ${file}`);
    }
  }

  const output = {
    projects,
    meta: {
      generatedAt: new Date().toISOString()
    }
  };

  fs.writeFileSync(projectsOutputPath, JSON.stringify(output, null, 2));
  console.log(`Converted ${projects.length} projects to JSON: ${projectsOutputPath}`);
} catch (error) {
  console.error('Error converting projects YAML:', error.message);
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
