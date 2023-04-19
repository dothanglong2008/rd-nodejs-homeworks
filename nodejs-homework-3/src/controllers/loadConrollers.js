const User = require('../models/User');
const Load = require('../models/Load');
const Truck = require('../models/Truck');

exports.addLoad = async (req, res, next) => {
  try {
    const user = req.user;
    const userID = user._id;
    const existedUser = await User.findById(userID);
    const load = new Load();
    const requestBody = req.body;
    Object.keys(requestBody).forEach((prop) => {
      load[prop] = requestBody[prop];
    });
    load.created_by = existedUser._id;
    load.status = 'NEW';
    load.state = 'En route to Pick Up';
    load.created_date = new Date().toDateString();
    load.assigned_to = existedUser._id;
    await load.save();
    const responseBody = {
      message: 'Load created successfully',
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewLoads = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const status = req.query.status;
    let limit = req.query.limit;
    let offset = req.query.offset;
    let addedLoads;
    if (!limit) {
      limit = 10;
    }
    if (!offset) {
      offset = 0;
    }
    if (existedUser.role === 'SHIPPER') {
      if (status) {
        addedLoads = await Load.find({
          created_by: existedUser._id,
          status: status,
        }).skip(offset).limit(limit);
      } else {
        addedLoads = await Load.find({
          created_by: existedUser._id,
        }).skip(offset).limit(limit);
      }
    }
    if (existedUser.role === 'DRIVER') {
      if (status) {
        addedLoads = await Load.find({
          created_by: existedUser._id,
          status: status,
        }).skip(offset).limit(limit);
      } else {
        addedLoads = await Load.find({
          assigned_to: existedUser._id,
        }).skip(offset).limit(limit);
      }
    }
    const responseBody = {
      loads: addedLoads.map((load) => {
        return {
          _id: load._id,
          created_by: load.created_by,
          type: load.type,
          created_date: load.created_date,
          status: load.status,
          assigned_to: load.assigned_to,
        };
      }),
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewUserAssignedLoads = async (req, res, next) => {
  try {
    const existedUser = req.user;
    if (existedUser.role !== 'DRIVER') {
      res.status(400).json({
        message: 'Driver Only',
      });
    } else {
      const assignedLoads = await Load.find({
        assigned_to: existedUser._id,
      });
      const responseBody = {
        load: assignedLoads.map((load) => {
          return {
            _id: load._id,
            created_by: load.created_by,
            type: load.type,
            created_date: load.created_date,
            status: load.status,
            assigned_to: load.assigned_to,
          };
        }),
      };
      res.status(200).json(responseBody);
    }
  } catch (err) {
    next(err);
  }
};

exports.iterateState = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const activeLoad = await Load.findOne({
      assigned_to: existedUser._id,
    });
    if (!activeLoad) {
      return res.status(400).json({
        message: 'No active load',
      });
    }
    const stateIndex = Load.schema
        .path('state')
        .enumValues
        .indexOf(activeLoad.state);
    activeLoad.state = Load.schema
        .path('state')
        .enumValues[stateIndex + 1];
    const iteratedLoad = await activeLoad.save();
    const responseBody = {
      message: `Load state changed to ${iteratedLoad.state}`,
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewLoadById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedLoad = await Load.findOne({
      _id: id,
      created_by: existedUser._id,
    });
    const responseBody = {
      _id: existedLoad._id,
      created_by: existedLoad.created_by,
      type: existedLoad.type,
      assigned_to: existedLoad.assigned_to,
      status: existedLoad.status,
      created_date: existedLoad.created_date,
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.updateLoadById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedLoad = await Load.findOne({
      _id: id,
      created_by: existedUser._id,
      status: 'NEW',
    });
    const {...props} = req.body;
    Object.keys(props).forEach((prop) => {
      existedLoad[prop] = props[prop];
    });
    await existedLoad.save();
    const responseBody = {
      message: 'Load details changed successfully',
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.deleteLoadById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedLoad = await Load.findOne({
      _id: id,
      created_by: existedUser._id,
      status: 'NEW',
    });
    if (existedLoad) {
      await Load.deleteOne({_id: id});
      const responseBody = {
        message: 'Load deleted successfully',
      };
      res.status(200).json(responseBody);
    }
  } catch (err) {
    next(err);
  }
};

exports.postLoadById = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const activeLoad = await Load.findOne({
      _id: id,
      created_by: existedUser._id,
    });
    activeLoad.status = 'POSTED';
    await activeLoad.save();
    const responseBody = {
      message: 'Load posted successfully',
      driver_found: true,
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

exports.viewLoadShippingInfo = async (req, res, next) => {
  try {
    const existedUser = req.user;
    const id = req.params.id;
    const existedLoad = await Load.findOne({
      _id: id,
      created_by: existedUser._id,
    });
    const driverId = existedLoad.assigned_to;
    const assignedTruck = await Truck.findOne({assigned_to: driverId});
    const responseBody = {
      load: existedLoad,
      truck: assignedTruck,
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

// const path = require('path');
// const fs = require('fs');
// app.get('/file', async (req, res, next) => {
//   const fileName = 'name.xls';
//   const filePath = path.join(__dirname, 'uploads');
//   await fs.writeFile(`${filePath}/${fileName}`, 'abc', (err) => {
//     if (err) {
//       return res.status(400).json({
//         message: 'File error',
//       });
//     } else {
//       res.status(200).sendFile(fileName,
//           {
//             root: filePath,
//           },
//           (err) => {
//             next(err);
//           },
//       );
//     }
//   });
// });
