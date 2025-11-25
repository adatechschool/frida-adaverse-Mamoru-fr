import { pgTable as table, serial, text, timestamp, date } from "drizzle-orm/pg-core";

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
export const adaYearGroups = table("ada_year_groups", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  yearGroupName : text("year_group_name").notNull(), // Name of the cohort (e.g., "Frida", "Grace", "Fatoumata", "Frances", etc...)
  startDate : date("start_date").notNull(), // Start date of the cohort (stored as DATE type)
});

/**
 * Students Table
 * Contains information about Ada Tech School students
 */
export const Students = table("students", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  Name : text("name").notNull(), // Student's full name
  GithubUsername : text("github_username").notNull(), // GitHub username for portfolio tracking
  yearGroupId : serial("year_group_id") // Foreign key to ada_year_groups
    .notNull()
    .references(() => adaYearGroups.id), // Links student to their cohort
});

/**
 * Projects Students Table (Junction/Many-to-Many Table)
 * Links students to their individual project submissions
 * One student can have multiple projects, one project type can have multiple student submissions
 */
export const ProjectsStudents = table("projects_students", {
    id: serial("id").primaryKey(), // Auto-incrementing primary key
    title : text("title").notNull(), // Custom title given by student to their project
    image: text("image").notNull(), // URL or path to project thumbnail/screenshot
    URLName : text("url_name").notNull(), // URL-friendly slug for the project
    adaProjectID : serial("ada_project_id") // Foreign key to ada_projects table
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
  studentId: serial("student_id")
    .notNull()
    .references(() => Students.id, { onDelete: 'cascade' }), // Auto-delete when student is deleted
  projectStudentId: serial("project_student_id")
    .notNull()
    .references(() => ProjectsStudents.id, { onDelete: 'cascade' }), // Auto-delete when project is deleted
});