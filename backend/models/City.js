import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true 
  },
  state: {
    type: String,
    default: "Uttar Pradesh"
  }
});

export default mongoose.model("City", citySchema);
