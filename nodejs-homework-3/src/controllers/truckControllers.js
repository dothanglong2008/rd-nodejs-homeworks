const User = require('../models/User');
const Truck = require('../models/Truck');

exports.addTruck = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const truck = new Truck();
    const type = req.body.type;
    truck.type = type;
    truck.created_by = existedUser._id;
    truck.created_date = new Date().toDateString();
    truck.status = 'OL';
    await truck.save();
    const responseBody = {
      message: 'Truck created successfully',
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewTrucks = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const addedTrucks = await Truck.find({
      created_by: existedUser._id,
    });
    const responseBody = {
      trucks: addedTrucks.map((truck) => {
        return {
          _id: truck._id,
          created_by: truck.created_by,
          assigned_to: truck.assigned_to,
          type: truck.type,
          status: truck.status,
          created_date: truck.created_date,
        };
      }),
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.assignTruckById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedTruck = await Truck.findOne({
      _id: id,
      created_by: existedUser._id,
    });
    existedTruck.assigned_to = existedUser._id;
    existedTruck.status = 'IS';
    await existedTruck.save();
    const responseBody = {
      message: 'Truck assigned successfully',
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewTruckById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedTruck = await Truck.findOne({
      _id: id,
      created_by: existedUser._id,
    });
    if (!existedTruck) {
      return res.status(400).json({
        message: 'Truck Not Found',
      });
    }
    const responseBody = {
      truck: {
        _id: existedTruck._id,
        created_by: existedTruck.created_by,
        type: existedTruck.type,
        assigned_to: existedTruck.assigned_to,
        status: existedTruck.status,
        created_date: existedTruck.created_date,
      },
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.updateTruckById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedTruck = await Truck.findOne({
      _id: id,
      created_by: existedUser._id,
      status: 'OL',
    });
    const {...props} = req.body;
    Object.keys(props).forEach((prop) => {
      existedTruck[prop] = props[prop];
    });
    await existedTruck.save();
    const responseBody = {
      message: 'Truck details changed successfully',
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.deleteTruckById = async (req, res, next) => {
  try {
    const user = req.user;
    const userID = user._id;
    const existedUser = await User.findById(userID);
    const id = req.params.id;
    const existedTruck = await Truck.findOne({
      _id: id,
      created_by: existedUser._id,
      status: 'OL',
    });
    if (existedTruck) {
      const updatedTruck = await Truck.deleteOne({_id: id});
      const responseBody = {
        message: updatedTruck,
      };
      res.status(200).json(responseBody);
    }
  } catch (err) {
    next(err);
  }
};


