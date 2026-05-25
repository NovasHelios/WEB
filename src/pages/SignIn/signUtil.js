


// 스텝별 필드 검사 규칙 정의
export const required = (message) => ({ check: (v) => !v, message });
export const format = (regex, message) => ({check: (v) => !regex.test(v), message,});

export const BUSINESS_VALIDATIONS = [
  { field: "name", rules: [required("이름이 입력되지 않았습니다.")] },
  { field: "pNumber", rules: [required("전화번호가 입력되지 않았습니다.")] },
  { field: "cName", rules: [required("회사명이 입력되지 않았습니다.")] },
  {
    field: "cEmail",
    rules: [
      required("이메일이 입력되지 않았습니다."),
      format(/@/, "이메일 형식이 올바르지 않습니다."),
    ],
  },
  { field: "password", rules: [required("비밀번호가 입력되지 않았습니다.")] },
  {
    field: "businessNumber",
    rules: [required("사업자 번호가 입력되지 않았습니다.")],
  },
];

export const validateFields = (validations, form) => {
  const errors = {};
  for (const { field, rules } of validations) {
    for (const rule of rules) {
      if (rule.check(form[field])) {
        errors[field] = rule.message;
        break;
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};