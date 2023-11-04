const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());

const ADMINS_PATH = path.join(__dirname, "admins.json");
const USERS_PATH = path.join(__dirname, "users.json");
const COURSES_PATH = path.join(__dirname, "courses.json");
const secretKey = "sup3rS3cr3tK3y";

const generateJWT = (user) => {
  const payload = {username: user.username};
  return jwt.sign(payload, secretKey, {expiresIn: "1h"});
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(authHeader){
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if(err) res.status(403).json({message: "Authentication Failed", err})
      else{
        req.user = user;
        next();
      }
    })
  }else{
    res.sendStatus(401);
  }

}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const newAdmin = req.body;
  fs.readFile(ADMINS_PATH, "utf-8", (err, admins) => {
    if(err) res.status(404).json({message: `Error Reading from Admin File: ${err}`});
    else{
      const ADMINS = JSON.parse(admins);
      const existingAdmin = ADMINS.find(a => a.username === newAdmin.username);
      if(existingAdmin) res.status(403).json({message: "Admin Already Exits"});
      else{
        ADMINS.push(newAdmin);
        admins = JSON.stringify(ADMINS);
        fs.writeFile(ADMINS_PATH, admins, (err) => {
          if(err) res.status(404).json({message: `Error Writing to Admin File: ${err}`});
          else{
            const token = generateJWT(newAdmin);
            res.json({message: "Admin Created Sucessfully", newAdmin, token});
          }
        })
      }
    }
  })

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  fs.readFile(ADMINS_PATH, "utf-8", (err, admins) => {
    if(err) res.status(404).json({message: `Error Reading from Admin File: ${err}`});
    else{
      const ADMINS = JSON.parse(admins);
      const admin = ADMINS.find(a => a.username === username && a.password === password);
      if(admin){
        const token = generateJWT(admin);
        res.json({message: "Admin Logged in Successfully", token});
      }else{
        res.status(404).json("Authentication failed!")
      }
    }
  })
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  newCourse.id = Math.floor(Math.random()*1000000);

  fs.readFile(COURSES_PATH, "utf-8", (err, courses) => {
    if(err) res.status(404).json({message: `Error Reading from Courses File: ${err}`});
    else{
      const COURSES = JSON.parse(courses);

      COURSES.push(newCourse);
      courses = JSON.stringify(COURSES);
      fs.writeFile(COURSES_PATH, courses, (err) => {
        if(err) res.status(403).json({message: `Error Writing to Courses File: ${err}`});
        else{
          res.json({message: "New Course Created Sucessfully", newCourse});
        }
      })
    }
  })
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  fs.readFile(COURSES_PATH, "utf-8", (err, courses) => {
    if(err) res.status(404).json({message: `Error Reading from Courses File: ${err}`});
    else{
      const COURSES = JSON.parse(courses);
      const course = COURSES.find(a => a.id === id);
      if(course){
        Object.assign(course, req.body);

        courses = JSON.stringify(COURSES);
        fs.writeFile(COURSES_PATH, courses, (err) => {
          if(err) res.status(403).json({message: `Error Writing to Courses File: ${err}`});
          else{
            res.json({message: "Course Updated Sucessfully", course});
          }
        })
      }else{
        res.status(404).json({message: "Course with this id not Found"});
      }

    }
  })
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  fs.readFile(COURSES_PATH, "utf-8", (err, courses) => {
    if(err) res.status(404).json({message: `Error Reading from Courses File: ${err}`});
    else{
      const COURSES = JSON.parse(courses);
      res.json({courses: COURSES});
    }
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const newUser = req.body;
  newUser.purchasaedCourses = [];
  fs.readFile(USERS_PATH, "utf-8", (err, users) => {
    if(err) res.status(404).json({message: `Error Reading from User File: ${err}`});
    else{
      const USERS = JSON.parse(users);
      const existingUser = USERS.find(a => a.username === newUser.username);
      if(existingUser) res.status(403).json({message: "User Already Exits"});
      else{
        USERS.push(newUser);
        users = JSON.stringify(USERS);
        fs.writeFile(USERS_PATH, users, (err) => {
          if(err) res.status(404).json({message: `Error Writing to User File: ${err}`});
          else{
            const token = generateJWT(newUser);
            res.json({message: "User Created Sucessfully", newUser, token});
          }
        })
      }
    }
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  fs.readFile(USERS_PATH, "utf-8", (err, users) => {
    if(err) res.status(404).json({message: `Error Reading from User File: ${err}`});
    else{
      const USERS = JSON.parse(users);
      const user = USERS.find(a => a.username === username && a.password === password);
      if(user){
        const token = generateJWT(user);
        res.json({message: "User Logged in Successfully", token});
      }else{
        res.status(404).json("Authentication failed!")
      }
    }
  })
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  fs.readFile(COURSES_PATH, "utf-8", (err, courses) => {
    if(err) res.status(404).json({message: `Error Reading from Courses File: ${err}`});
    else{
      const COURSES = JSON.parse(courses);
      const publishedCourses = COURSES.filter(a => a.published);
      res.json({courses: publishedCourses});
    }
  })
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  fs.readFile(COURSES_PATH, "utf-8", (err, courses) => {
    if(err) res.status(404).json({message: `Error Reading from Courses File: ${err}`});
    else{
      const COURSES = JSON.parse(courses);
      const course = COURSES.find(a => a.id === id && a.published);
      if(course){
        fs.readFile(USERS_PATH, "utf-8", (err, users) => {
          if(err) res.status(403).json({message: `failed to retrive user info for purchasing this course`, err});
          else{
            const USERS = JSON.parse(users);
            const user = USERS.find(a => a.username === req.user.username);
            if(user){
              const alreadyPurchased = user.purchasaedCourses.find(a => a.courseId === id);
              if(alreadyPurchased){
                res.status(403).json({message: "User Already Purchased this course"})
              }else{
                user.purchasaedCourses.push(id);
                users = JSON.stringify(USERS);
                fs.writeFile(USERS_PATH, users, (err) => {
                  if(err) res.status(500).json({message: "unable to update User Purchased Courses"})
                  else{
                    res.json({message: "Course Purchased successfully", id})
                  }
                })
              }
            }else{
              res.status(404).json({message: "User is not found eligible for this course"});
            }
          }
        })
      }else{
        res.status(404).json({message: "Course with this id not Found"});
      }

    }
  })
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  // logic to view purchased courses
  fs.readFile(USERS_PATH, 'utf-8', (err, users) => {
    const USERS = JSON.parse(users);
    const user = USERS.find(a => a.username === req.user.username);
    if(user){
      res.json({purchasaedCourses: user.purchasaedCourses});
    }else{
      res.status(404).json({message: "User is not found eligible for viewing purchased courses"})
    }
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
