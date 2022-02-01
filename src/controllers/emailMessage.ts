import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';
import Filter from 'bad-words';

import EmailMessage from '../models/emailMessage';

const sendEmailMessage = expressAsyncHandler(async (req: any, res: Response) => {
  sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

  const { to, subject, message } = req.body;
  // Get the message
  const emailMessage = `${subject} ${message}`;
  // Prevent profanity/bad words
  const filter = new Filter({
    replaceRegex: /[A-Za-z0-9가-힣]/g, // Multilingual support for word filtering
    list: [], // Add words to the blacklist
  });
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane) throw new Error('이메일에 부적절한 내용이 담겨 있어 발신 실패하였습니다');
  try {
    // Build up message
    const newMessage = {
      to,
      from: 'mongryong.in.the.house@gmail.com',
      subject,
      text: message,
    };
    // Send message
    await sgMail.send(newMessage);
    // Save to DB
    await EmailMessage.create({
      from: req?.user?.email,
      to,
      message,
      subject,
      sentBy: req?.user?._id,
    });
    res.json('이메일이 발신되었습니다');
  } catch (error) {
    res.json(error);
  }
});

export default sendEmailMessage;
