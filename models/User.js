const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
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
      maxlength: 50,
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

    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// User Model
const User = mongoose.model("User", userSchema);

function validateRegisterUser(obj) {
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
    mobilenumber: Joi.string().min(10).max(10).required().messages({
      "string.base": "رقم الجوال يجب أن يكون نصا",
      "string.empty": " رقم الجوال لا يمكن أن يكون فارغا",
      "any.required": "رقم الجوال مطلوب",
      "string.min": "رقم الجوال يجب أن يكون  10 خانات على الاقل",
      "string.max": "رقم الجوال يجب أن يكون 10 خانات على الاكثر",
    }),
    role: Joi.string(),
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

// Valider les données de mise à jour de l'utilisateur
function validateUpdateUser(obj) {
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
    mobilenumber: Joi.string().min(10).max(10).messages({
      "string.base": "يجب أن يكون رقم الهاتف المحمول سلسلة نصية.",
      "string.empty": "لا يجب أن يكون رقم الهاتف المحمول فارغًا.",
      "string.min": "يجب أن يكون رقم الهاتف المحمول على الأقل 10 أرقام.",
      "string.max": "يجب ألا يتجاوز رقم الهاتف المحمول 10 أرقام.",
    }),
  });
  return schema.validate(obj);
}
/// Valider l'adresse email
function validateEmail(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email().messages({
      "string.base": "يجب أن يكون عنوان البريد الإلكتروني سلسلة نصية.",
      "string.empty": "عنوان البريد الإلكتروني يجب ألا يكون فارغًا.",
      "string.min": "يجب أن يكون عنوان البريد الإلكتروني على الأقل 5 أحرف.",
      "string.max": "يجب ألا يزيد عنوان البريد الإلكتروني عن 100 حرف.",
      "any.required": "عنوان البريد الإلكتروني مطلوب.",
    }),
  });
  return schema.validate(obj);
}
// Valider le nouveau mot de passe
function validateNewPassword(obj) {
  const schema = Joi.object({
    password: Joi.string().required().messages({
      "any.required": "كلمة المرور مطلوبة.",
      "string.min": "يجب أن تحتوي كلمة المرور على الأقل 8 أحرف.",
    }),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateEmail,
  validateNewPassword,
};
