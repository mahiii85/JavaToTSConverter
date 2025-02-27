"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = require('fs');
const inputFolderPath = './java-files'; // Change this to your target folder
const outputFolderPath = './output-files'; // Change this to your output folder
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
}
function convertJavaToTypeScript(inputFilePath, outputFilePath) {
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
    }
    catch (error) {
        console.error(`Error processing file ${inputFilePath}:`, error);
    }
}
function convertType(javaType) {
    const typeMapping = {
        'int': 'number',
        'double': 'number',
        'float': 'number',
        'long': 'number',
        'boolean': 'boolean',
        'String': 'string'
    };
    return typeMapping[javaType] || 'any';
}
function processJavaFiles(inputDirectory, outputDirectory) {
    try {
        const files = fs.readdirSync(inputDirectory);
        files.forEach((file) => {
            const inputFilePath = path.join(inputDirectory, file);
            const outputFilePath = path.join(outputDirectory, file.replace('.java', '.ts'));
            if (fs.statSync(inputFilePath).isFile() && file.endsWith('.java')) {
                convertJavaToTypeScript(inputFilePath, outputFilePath);
            }
        });
    }
    catch (error) {
        console.error('Error reading directory:', error);
    }
}
processJavaFiles(inputFolderPath, outputFolderPath);
