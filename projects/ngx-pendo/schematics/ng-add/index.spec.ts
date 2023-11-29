import 'jasmine';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng add ngx pendo', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.0.1'
  };
  const appOptions: ApplicationOptions = {
    name: 'ngx-pendo',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false,
    standalone: true
  };
  let appTree: UnitTestTree | undefined;

  beforeEach(async () => {
    appTree = await runner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await runner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  it('add NgxPendoModule in angular project', async () => {
    const options = { project: 'ngx-pendo', pendoApiKey: 'test1' };
    const tree = await runner.runSchematic('ng-add', options, appTree);
    const appmodule = tree.readContent('/projects/ngx-pendo/src/app/app.module.ts');
    console.log(appmodule);
  });
});
