import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';
import { Schema as NgxPendoOptions } from './schema';

describe('ng add ngx pendo', () => {
  const schematicRunner = new SchematicTestRunner('ngx-pendo', path.join(__dirname, '../collection.json'));
  const defaultOptions: NgxPendoOptions = {
    project: 'bar',
    pendoApiKey: 'pendo-api-key'
  };

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.0.1'
  };
  const appOptions: ApplicationOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false,
    standalone: false
  };
  let appTree: UnitTestTree | undefined;

  beforeEach(async () => {
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions);
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
    const standaloneAppOptions = { ...appOptions, name: 'bar-standalone', standalone: true };
    appTree = await schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'application',
      standaloneAppOptions,
      appTree
    );
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));
    expect(packageJson.dependencies['ngx-pendo']).toBe(`~${require('../../package.json').version}`);
  });

  it('should update app module', async () => {
    const options = { ...defaultOptions };
    const projectPath = '/projects/bar';
    const importRegex = /import { NgxPendoModule } from 'ngx-pendo';/gm;
    const providerRegex =
      /NgxPendoModule.forRoot\({\n\W{2,}pendoApiKey: 'pendo-api-key',\n\W{2,}pendoIdFormatter: \(pendoId: string\) => pendoId.toLowerCase\(\)\n\W{2,}\}\)/gm;

    for (let i = 0; i < 2; i++) {
      const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
      const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
      const importMatches = content.match(importRegex);
      const providerMatches = content.match(providerRegex);

      // check config import and not duplicated
      expect(importMatches?.length).toBe(1);
      expect(providerMatches?.length).toBe(1);
    }
  });

  it('should update app config for standalone', async () => {
    const options = { ...defaultOptions, project: 'bar-standalone' };
    const projectPath = '/projects/bar-standalone';
    const importRegex = /import { provideNgxPendo } from 'ngx-pendo';/gm;
    const providerRegex =
      /provideNgxPendo\(\{ pendoApiKey: 'pendo-api-key', pendoIdFormatter: \(pendoId: string\) => pendoId.toLowerCase\(\) \}\)/gm;

    for (let i = 0; i < 2; i++) {
      const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
      const content = tree.readContent(`${projectPath}/src/app/app.config.ts`);
      const importMatches = content.match(importRegex);
      const providerMatches = content.match(providerRegex);

      // check config import and not duplicated
      expect(importMatches?.length).toBe(1);
      expect(providerMatches?.length).toBe(1);
    }
  });
});
