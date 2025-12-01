/**
 * Test script for URLName generation and uniqueness
 * Run with: npx tsx test-urlname-generation.ts
 */

import { generateURLName } from '../utils/generateURLName';

console.log('=== Testing URLName Generation ===\n');

const testCases = [
    'Mon Super Projet',
    'Projet avec des accents: éàç',
    'Special chars !@#$%^&*()',
    'Multiple    Spaces',
    'UPPERCASE TITLE',
    'Title-with-hyphens',
    '  Leading and trailing spaces  ',
    'Émoji 🚀 Test',
    'CamelCaseTitle',
];

testCases.forEach(title => {
    const urlName = generateURLName(title);
    console.log(`Input:  "${title}"`);
    console.log(`Output: "${urlName}"`);
    console.log('---');
});

console.log('\n=== Testing Uniqueness Logic ===\n');

// Simulate existing URLs
const existingURLs = [
    'mon-super-projet',
    'mon-super-projet-1',
    'test-project',
];

console.log('Existing URLs:', existingURLs);

// Test generating unique names
const newTitle = 'Mon Super Projet';
let URLName = generateURLName(newTitle);
console.log(`\nNew title: "${newTitle}"`);
console.log(`Generated URLName: "${URLName}"`);

if (existingURLs.includes(URLName)) {
    let counter = 1;
    let newURLName = `${URLName}-${counter}`;
    console.log(`URLName "${URLName}" exists, trying "${newURLName}"...`);
    
    while (existingURLs.includes(newURLName)) {
        counter++;
        newURLName = `${URLName}-${counter}`;
        console.log(`URLName "${URLName}-${counter - 1}" exists, trying "${newURLName}"...`);
    }
    
    URLName = newURLName;
    console.log(`✅ Final unique URLName: "${URLName}"`);
} else {
    console.log(`✅ URLName "${URLName}" is unique!`);
}
