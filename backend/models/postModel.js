import mongoose, { models } from 'mongoose';
import slugify from "slugify"; 
const postSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        unique: true,
    },
    Description: {
        type: String,
        required: true,
    },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slug: { type: String, unique: true }
}, {
    timestamps: true,

})
postSchema.pre("save", function (next) {
  if (this.isModified("Title")) {
    this.slug = slugify(this.Title, { lower: true, strict: true });
  }
  next();
});


const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;

