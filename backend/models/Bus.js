import mongoose from "mongoose";

const busSchema = new mongoose.Schema({

  busNumber: String,
  name: String,
  type: String, 
  depot: String,

  route: {
    from: String,
    to: String,
    distanceKm: Number,
    stops: [String]
  },

  time: String,
  fare: Number,

  runningDays: [
    {
      type: String,
      enum: [
        "Monday","Tuesday",
        "Wednesday","Thursday","Friday","Saturday","Sunday"
      ]
    }
  ]
});

export default mongoose.model("Bus", busSchema);
