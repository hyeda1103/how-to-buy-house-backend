import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Filter from 'bad-words';

import User from '../models/user';
import Post from '../models/post';
import validateDB from '../utils/validateDB';

/* eslint-disable import/prefer-default-export */
export const createPost = expressAsyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  validateDB(_id);

  const { title, description } = req.body;
  // Check for bad words
  const filter = new Filter({
    replaceRegex: /[A-Za-z0-9가-힣]/g, // Multilingual support for word filtering
    list: [], // Add words to the blacklist
  });

  const isProfane = filter.isProfane(description) || filter.isProfane(title);
  console.log(isProfane);

  // Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error('부적절한 단어가 포함되어 있어 포스팅을 완료할 수 없습니다. 또한 사용자는 블락되었습니다');
  }

  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
