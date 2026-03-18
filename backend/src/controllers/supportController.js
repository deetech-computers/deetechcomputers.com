// backend/src/controllers/supportController.js
import Support from "../models/Support.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createSupportSchema, updateSupportSchema, replySupportSchema } from "../validators/supportSchemas.js";

// @desc  Create new support request
// @route POST /api/support
// @access Public
export const createSupport = asyncHandler(async (req, res) => {
  const { error } = createSupportSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const payload = {
    ...req.body,
    messages: [
      {
        sender: "user",
        text: req.body.message,
        imageUrl: req.body.imageUrl || "",
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
  res.json(tickets);
});

// @desc  Get current user's support requests
// @route GET /api/support/my
// @access Private
export const getMySupportTickets = asyncHandler(async (req, res) => {
  const email = req.user?.email;
  if (!email) return res.status(400).json({ message: "User email missing" });
  const tickets = await Support.find({ email }).sort({ createdAt: -1 });
  res.json(tickets);
});

// @desc  Update support ticket (Admin)
// @route PUT /api/support/:id
// @access Admin
export const updateSupport = asyncHandler(async (req, res) => {
  const { error } = updateSupportSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const ticket = await Support.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (req.body.response && req.body.response !== ticket.response) {
    ticket.messages.push({
      sender: "admin",
      text: req.body.response,
    });
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

  if (req.user?.role !== "admin" && ticket.email !== req.user?.email) {
    return res.status(403).json({ message: "Not allowed" });
  }

  ticket.messages.push({
    sender: "user",
    text: req.body.message || "",
    imageUrl: req.body.imageUrl || "",
  });
  ticket.status = ticket.status === "resolved" ? "in-progress" : ticket.status;
  await ticket.save();

  res.json(ticket);
});
