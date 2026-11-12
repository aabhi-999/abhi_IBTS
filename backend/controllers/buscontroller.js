import Bus from "../models/Bus.js";

// Get all buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses); 
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search buses
export const searchBuses = async (req, res) => {
  try {
    const { source, destination } = req.query;

    const buses = await Bus.find({
      "route.from": { $regex: source, $options: "i" },
      "route.to": { $regex: destination, $options: "i" }
    });

    res.json(buses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
