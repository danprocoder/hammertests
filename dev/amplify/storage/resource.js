import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: 'qa-helper',
  access: (allow) => ({
    'public/*': [allow.guest.to(['write', 'read', 'delete'])]
  })
});
