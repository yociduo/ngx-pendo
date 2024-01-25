import { Rule, SchematicContext, Tree, chain, noop } from '@angular-devkit/schematics';
import { callsProvidersFunction } from '@schematics/angular/private/components';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider } from '@schematics/angular/utility';
import { addSymbolToNgModuleMetadata, insertImport } from '@schematics/angular/utility/ast-utils';
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { applyChangesToFile } from '@schematics/angular/utility/standalone/util';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from './package-config';
import { Schema } from './schema';
import { parseSourceFile } from '../utils/ast';
import { getProjectFromWorkspace, getProjectMainFile } from '../utils/project';

function addImportToNgModule(mainFile: string, options: Schema): Rule {
  return (host: Tree) => {
    const appModulePath = getAppModulePath(host, mainFile);
    const moduleSource = parseSourceFile(host, appModulePath);
    const ngModuleName = `NgxPendoModule.forRoot({
  pendoApiKey: '${options.pendoApiKey}',
  pendoIdFormatter: (pendoId: string) => pendoId.toLowerCase()
})`;

    applyChangesToFile(host, appModulePath, [
      insertImport(moduleSource, appModulePath, 'NgxPendoModule', 'ngx-pendo'),
      ...addSymbolToNgModuleMetadata(moduleSource, appModulePath, 'imports', ngModuleName, null)
    ]);
  };
}

function addStandaloneConfig(mainFile: string, options: Schema): Rule {
  return (host: Tree) => {
    const providerFn = 'provideNgxPendo';

    if (callsProvidersFunction(host, mainFile, providerFn)) {
      // exit because the store config is already provided
      return host;
    }

    return addRootProvider(options.project, ({ code, external }) => {
      return code`${external(providerFn, 'ngx-pendo')}({ pendoApiKey: '${options.pendoApiKey}', pendoIdFormatter: (pendoId: string) => pendoId.toLowerCase() })`;
    });
  };
}

function addNgxPendoToPackageJson(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const ngxPendoVersionTag = getPackageVersionFromPackageJson(host, 'ngx-pendo') || `0.0.0`;
    addPackageToPackageJson(host, 'ngx-pendo', ngxPendoVersionTag);
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function (options: Schema): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addNgxPendoToPackageJson(),
    async (host: Tree, context: SchematicContext) => {
      const workspace = await getWorkspace(host);
      const project = getProjectFromWorkspace(workspace, options.project);
      const mainFile = getProjectMainFile(project);
      if (project.extensions['projectType'] === ProjectType.Application) {
        if (isStandaloneApp(host, mainFile)) {
          return addStandaloneConfig(mainFile, options);
        } else {
          return addImportToNgModule(mainFile, options);
        }
      }

      context.logger.warn(
        'ngx-pendo has been set up in your workspace. There is no additional setup ' +
          'required for consuming ngx-pendo in your library project.\n\n' +
          'If you intended to run the schematic on a different project, pass the `--project` ' +
          'option.'
      );
      return;
    }
  ]);
}
