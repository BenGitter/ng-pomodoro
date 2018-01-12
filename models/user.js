const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  trelloId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

User.findOrCreate = (user, callback) => {
  User.findOneAndUpdate(
    { trelloId: user.id },
    { token: user.token },
    { new: true, upsert: true },
    callback,
  );
};

module.exports = User;
