// backend/src/controllers/supportController.js
import Support from "../models/Support.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createSupportSchema, updateSupportSchema, replySupportSchema } from "../validators/supportSchemas.js";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function safeDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : new Date(0);
}

function normalizeTicketMessages(ticket) {
  const list = [];
  const rawMessages = Array.isArray(ticket?.messages) ? ticket.messages : [];
  const hasUserMessageInThread = rawMessages.some(
    (entry) => String(entry?.sender || "").toLowerCase() === "user" && String(entry?.text || "").trim()
  );
  const hasAdminMessageInThread = rawMessages.some(
    (entry) => String(entry?.sender || "").toLowerCase() === "admin" && String(entry?.text || "").trim()
  );

  const baseMessage = String(ticket?.message || "").trim();
  if (baseMessage && !hasUserMessageInThread) {
    list.push({
      sender: "user",
      text: baseMessage,
      imageUrl: String(ticket?.imageUrl || "").trim(),
      createdAt: ticket?.createdAt || new Date(),
    });
  }
  if (rawMessages.length) {
    for (const entry of rawMessages) {
      const sender = String(entry?.sender || "user").toLowerCase() === "admin" ? "admin" : "user";
      const text = String(entry?.text || "").trim();
      const imageUrl = String(entry?.imageUrl || "").trim();
      if (!text && !imageUrl) continue;
      list.push({
        sender,
        text,
        imageUrl,
        createdAt: entry?.createdAt || ticket?.updatedAt || ticket?.createdAt || new Date(),
      });
    }
  }
  const fallbackResponse = String(ticket?.response || "").trim();
  if (fallbackResponse && !hasAdminMessageInThread) {
    list.push({
      sender: "admin",
      text: fallbackResponse,
      imageUrl: "",
      createdAt: ticket?.updatedAt || ticket?.createdAt || new Date(),
    });
  }
  return list;
}

function mergeTicketsByEmail(tickets) {
  const grouped = new Map();
  for (const ticket of tickets || []) {
    const emailKey = normalizeEmail(ticket?.email) || String(ticket?._id || "");
    if (!grouped.has(emailKey)) grouped.set(emailKey, []);
    grouped.get(emailKey).push(ticket);
  }

  const merged = [];
  for (const [, emailTickets] of grouped) {
    const sortedByUpdated = [...emailTickets].sort(
      (a, b) => safeDate(b?.updatedAt).getTime() - safeDate(a?.updatedAt).getTime()
    );
    const latest = sortedByUpdated[0];
    const allMessages = emailTickets.flatMap((ticket) => normalizeTicketMessages(ticket));
    const uniqueByKey = new Map();
    for (const entry of allMessages) {
      const createdAt = safeDate(entry?.createdAt).toISOString();
      const key = `${entry?.sender || "user"}|${String(entry?.text || "").trim()}|${String(entry?.imageUrl || "").trim()}|${createdAt}`;
      if (!uniqueByKey.has(key)) {
        uniqueByKey.set(key, {
          sender: entry?.sender || "user",
          text: String(entry?.text || "").trim(),
          imageUrl: String(entry?.imageUrl || "").trim(),
          createdAt: safeDate(entry?.createdAt),
        });
      }
    }

    const messages = Array.from(uniqueByKey.values()).sort(
      (a, b) => safeDate(a?.createdAt).getTime() - safeDate(b?.createdAt).getTime()
    );
    const firstUserMessage = messages.find((entry) => entry.sender === "user" && entry.text)?.text || "";
    const lastAdminMessage = [...messages].reverse().find((entry) => entry.sender === "admin" && entry.text)?.text || "";

    merged.push({
      ...latest.toObject(),
      _id: latest._id,
      email: latest.email,
      name: latest.name,
      subject: latest.subject,
      status: latest.status,
      message: firstUserMessage,
      response: lastAdminMessage,
      imageUrl: latest.imageUrl || "",
      messages,
      createdAt: emailTickets.reduce(
        (min, ticket) => (safeDate(ticket?.createdAt) < min ? safeDate(ticket?.createdAt) : min),
        safeDate(latest?.createdAt)
      ),
      updatedAt: emailTickets.reduce(
        (max, ticket) => (safeDate(ticket?.updatedAt) > max ? safeDate(ticket?.updatedAt) : max),
        safeDate(latest?.updatedAt)
      ),
      sourceTicketCount: emailTickets.length,
    });
  }

  return merged.sort((a, b) => safeDate(b?.updatedAt).getTime() - safeDate(a?.updatedAt).getTime());
}

// @desc  Create new support request
// @route POST /api/support
// @access Public
export const createSupport = asyncHandler(async (req, res) => {
  const { error } = createSupportSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const email = normalizeEmail(req.body.email);
  const existing = await Support.findOne({ email }).sort({ updatedAt: -1 });
  const userMessage = String(req.body.message || "").trim();
  const userImage = String(req.body.imageUrl || "").trim();

  if (existing) {
    existing.name = String(req.body.name || existing.name || "").trim();
    existing.subject = String(req.body.subject || existing.subject || "").trim();
    existing.message = userMessage || existing.message;
    existing.imageUrl = userImage || existing.imageUrl || "";
    existing.messages.push({
      sender: "user",
      text: userMessage,
      imageUrl: userImage,
    });
    if (existing.status === "resolved") existing.status = "in-progress";
    await existing.save();
    return res.status(200).json(existing);
  }

  const payload = {
    ...req.body,
    email,
    messages: [
      {
        sender: "user",
        text: userMessage,
        imageUrl: userImage,
      },
    ],
  };
  const support = await Support.create(payload);
  res.status(201).json(support);
});

// @desc  Get all support requests (Admin)
// @route GET /api/support
// @access Admin
export const getSupportTickets = asyncHandler(async (req, res) => {
  const tickets = await Support.find().sort({ createdAt: -1 });
  res.json(mergeTicketsByEmail(tickets));
});

// @desc  Get current user's support requests
// @route GET /api/support/my
// @access Private
export const getMySupportTickets = asyncHandler(async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(400).json({ message: "User email missing" });
  const tickets = await Support.find({ email: normalizeEmail(email) }).sort({ createdAt: -1 });
  res.json(mergeTicketsByEmail(tickets));
});

// @desc  Update support ticket (Admin)
// @route PUT /api/support/:id
// @access Admin
export const updateSupport = asyncHandler(async (req, res) => {
  const { error } = updateSupportSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const ticket = await Support.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (typeof req.body.response === "string") {
    ticket.response = req.body.response;
  }
  if (req.body.status) ticket.status = req.body.status;
  await ticket.save();

  res.json(ticket);
});

// @desc  Add reply to support ticket (User)
// @route POST /api/support/:id/reply
// @access Private
export const addSupportReply = asyncHandler(async (req, res) => {
  const { error } = replySupportSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const ticket = await Support.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (req.user?.role !== "admin" && normalizeEmail(ticket.email) !== normalizeEmail(req.user?.email)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const sender = req.user?.role === "admin" ? "admin" : "user";
  ticket.messages.push({
    sender,
    text: req.body.message || "",
    imageUrl: req.body.imageUrl || "",
  });
  if (sender === "user" && ticket.status === "resolved") {
    ticket.status = "in-progress";
  }
  if (sender === "admin") {
    ticket.response = String(req.body.message || "").trim() || ticket.response;
    if (ticket.status === "new") ticket.status = "in-progress";
  }
  await ticket.save();

  res.json(ticket);
});
