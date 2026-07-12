/**
 * IPermission
 *
 * @description
 * Domain entity for individual permissions assigned to users or roles.
 *
 * Permissions define specific actions users can perform on resources.
 *
 * @interface IPermission
 * @property {string} id - Permission unique identifier.
 * @property {string} resource - Resource name (e.g. "comments").
 * @property {string} action - Action name (e.g. "create").
 */
export interface IPermission {
    id: string;
    resource: string;
    action: string;
}
