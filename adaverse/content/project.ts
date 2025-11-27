import {Student} from "./student";

export type Project = {
    id : number;
    title : string;
    image: string;
    students : Student[] | undefined;
    URLName : string;
    adaProjectID : number;
    githubRepoURL : string;
    demoURL : string | null;
    createdAt : string;
    publishedAt : string | null;
}