import * as T from '../types';

const blockedUser = (user: T.User) => {
  if (user?.isBlocked) {
    throw new Error(`Access Denied ${user?.name} is blocked`);
  }
};

export default blockedUser;
