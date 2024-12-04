const express = require('express');
const router = express.Router();

const fs = require('fs');

const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf-8'));
const language = 'vi'; // Mặc định tiếng Việt, bạn có thể thêm logic để thay đổi

router.post('/', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let response = "Xin lỗi, tôi chưa hiểu yêu cầu của bạn.";

    const langRules = rules[language];
    for (let rule of langRules) {
        if (userMessage.includes(rule.keyword)) {
            response = rule.response;
            break;
        }
    }

    res.json({ botMessage: response });
});



module.exports = router;
