import User from "./user.model";
import { hash, compare } from "bcryptjs";

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const hashedPassword = await hash(data.password, 10);

  return User.create({
    username: data.username,
    email: data.email,
    password: hashedPassword,
  });
};

export const validateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await compare(password, user.password);
  return isMatch ? user : null;
};
