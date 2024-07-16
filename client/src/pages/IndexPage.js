import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/resumeData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load resume data");
        }
        return response.json();
      })
      .then((data) => setResumeData(data))
      .catch((error) => {
        console.error("Error loading resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      });
  }, []);

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const { name, contact, summary, summary2, experience, skills, technologies, projects, education } = resumeData;

  return (
    <div className="resume">
      <Header name={name} contact={contact} />
      <Summary summary={summary} summary2={summary2} />
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

const Summary = ({ summary, summary2 }) => (
  <section>
    <h2>Summary</h2>
    <p>{summary}</p>
    <br />
    <p>{summary2}</p> 
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