import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectDefinition, WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { SchematicsException } from '@angular-devkit/schematics';
import { addSymbolToNgModuleMetadata, insertImport } from '@schematics/angular/utility/ast-utils';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { InsertChange } from '@schematics/angular/utility/change';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export default function(options: NgxPednoNgAddSchema): Rule {
  return async (_host: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(_host);
    const project = getProjectFromWorkspace(workspace, options.project);
    if (project.extensions.projectType === ProjectType.Application) {
      addNgxPendoModule(project, _host, options);
    }
    addPackageToPackageJson(_host, 'ngx-pendo', '1.6.0');
  };
}

function addNgxPendoModule(project: ProjectDefinition, _host: Tree, options: NgxPednoNgAddSchema): void {
  const appModulePath = buildDefaultPath(project) + '/app.module.ts';
  const sourceFile = readIntoSourceFile(_host, appModulePath);
  const importPath = 'ngx-pendo';
  const recorder = _host.beginUpdate(appModulePath);
  const moduleName = 'NgxPendoModule';
  const importChange = insertImport(sourceFile, appModulePath, moduleName, importPath);
  if (importChange instanceof InsertChange) {
    recorder.insertLeft(importChange.pos, importChange.toAdd);
  }
  const ngModuleName = `NgxPendoModule.forRoot({
        pendoApiKey: ${options.pendoApiKey},
        pendoIdFormatter: (value: any) => value.toString().toLowerCase()
      })`;
  const ngModuleChanges = addSymbolToNgModuleMetadata(sourceFile, appModulePath, 'imports', ngModuleName, null);
  for (const change of ngModuleChanges) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  _host.commitUpdate(recorder);
}

function getProjectFromWorkspace(
  workspace: WorkspaceDefinition,
  projectName = workspace.extensions.defaultProject as string
): ProjectDefinition {
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does noot exist`);
  }

  const sourceText = text.toString('utf-8');
  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');


    const json = JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

function sortObjectByKeys(obj: any): any {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key: any) => (result[key] = obj[key]) && result, {});
}
