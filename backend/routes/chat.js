import express from "express";
import Thread from "../models/Thread.model.js";
import { getOpenAiResponse } from "../utils/openai.js";

const router = express.Router();

// get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch threads" });
  }
});

// get particular thread by threadId
router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch thread" });
  }
});

// delete thread by threadId
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.json({ message: "Thread deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete thread" });
  }
});

// post / chat
router.post("/chat", async (req, res) => {
  const { threadId, messages } = req.body;
  if (!threadId || !messages) {
    return res
      .status(400)
      .json({ message: "threadId and messages are required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // truncate first message to 60 chars for the title
      const title =
        messages.length > 60 ? messages.slice(0, 60) + "…" : messages;
      thread = new Thread({
        threadId,
        title,
        messages: [{ role: "user", content: messages }],
      });
    } else {
      thread.messages.push({ role: "user", content: messages });
    }

    // pass the full conversation history (role + content only) to the AI
    const historyForAI = thread.messages.map(({ role, content }) => ({
      role,
      content,
    }));

    const assistantReply = await getOpenAiResponse(historyForAI);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
