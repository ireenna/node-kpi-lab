export const UserResponse = {
    200: {
        type: "object",
        properties: {
            _id: { type: "string"},
            email: { type: "string" },
            name: { type: "string"},
            avatar: { type: "string" },
            isAdmin: { type: "boolean" },
            posts: {
                type: "array",
                items: {
                    type:"string"
                }
            }
        }
    }
    
} as const;

export const UsersArrayResponse = {
    200: {
        type: "array",
        items: {
            type: "object",
            properties: {
                _id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                avatar: { type: "string" },
                isAdmin: { type: "boolean" },
                posts: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                created_at: { type: "string" },
                updated_at: { type: "string" }
            }
        }
    }

} as const;

export const UserFullResponse = {
    200: {
        type: "object",
        properties: {
            _id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            avatar: { type: "string" },
            isAdmin: { type: "boolean" },
            posts: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            created_at: { type: "string" },
            updated_at: { type: "string" }
        }
    }

} as const;

export const PostResponse = {
    200: {
        type: "object",
        properties: {
            _id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            category: { type: "string" },
            creator: { type: "string" },
            tags: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        }
    }

} as const;

export const PostArrayResponse = {
    200: {
        type: "array",
        items: {
            type: "object",
            properties: {
                _id: { type: "string" },
                title: { type: "string" },
                content: { type: "string" },
                category: { type: "string" },
                creator: { type: "string" },
                tags: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        }
    }

} as const;