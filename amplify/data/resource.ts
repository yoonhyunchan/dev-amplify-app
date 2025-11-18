import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Item: a
    .model({
      title: a.string().required(),
      description: a.string(),
      owner_id: a.string().required(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
