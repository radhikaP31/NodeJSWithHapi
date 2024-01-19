const Hapi = require('hapi');
const mongoose = require('mongoose');
const User  = require('./models/userModel');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const HapiAuthJwt2 = require("hapi-auth-jwt2");

const validate = async (decoded, request) => {
    if (decoded.id) {
      return { isValid: true, credentials: decoded };
    }
    return { isValid: false, response: "Invalid credentials" };
};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            timeout: {
                server: false,
            },
        },
    });
    await server.register(HapiAuthJwt2);

    server.auth.strategy("jwt", "jwt", {
        key: process.env.TOKEN_SECRET, // this is the secret key
        validate, // validate the user
        verifyOptions: { algorithms: ["HS256"] },
    });

    server.auth.default("jwt");

    await mongoose.connect('mongodb://localhost:27017/node')
        .then(() => console.log('MongoDB connected.'))
        .catch(err => console.log(err));

    // Get user list
    server.route({
        path: '/users/list',
        method: 'GET',
        config: { auth: "jwt" },
        handler: async (request, h) => {
            const userData = await User.find();
            return h.response({ success: true, data: userData }).code(200);
        }
    });

    // Add user
    server.route({
        path: '/users/add',
        method: 'POST',
        options: {
            auth: "jwt",
            validate: {
                payload: Joi.object({
                  name: Joi.string().min(3).max(30).required(),
                  email: Joi.string().email().required(),
                  mobile: Joi.string().length(10).required(),
                  status: Joi.string().required(),
                  password: Joi.string().min(6).required(),
                }),
            },
        },
        handler: async (request, h) => {
            console.log('test');
          try {
            console.log('test');
            const { name, email, mobile, password, status } = request.payload;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              return { success: false, message: 'Email already exists.' };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, mobile, password: hashedPassword, status });
            await newUser.save();
            return h
              .response({ message: "User add successfully.", data: newUser })
              .code(200);
          } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Internal server error' };
          }
        },
    });

    // Edit user
    server.route({
        method: 'PUT',
        path: '/users/update/{id}',
        options: {
            auth: "jwt",
            validate: {
              payload: Joi.object({
                name: Joi.string().min(3).max(30).required(),
                email: Joi.string().email().required(),
                mobile: Joi.string().length(10).required(),
                status: Joi.string().required(),
                password: Joi.string().min(6).required(),
              }),
            },
          },
        handler: async (request, h) => {
            try {
                const id = request.params.id;
                const userData =  await User.findById(id);
                if(!userData){
                    res.status(404).json({message: 'User not found'});
                }
                const { name, email, mobile, password, status } = request.payload;
                const hashedPassword = await bcrypt.hash(password, 10);
                const updateUser = new User({ name, email, mobile, password: hashedPassword, status });
                let updated = await Note.updateOne({ _id: id }, updateUser).lean();
                return h
                .response({ message: "User updated successfully.", success: true, result: updated })
                .code(200);
            } catch (error) {
                console.error('Error:', error);
                return { success: false, message: 'Internal server error' };
            }
        }
    });

    // Get single user data
    server.route({
        path: '/users/getSingleUser/{id}',
        method: 'GET',
        config: { auth: "jwt" },
        handler: async (request, h) => {
          try {
            const id = request.params.id;
            const userData = await User.findOne({ _id:id });
            return h.response({ success: true, data: userData }).code(200);
          } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Internal server error' };
          }
        },
    });

    // Delete single user data
    server.route({
        path: '/users/delete/{id}',
        method: 'DELETE',
        config: { auth: "jwt" },
        handler: async (request, h) => {
          try {
            console.log('testtttt');
            const id = request.params.id;
            const userData = await User.remove({ _id:id });
            return h.response({ success: true, message: "User deleted successfully.", data: userData }).code(200);
          } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Internal server error' };
          }
        },
    });

    // login
    server.route({
        path: '/auth',
        method: 'POST',
        handler: async (request, h) => {
            console.log('test');
          try {
            console.log('test');
            const { username, password } = request.payload;
            const user = await User.findOne({
                where: {
                    email: username,
                },
            });
            if(!user) {
                res.status(200).json({success: false, message :'User not found.'});
            }

            const match = await bcrypt.compare(password, user.password);
            let payload = { id: user.id || 0 };
            const token = jwt.sign(payload,process.env.TOKEN_SECRET);
            if (match) {
                return h
                .response({ success: true, message: "Login Successfully.", token: token })
                .code(200);
            } else {
                res.status(200).json({success: false, message: 'Incorrect password.' });
            }
          } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Internal server error' };
          }
        },
    });

    // update the user status
  server.route({
    method: "PATCH",
    path: "/users/change-status/{id}",
    config: { auth: "jwt" },
    handler: async (req, h) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return h
            .response({ message: "User not found.", data: user })
            .code(200);
        }

        const { status } = req.payload;
        if (user) {
          const userData = await User.findByIdAndUpdate(req.params.id, { status }, { new: true } );
          return h
            .response({ message: "Change status successfully", data: userData })
            .code(200);
        }
      } catch (error) {
        return h.response({ message: error.message, data: null }).code(500);
      }
    },
  });

    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();