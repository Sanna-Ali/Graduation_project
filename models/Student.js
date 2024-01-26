const mongoose = require("mongoose");
const Joi = require("joi");

const studentSchema = new mongoose.Schema(
  {
    universityid: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    midname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    // confirmPassword: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minlength: 8,
    // },
    mobilenumber: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      enum: [4, 5],
    },
    classe: {
      type: String,
    },
    role: {
      type: String,
      default: "student",
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// User Model
const Student = mongoose.model("Student", studentSchema);

function validateRegisterStudent(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().required().messages({
      "string.base": "الاسم يجب أن يكون نصا",
      "string.empty": "الاسم الأول لا يمكن أن يكون فارغا",
      "any.required": "الاسم الأول مطلوب",
    }),
    midname: Joi.string().trim().required().messages({
      "string.base": "اسم الأب يجب أن يكون نصا",
      "string.empty": "اسم الأب لا يمكن أن يكون فارغا",
      "any.required": "اسم الأب مطلوب",
    }),
    lastname: Joi.string().trim().required().messages({
      "string.base": "الكنية يجب أن تكون نصا",
      "string.empty": "الكنية  لا يمكن أن تكون فارغة",
      "any.required": "الكنية مطلوبة",
    }),
    email: Joi.string().trim().required().email().messages({
      "string.base": "الايمبل يجب أن يكون نصا",
      "string.empty": "الايميل لا يمكن أن يكون فارغا",
      "string.email": "الايمبل يجب أن يكون صحيح",
      "any.required": "الايميل مطلوب ",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "كلمةالمرور يجب أن تكون نصا",
      "string.empty": "  كلمةالمرو لا يمكن أن تكون فارغة",
      "any.required": "كلمةالمرور مطلوبة",
      "string.min": "كلمةالمرور يجب أن تكون 8 محارف على الاقل",
    }),
    confirmPassword: Joi.string().trim().min(8).required().messages({
      "string.base": "يجب أن يكون تأكيد كلمة المرور سلسلة نصية.",
      "string.empty": "تأكيد كلمة المرور يجب ألا يكون فارغًا.",
      "string.min": "يجب أن يكون تأكيد كلمة المرور على الأقل 8 أحرف.",
      "any.required": "تأكيد كلمة المرور مطلوب.",
    }),
    universityid: Joi.string().min(2).max(4).required().messages({
      "string.base": "الرقم الجامعي يجب أن يكون نصا",
      "string.empty": " الرقم الجامعي لا يمكن أن يكون فارغا",
      "any.required": "الرقم الجامعي مطلوب",
      "string.min": "الرقم الجامعي يجب أن يكون خانتين على الاقل",
      "string.max": "الرقم الجامعي يجب أن يكون 4 خانات على الاكثر",
    }),
    mobilenumber: Joi.string().min(10).max(10).required().messages({
      "string.base": "رقم الجوال يجب أن يكون نصا",
      "string.empty": " رقم الجوال لا يمكن أن يكون فارغا",
      "any.required": "رقم الجوال مطلوب",
      "string.min": "رقم الجوال يجب أن يكون  10 خانات على الاقل",
      "string.max": "رقم الجوال يجب أن يكون 10 خانات على الاكثر",
    }),
    year: Joi.number().min(4).max(5).required().messages(),
    class: Joi.string(),
    role: Joi.string(),
  });
  return schema.validate(obj);
}

// التحقق من صحة بيانات تحديث الطالب
function validateUpdateStudent(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(2).max(50).messages({
      "string.base": "يجب أن يكون الاسم الأول سلسلة نصية.",
      "string.empty": "لا يجب أن يكون الاسم الأول فارغًا.",
      "string.min": "يجب أن يكون الاسم الأول على الأقل من 2 أحرف.",
      "string.max": "يجب ألا يتجاوز الاسم الأول 50 حرفًا.",
    }),
    midname: Joi.string().trim().min(2).max(100).messages({
      "string.base": "يجب أن يكون الاسم الأوسط سلسلة نصية.",
      "string.empty": "لا يجب أن يكون الاسم الأوسط فارغًا.",
      "string.min": "يجب أن يكون الاسم الأوسط على الأقل من 2 أحرف.",
      "string.max": "يجب ألا يتجاوز الاسم الأوسط 100 حرفٍ.",
    }),
    lastname: Joi.string().trim().min(2).max(100).messages({
      "string.base": "يجب أن يكون الاسم الأخير سلسلة نصية.",
      "string.empty": "لا يجب أن يكون الاسم الأخير فارغًا.",
      "string.min": "يجب أن يكون الاسم الأخير على الأقل من 2 أحرف.",
      "string.max": "يجب ألا يتجاوز الاسم الأخير 100 حرفٍ.",
    }),
    universityid: Joi.string().min(2).max(4).messages(),
    mobilenumber: Joi.string().min(10).max(10).messages(),
    year: Joi.number().min(4).max(5).messages(),
    class: Joi.string(),
  });
  return schema.validate(obj);
}
// Validate Login User
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().required().email().messages({
      "string.base": "يجب أن يكون عنوان البريد الإلكتروني سلسلة نصية.",
      "string.empty": "لا يجب أن يكون عنوان البريد الإلكتروني فارغًا.",
      "any.required": "عنوان البريد الإلكتروني مطلوب.",
      "string.email": "يجب أن يكون عنوان البريد الإلكتروني صالحًا.",
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "يجب أن تكون كلمة المرور سلسلة نصية.",
      "string.empty": "لا يجب أن تكون كلمة المرور فارغة.",
      "string.min": "يجب أن تكون كلمة المرور على الأقل 8 أحرف.",
      "any.required": "كلمة المرور مطلوبة.",
    }),
  });
  return schema.validate(obj);
}

module.exports = {
  Student,
  validateRegisterStudent,
  validateUpdateStudent,
  validateLoginUser,
};
