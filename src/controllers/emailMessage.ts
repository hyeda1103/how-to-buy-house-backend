import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';

import EmailMessage from '../models/emailMessage';

const sendEmailMessage = expressAsyncHandler(async (req: any, res: Response) => {
  sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

  const { to, subject, message } = req.body;
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
