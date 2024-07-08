import { Link } from "react-router-dom";
import resumeData from "./resumeData";

export default function IndexPage() {
  const { name, contact, summary, experience, skills, technologies, projects, education } = resumeData;

  return (
    <div className="resume">
      <Header name={name} contact={contact} />
      <Summary summary={summary} />
      <Experience experiences={experience} />
      <Skills title="Languages" skills={skills} />
      <Skills title="Technologies" skills={technologies} />
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
      {['linkedin', 'website', 'github'].map(key => (
        <p key={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
          <a href={contact[key]} target="_blank" rel="noopener noreferrer">
            {contact[key]}
          </a>
        </p>
      ))}
    </div>
  </>
);

const Summary = ({ summary }) => (
  <section>
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>
);

const Experience = ({ experiences }) => (
  <section>
    <h2>Experience</h2>
    {experiences.map((exp, index) => (
      <div key={index}>
        <h3>{exp.company}</h3>
        <h4>{exp.position}</h4>
        <p className="dates">{exp.dates}</p>
        <ul className="tasks">
          {exp.tasks.map((task, taskIndex) => (
            <li key={taskIndex}>
              <h4>{task.title}</h4>
              <ul className="details">
                {task.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

const Skills = ({ title, skills }) => (
  <section>
    <h2>{title}</h2>
    <ul>
      {skills.map((skill, index) => (
        <li key={index}>
          <Link to={`/post/${skill.postId}`}>{skill.name}</Link>
        </li>
      ))}
    </ul>
  </section>
);

const Projects = ({ projects }) => (
  <section>
    <h2>Projects</h2>
    <ul>
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
  <section>
    <h2>Education</h2>
    <ul>
      {educations.map((edu, index) => (
        <li key={index}>
          <h3>{edu.institution}</h3>
          <p>{edu.degree}</p>
          <p className="dates">{edu.dates}</p>
        </li>
      ))}
    </ul>
  </section>
);