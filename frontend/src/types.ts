export interface User { id: string; email: string }
export interface Note { id: string; userId: string; title: string; content: string; createdAt: string; updatedAt: string }
export interface Credentials { email: string; password: string }
export interface NewNote { title: string; content: string }
