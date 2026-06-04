import { register } from 'ts-node';
import * as path from 'path';

// Register ts-node with the schematics tsconfig so that @angular-devkit/schematics
// can resolve and require() .ts factory files using CommonJS at runtime.
register({
  project: path.join(__dirname, '../tsconfig.schematics.json'),
  transpileOnly: true
});
