import { JsonValue, Path, workspaces } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';

/** Resolves the architect options for the build target of the given project. */
export function getProjectTargetOptions(
  project: workspaces.ProjectDefinition,
  buildTarget: string
): Record<string, JsonValue | undefined> {
  const options = project.targets?.get(buildTarget)?.options;

  if (!options) {
    throw new SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
  }

  return options;
}

/** Gets all of the default CLI-provided build targets in a project. */
export function getProjectBuildTargets(project: workspaces.ProjectDefinition): workspaces.TargetDefinition[] {
  return getTargetsByBuilderName(
    project,
    builder =>
      builder === '@angular-devkit/build-angular:application' ||
      builder === '@angular-devkit/build-angular:browser' ||
      builder === '@angular-devkit/build-angular:browser-esbuild'
  );
}

/** Gets all of the default CLI-provided testing targets in a project. */
export function getProjectTestTargets(project: workspaces.ProjectDefinition): workspaces.TargetDefinition[] {
  return getTargetsByBuilderName(project, builder => builder === '@angular-devkit/build-angular:karma');
}

/** Gets all targets from the given project that pass a predicate check. */
function getTargetsByBuilderName(
  project: workspaces.ProjectDefinition,
  predicate: (name: string | undefined) => boolean
): workspaces.TargetDefinition[] {
  return Array.from(project.targets.keys())
    .filter(name => predicate(project.targets.get(name)?.builder))
    .map(name => project.targets.get(name)!);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
export function getProjectMainFile(project: workspaces.ProjectDefinition): Path {
  const buildOptions = getProjectTargetOptions(project, 'build');

  // `browser` is for the `@angular-devkit/build-angular:application` builder while
  // `main` is for the `@angular-devkit/build-angular:browser` builder.
  const mainPath = (buildOptions['browser'] || buildOptions['main']) as Path | undefined;

  if (!mainPath) {
    throw new SchematicsException(
      `Could not find the project main file inside of the ` + `workspace config (${project.sourceRoot})`
    );
  }

  return mainPath;
}

/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
export function getProjectFromWorkspace(
  workspace: workspaces.WorkspaceDefinition,
  projectName: string | undefined
): workspaces.ProjectDefinition {
  if (!projectName) {
    // TODO(crisbeto): some schematics APIs have the project name as optional so for now it's
    // simpler to allow undefined and checking it at runtime. Eventually we should clean this up.
    throw new SchematicsException('Project name is required.');
  }

  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}
