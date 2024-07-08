import { Link } from "react-router-dom";
import resumeData from "./resumeData";

export default function IndexPage() {
  const { name, contact, summary, experience, skills, technologies, projects, education } = resumeData;

  return (
    <div className="resume">
      <Header name={name} contact={contact} />
      <Summary summary={summary} />
      <Experience experiences={experience} />
      <Skills skills={skills} />
      <Technologies technologies={technologies} />
      <Projects projects={projects} />
      <Education educations={education} />
    </div>
  );
}

const Header = ({ name, contact }) => (
  <>
    <h1>{name}</h1>
    <div className="contact">
      <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
      <p>Phone: <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
      <p>LinkedIn:{' '}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          linkedin.com/in/timothy-ohagan/
        </a>
      </p>
      <p>Website:{' '}
        <a href={contact.website} target="_blank" rel="noopener noreferrer">
          tim-ohagan.com
        </a>
      </p>
      <p>GitHub:{' '}
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          github.com/tmohagan
        </a>
      </p>
    </div>
  </>
);

const Summary = ({ summary }) => (
  <section className="summary">
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>
);

const Experience = ({ experiences }) => (
  <section className="experience">
    <h2>Experience</h2>
    <ul>
      {experiences.map((exp, index) => (
        <ExperienceItem key={index} exp={exp} />
      ))}
    </ul>
  </section>
);

const ExperienceItem = ({ exp }) => (
  <li>
    <h3>{exp.company}</h3>
    <h4>{exp.position}</h4>
    <p className="dates">{exp.dates}</p>
    <ul className="tasks">
      {exp.tasks.map((task, taskIndex) => (
        <TaskItem key={taskIndex} task={task} />
      ))}
    </ul>
  </li>
);

const TaskItem = ({ task }) => (
  <li>
    <h4>{task.title}</h4>
    <ul className="details">
      {task.details.map((detail, detailIndex) => (
        <li key={detailIndex}>{detail}</li>
      ))}
    </ul>
  </li>
);

const Skills = ({ skills }) => (
  <section className="skills">
    <h2>Languages</h2>
    <ul className="skills-list">
      {skills.map((skill, index) => (
        <li key={index}>
          <Link to={`/post/${skill.postId}`}>{skill.name}</Link>
        </li>
      ))}
    </ul>
  </section>
);

const Technologies = ({ technologies }) => (
  <section className="skills">
    <h2>Technologies</h2>
    <ul className="skills-list">
      {technologies.map((tech, index) => (
        <li key={index}>
          <Link to={`/post/${tech.postId}`}>{tech.name}</Link>
        </li>
      ))}
    </ul>
  </section>
);

const Projects = ({ projects }) => (
  <section className="skills">
    <h2>Projects</h2>
    <ul className="skills-list">
      {projects.map((project, index) => (
        <li key={index}>
          <Link to={`/project/${project.projectId}`}>{project.title}</Link>
          <p>{project.description}</p>
        </li>
      ))}
    </ul>
  </section>
);

const Education = ({ educations }) => (
  <section className="education">
    <h2>Education</h2>
    <ul>
      {educations.map((edu, index) => (
        <li key={index}>
          <h3>{edu.institution}</h3>
          <p className="degree">{edu.degree}</p>
          <p className="dates">{edu.dates}</p>
        </li>
      ))}
    </ul>
  </section>
);