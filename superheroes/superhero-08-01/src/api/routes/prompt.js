import { GeminiModel } from '../../model/gemini.js';

const model = new GeminiModel();

export default (app) => {
  app.post('/prompt', async (req, res) => {
    const { code } = req.body;
    const aiResponse = await model.process(code);

    return res.json({
      "response": aiResponse
    });
  });
}
