export type TActionType = 'READ' | 'WRITE' | 'DELETE';

export interface IWithPermissions {
  getPermissionsForUser(
    id: string,
    userId: string | undefined,
  ): Promise<readonly TActionType[]>;
  assertPermissionsForUser(
    objectId: string,
    userId: string | undefined,
    action: TActionType,
  ): Promise<void>;
}
