/**
 * IRole
 *
 * @description
 * An authorization role attached to a user. Carried for fidelity; the public site
 * does not branch UI on roles.
 *
 * @interface IRole
 * @property {string} id - Role unique identifier.
 * @property {string} name - Role name (e.g. "Visitor").
 * @property {string} description - Human-readable description.
 */
export interface IRole {
    id: string;
    name: string;
    description: string;
}
