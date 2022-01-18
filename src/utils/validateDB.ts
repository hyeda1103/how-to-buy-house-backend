import mongoose from 'mongoose';

const validateDB = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error('User id is not valid or found');
};

export default validateDB;
