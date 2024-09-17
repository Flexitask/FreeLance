const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  image: {
    url: String,
    filename: String,
  },
  work_exp: [
    {
      type: String,
      Date: Schema.Types.Date,
    },
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },

  //rest is the relationship with other schemas
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  clients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
  ],
});

DeveloperSchema.post("findOneAndDelete", async (listing) => {
  if (Developer) {
    await Chat.deleteMany({ _id: { $in: Developer.messages } });
  }
}); // to automatically delete all the messages on deletion of developer profile

const Developer = mongoose.model("Developer", DeveloperSchema);
module.exports = Developer;