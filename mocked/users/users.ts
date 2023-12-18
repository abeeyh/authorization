const incompletedUser = {
  name: 'Mao Tse-tung',
  email: 'mao@example.com',
  password: 'hashedPassword456',
};

const incompletedUser2 = {
  name: 'Angels',
  email: 'angels@example.com',
  password: 'hashedPassword789',
};

const user = {
  id: 1,
  ...incompletedUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user2 = {
  id: 2,
  ...incompletedUser2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user3 = {
  id: 3,
  name: 'Vladimir Ilyich Ulianov',
  email: 'ulianov@Vladimir.com',
  password: 'hashedPassword123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const users = [user, user2, user3];

export default { incompletedUser, incompletedUser2, user, user2, user3, users };
