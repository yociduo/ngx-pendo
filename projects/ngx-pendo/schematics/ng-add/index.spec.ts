import 'jasmine';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

const collectionPath = path.join(__dirname, '../../collection-test.json');

describe('ng add ngx pedno', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath)
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.0.1'
  };
  const appOptions: ApplicationOptions = {
    name: 'ngx-pedno',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false
  }
  let appTree: UnitTestTree;

  beforeEach(async() => {
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    ).toPromise();
    appTree = await runner.runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      appOptions,
      appTree
    ).toPromise();

  });

  it('add NgxPendoModule in angular project', async () => {
    const options = { project: 'ngx-pedno', pendoApiKey: 'test1'}
    const tree = await runner.runSchematicAsync('ng-add', options, appTree).toPromise();
    const appmodule = tree.readContent('/projects/ngx-pedno/src/app/app.module.ts');
    console.log(appmodule);
  })
});
