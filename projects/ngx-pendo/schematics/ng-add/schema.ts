/**
 * Ngx Pendo ng-add schematic
 */
export interface Schema {
  /** Whether to skip package.json install. */
  skipPackageJson: boolean;
  /** Name of the project. */
  project: string;
  /** Pendo Api Key */
  pendoApiKey: string;
}
