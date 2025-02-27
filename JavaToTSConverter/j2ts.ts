
//import * as path from 'path';
const path = require('path');
const fs = require('fs');

const inputFolderPath = './java-files'; // Change this to your target folder
const outputFolderPath = './output-files'; // Change this to your output folder

if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
}

function convertJavaToTypeScript(inputFilePath: string, outputFilePath: string) {
    try {
        let content = fs.readFileSync(inputFilePath, 'utf8');
        
        // Extract class name
        const classMatch = content.match(/class\s+(\w+)/);
        if (!classMatch) {
            console.error(`No class found in file: ${inputFilePath}`);
            return;
        }
        const className = classMatch[1];
        
        // Extract fields and convert to TypeScript interface
        const properties = [...content.matchAll(/(private|protected|public)\s+(\w+)\s+(\w+);/g)];
        const interfaceProperties = properties.map(match => `    ${match[3]}: ${convertType(match[2])};`).join('\n');
        
        const tsInterface = `export interface ${className} {\n${interfaceProperties}\n}`;
        
        fs.writeFileSync(outputFilePath, tsInterface, 'utf8');
        console.log(`Converted: ${outputFilePath}`);
    } catch (error) {
        console.error(`Error processing file ${inputFilePath}:`, error);
    }
}

function convertType(javaType: string): string {
    const typeMapping: { [key: string]: string } = {
        'int': 'number',
        'double': 'number',
        'float': 'number',
        'long': 'number',
        'boolean': 'boolean',
        'String': 'string'
    };
    return typeMapping[javaType] || 'any';
}

function processJavaFiles(inputDirectory: string, outputDirectory: string) {
    try {
        const files = fs.readdirSync(inputDirectory);
        
        files.forEach((file: string) => {
            const inputFilePath = path.join(inputDirectory, file);
            const outputFilePath = path.join(outputDirectory, file.replace('.java', '.ts'));
            
            if (fs.statSync(inputFilePath).isFile() && file.endsWith('.java')) {
                convertJavaToTypeScript(inputFilePath, outputFilePath);
            }
        });
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

processJavaFiles(inputFolderPath, outputFolderPath);
