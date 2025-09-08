import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource.js';
import { auth } from './auth/resource.js';

defineBackend({
    storage, auth
});
