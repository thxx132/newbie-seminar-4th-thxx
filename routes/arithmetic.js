const express = require('express');
const { z } = require('zod');
const router = express.Router();

// Zod 스키마 정의 (operation 포함)
const calcSchema = z.object({
  operation: z.enum(['add', 'sub', 'mul', 'div']),  // 허용된 연산만 포함
  a: z.coerce.number().int().nonnegative(),         // a: 0 이상의 정수
  b: z.coerce.number().int().nonnegative()          // b: 0 이상의 정수
});

// Zod 검증 미들웨어
const validateCalcInput = (req, res, next) => {
  try {
    req.params = calcSchema.parse({
      operation: req.params.operation,  // operation 검증 포함
      a: req.params.a,
      b: req.params.b
    });
    console.log('Validated params:', req.params);  // 검증된 파라미터 출력
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });  // 검증 실패 시 400 응답
  }
};

// 연산 API 라우트
router.get('/:operation/:a/:b', validateCalcInput, (req, res) => {
  const { operation, a, b } = req.params;

  let result;

  switch (operation) {
    case 'add':
      result = a + b;
      break;

    case 'sub':
      result = a - b;
      if (result < 0) {
        return res.status(400).json({ error: 'Result must be >= 0' });
      }
      break;

    case 'mul':
      result = a * b;
      if (result < 0) {
        return res.status(400).json({ error: 'Result must be >= 0' });
      }
      break;

    case 'div':
      if (b === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = a / b;
      break;

    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }

  console.log(`Operation: ${operation}, a: ${a}, b: ${b}, Result: ${result}`);  // 로그 출력
  res.json({ result });
});

module.exports = router;
