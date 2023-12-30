import * as fs from 'fs';
import * as path from 'path';
import { copyFileSync, ensureDirSync } from 'fs-extra';

export function copyAndReplaceFiles(srcDir: string, destDir: string) {
  // Create destination directory if it doesn't exist
  ensureDirSync(destDir);

  // Get a list of files in the source directory
  const files = fs.readdirSync(srcDir);

  // Copy and replace each file in the destination directory
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    // If the file already exists in the destination directory, remove it
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
    }
    // Skip files with .ts extension
    if (path.extname(file) === ".ts") {
      return;
    }
    // Copy the file to the destination directory
    copyFileSync(srcFile, destFile);
  });
}
