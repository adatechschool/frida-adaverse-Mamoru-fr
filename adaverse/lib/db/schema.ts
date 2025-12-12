import {pgTable as table, serial, text, timestamp, date, integer, boolean, index} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

/**
 * Ada Projects Table
 * Stores the main projects from Ada Tech School curriculum
 */
export const adaProjects = table("ada_projects", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  projectName: text("project_name").notNull(), // Name of the project (e.g., "Adaverse", "Adaction")
});

/**
 * Ada Year Groups Table
 * Represents different cohorts/promotions of students
 */
export const adaPromotions = table("ada_promotions", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  promotionName: text("promotion_name").notNull(), // Name of the cohort (e.g., "Frida", "Grace", "Fatoumata", "Frances", etc...)
  startDate: date("start_date").notNull(), // Start date of the cohort (stored as DATE type)
});

/**
 * Students Table
 * Contains information about Ada Tech School students
 */
export const Students = table("students", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  name: text("name").notNull(), // Student's full name
  githubUsername: text("github_username").notNull(), // GitHub username for portfolio tracking
  promotionId: integer("promotion_id") // Foreign key to promotions
    .notNull()
    .references(() => adaPromotions.id), // Links student to their cohort
});

/**
 * Projects Students Table (Junction/Many-to-Many Table)
 * Links students to their individual project submissions
 * One student can have multiple projects, one project type can have multiple student submissions
 */
export const Projects = table("projects_students", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  title: text("title").notNull(), // Custom title given by student to their project
  image: text("image").notNull(), // URL or path to project thumbnail/screenshot
  URLName: text("url_name").notNull(), // URL-friendly slug for the project
  adaProjectID: integer("ada_project_id") // Foreign key to ada_projects table
    .references(() => adaProjects.id),
  githubRepoURL: text("github_repo_url").notNull(), // Link to the GitHub repository
  demoURL: text("demo_url"), // Optional: Link to live demo or deployed version
  userID: text("user_id").notNull().references(() => user.id), // Identifier for the student/user who submitted the project
  createdAt: timestamp().defaultNow().notNull(), // Timestamp when record was created
  publishedAt: timestamp(), // Optional: When the project was published/completed
});

/**
 * Student to Projects Junction Table
 * Links students to their project submissions with cascade delete behavior
 * If a student or project is deleted, the relationship records are automatically removed
 */
export const StudentToProjects = table("student_to_projects", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => Students.id, {onDelete: 'cascade'}), // Auto-delete when student is deleted
  projectStudentId: integer("project_student_id")
    .notNull()
    .references(() => Projects.id, {onDelete: 'cascade'}), // Auto-delete when project is deleted
});

/**
 * Pending Projects Table
 * Stores project submissions awaiting approval
 * These are added via the "Add Project" form and need admin approval before being moved to projects_students
 */
export const PendingProjects = table("pending_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  URLName: text("url_name").notNull(),
  adaProjectID: integer("ada_project_id").references(() => adaProjects.id),
  githubRepoURL: text("github_repo_url").notNull(),
  demoURL: text("demo_url"),
  studentIds: text("student_ids").notNull(), // Comma-separated student IDs (e.g., "1,2,3")
  userID: text("user_id").notNull().references(() => user.id), // Identifier for the student/user who submitted the project
  createdAt: timestamp().defaultNow().notNull(),
  publishedAt: timestamp(),
});

/**
 * Comments Table
 * Stores user comments on projects
 */
export const Comments = table("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => Projects.id, {onDelete: 'cascade'}),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const user = table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  banned: boolean("banned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = table(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = table(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {onDelete: "cascade"}),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = table(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({many}) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({one}) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({one}) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));