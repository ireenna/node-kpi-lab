export const EditPostValidate = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 2 },
    content: { type: "string", minLength: 5 },
    tags: { type: "array", items: { type: "string" } },
    category: { type: "string" },
  },
} as const;

export const CreatePostValidate = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 2 },
    content: { type: "string", minLength: 5 },
    tags: { type: "array", items: { type: "string" } },
    category: { type: "string" },
  },
  required: ["title", "content"],
} as const;
