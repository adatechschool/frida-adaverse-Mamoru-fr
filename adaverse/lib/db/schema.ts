import { pgTable as table, serial, text, timestamp, date, integer } from "drizzle-orm/pg-core";

/**
 * Ada Projects Table
 * Stores the main projects from Ada Tech School curriculum
 */
export const adaProjects = table("ada_projects", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  projectName : text("project_name").notNull(), // Name of the project (e.g., "Adaverse", "Adaction")
});

/**
 * Ada Year Groups Table
 * Represents different cohorts/promotions of students
 */
export const adaPromotions = table("ada_promotions", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  promotionName : text("promotion_name").notNull(), // Name of the cohort (e.g., "Frida", "Grace", "Fatoumata", "Frances", etc...)
  startDate : date("start_date").notNull(), // Start date of the cohort (stored as DATE type)
});

/**
 * Students Table
 * Contains information about Ada Tech School students
 */
export const Students = table("students", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  name : text("name").notNull(), // Student's full name
  githubUsername : text("github_username").notNull(), // GitHub username for portfolio tracking
  promotionId : integer("promotion_id") // Foreign key to promotions
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
    title : text("title").notNull(), // Custom title given by student to their project
    image: text("image").notNull(), // URL or path to project thumbnail/screenshot
    URLName : text("url_name").notNull(), // URL-friendly slug for the project
    adaProjectID : integer("ada_project_id") // Foreign key to ada_projects table
      .references(() => adaProjects.id),
    githubRepoURL : text("github_repo_url").notNull(), // Link to the GitHub repository
    demoURL : text("demo_url"), // Optional: Link to live demo or deployed version
    createdAt : timestamp().defaultNow().notNull(), // Timestamp when record was created
    publishedAt : timestamp(), // Optional: When the project was published/completed
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
    .references(() => Students.id, { onDelete: 'cascade' }), // Auto-delete when student is deleted
  projectStudentId: integer("project_student_id")
    .notNull()
    .references(() => Projects.id, { onDelete: 'cascade' }), // Auto-delete when project is deleted
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
  createdAt: timestamp().defaultNow().notNull(),
  publishedAt: timestamp(),
});