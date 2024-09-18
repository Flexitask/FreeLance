const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Chat = require("./Chat");
const Category = require("./category");
const { description } = require("../schema_validation/signup");

const DeveloperSchema = new Schema({
  username: {
    type: String,
    required: true,
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
  description: {
    type: String,
  },
  title: {
    type: String,
  },
  pricing: {
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
  image: [
    {
      type: String,
    },
  ],
  // Category: {
  //   type: Schema.Types.ObjectId,
  //   ref: "category",
  // },
  category: {
    type: String,
  },
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
  tags: [
    {
      type: String,
    },
  ],
  keywords: [
    {
      type: String,
    },
  ],
});

DeveloperSchema.post("findOneAndDelete", async (Developer) => {
  if (Developer) {
    await Chat.deleteMany({ _id: { $in: Developer.messages } });
  }
}); // to automatically delete all the messages on deletion of developer profile

const Developer = mongoose.model("Developer", DeveloperSchema);
module.exports = Developer;
