const { Student, validateRegisterStudent } = require("../models/Student");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { generateAuthToken } = require("../MiddleWare/generateToken");

/**-----------------------------------------------
 * @desc    Register New User
 * @route   /api/auth/register
 * @method  POST
 * @access  public
 ------------------------------------------------*/
const register = asyncHandler(async (req, res) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({ message: "كلمة المرور غير متطابقة " });
  }
  let error;
  if (req.body.role === "student") {
    error = validateRegisterStudent(req.body).error;
  } else if (req.body.role === "patient") {
    error = validateRegisterUser(req.body).error;
  }
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {
    universityid,
    mobilenumber,
    firstname,
    midname,
    lastname,
    email,
    password,
    year,
    role,
<<<<<<< HEAD
    confirmPassword,
=======
>>>>>>> b1a1c99a2d04bb0d05a80d587f51850a1a58ecaf
    classe,
  } = req.body;

  let patient, student;
  student = await Student.findOne({ email });
  patient = await User.findOne({ email });
  if (patient || student) {
    return res.status(400).json({ message: "الايميل مسجل مسبقاً" });
  }
  if (role == "student") {
    student = await Student.findOne({ universityid });
  }
  if (student) {
    return res.status(400).json({ message: "الرقم الجامعي موجود سابقاً" });
  }
<<<<<<< HEAD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
=======
  console.log(1)
  const salt = await bcrypt.genSalt(10);
  console.log(2)
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(3)
>>>>>>> b1a1c99a2d04bb0d05a80d587f51850a1a58ecaf
  let user;
  if (role === "student") {
    user = new Student({
      universityid,
      firstname,
      midname,
      lastname,
      email,
      password: hashedPassword,
      year,
      role,
      classe,
      mobilenumber,
    });
  }
  if (role === "patient") {
    user = new User({
      firstname,
      midname,
      lastname,
      email,
      password: hashedPassword,
      role,
      mobilenumber,
    });
  }
  await user.save();
  // Creating new VerificationToken & save it toDB
  const verifictionToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verifictionToken.save();

  // Making the link
  const link = `${process.env.CLIENT_DOMAIN}/api/auth/${user._id}/verify/${verifictionToken.token}`;

  // Putting the link into an html template
  const htmlTemplate = `
      <div>
        <p> اضغط على الرابط للتحقق من الايميل </p>
        <a href="${link}"> تحقق </a>
      </div>`;

  // Sending email to the user
  await sendEmail(user.email, "تحقق من الايميل", htmlTemplate);

  // Response to the client
  res.status(201).json({
    message: "تم ارسال رسالة الى بريدك يرجى التحقق من الايميل ",
  });
});

/**-----------------------------------------------
 * @desc    Login User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
const login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email } = req.body;
  let user = null;
  const patient = await User.findOne({ email });
  const student = await Student.findOne({ email });
  if (patient) {
    user = patient;
  }
  if (student) {
    user = student;
  }
  if (!user) {
    return res.status(400).json({ message: "الايميل او كلمة السر غير صحيحة " });
  }
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "الايميل او كلمة السر غير صحيحة " });
  }

  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });

    if (!verificationToken) {
      verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();
    }

    const link = `${process.env.CLIENT_DOMAIN}/api/auth/${user._id}/verify/${verificationToken.token}`;

    const htmlTemplate = `
      <div>
        <p> اضغط على الرابط للتحقق من الايميل </p>
        <a href="${link}"> تحقق </a>
      </div>`;

    // Sending email to the user
    await sendEmail(user.email, "تحقق من الايميل", htmlTemplate);

    return res.status(400).json({
      message: "تم ارسال رسالة الى بريدك يرجى التحقق من الايميل ",
    });
  }

  const token = generateAuthToken(user);
  res.status(200).json({
    _id: user._id,
    role: user.role,
    token,
  });
});

/**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
const verifyUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "الرابط غير صحيح " });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "الرابط غير صحيح " });
  }
  user.isAccountVerified = true;
  await user.save();

  await verificationToken.deleteOne();

  res.status(200).json({
    message: "تم التحقق من حسابك بنجاح ،يرجى تسجيل الدخول ",
  });
});

module.exports = {
  register,
  login,
  verifyUserAccount,
};
