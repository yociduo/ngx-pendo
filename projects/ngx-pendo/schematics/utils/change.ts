import { Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { Change, InsertChange, NoopChange, RemoveChange, ReplaceChange } from '@schematics/angular/utility/change';

export function applyToUpdateRecorder(recorder: UpdateRecorder, changes: Change[]): void {
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove(change.order, change.toRemove.length);
    } else if (change instanceof ReplaceChange) {
      recorder.remove(change.order, change.oldText.length);
      recorder.insertLeft(change.order, change.newText);
    } else if (!(change instanceof NoopChange)) {
      throw new Error('Unknown Change type encountered when updating a recorder.');
    }
  }
}

/**
 * Applies a set of changes to a file.
 * @param tree File tree of the project.
 * @param path Path to the file that is being changed.
 * @param changes Changes that should be applied to the file.
 */
export function applyChangesToFile(tree: Tree, path: string, changes: Change[]) {
  if (changes.length > 0) {
    const recorder = tree.beginUpdate(path);
    applyToUpdateRecorder(recorder, changes);
    tree.commitUpdate(recorder);
  }
}
