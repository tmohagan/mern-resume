import { Link } from "react-router-dom";

export default function IndexPage() {
  const resumeData = {
    name: "Tim OHagan",
    contact: {
      email: "tmohagan@gmail.com",
      phone: "(773) 270-1142",
      website: "https://www.tim-ohagan.com/",
      linkedin: "https://www.linkedin.com/in/timothy-ohagan/",
      github: "https://github.com/tmohagan",
    },
    summary: "Tim O’Hagan is a software engineering with light full-stack experience developing ReactJS UI components and API components built on a spring framework.  His technology experience is in the healthcare and accounting spaces within Walmart where he has worked on 8 to 10 person scrum teams to build full scale applications. Tim is a recent Computer Science graduate transitioning from a Software Engineering Intern to a full-time role.",
    experience: [
      {
        company: "WALMART GLOBAL TECH",
        postition: "Software Engineer II",
        dates: "NOVEMBER 2023 - PRESENT",
        tasks: [
          {
            title: "Served as software engineer on Walmart’s Social Determinants of Health (SDOH) project as follows:",
            details: ["Participated in the planning of SDOH member experience workflow.", "Contributed to development of ReactJS modules.", "Collaborated with QE team to help implement automated tests using JavaScript."]
          },
          {
            title: "Served as software engineer on Walmart’s health clinic patient communications project as follows:",
            details: ["Participated in the planning of new middleware service.", "Contributed to development of Java Spring RESTful API middleware service.", "Collaborated with QE team to help implement automation testing."]
          }
        ]
      },
      {
        company: "WALMART GLOBAL TECH",
        postition: "Software Engineer Intern",
        dates: "FEBRUARY 2023 – NOVEMBER 2023",
        tasks: [
          {
            title: "Served as developer on Financial Technology and Accounting team as follows:",
            details: ["Gained experience working in an agile/scrum environment.", "Learned fundamentals of WCNP and Walmart’s CI/CD pipeline.", "Participated in the full software development lifecycle.", "Collaborated with team proficient in JavaScript, React, Node, Cosmos DB, Scala, Kotlin, etc. to adopt and implement best practices."]
          }
        ]
      },
    ],
    skills: [
      { name: "JavaScript", postId: "6672fe174f36148307da8828" },
      { name: "React", postId: "6672feca4f36148307da883c" },
      { name: "Java", postId: "6672fd304f36148307da881a" },
      { name: "Python", postId: "6672ff524f36148307da8840" },
      { name: "Kotlin", postId: "6672fd9a4f36148307da8826" },    
      { name: "Scala", postId: "6672ff164f36148307da883e" },
      { name: "SQL", postId: "6672ff9b4f36148307da8842" }
    ],
    technologies: [
      { name: "Git", postId: "0" },
      { name: "Spring", postId: "0" },
      { name: "Micro Services", postId: "0" },
      { name: "MongoDB", postId: "6673015a4f36148307da884e" },
      { name: "Maven", postId: "0" },
      { name: "CI/CD", postId: "0" },
      { name: "Docker", postId: "667cc433d418a4bbdefa6407" },
      { name: "AWS S3", postId: "0" },
      { name: "WCNP", postId: "0" },
      { name: "Concord", postId: "0" },
      { name: "Looper", postId: "0" },
      { name: "Kubernetes", postId: "0" },
      { name: "Test Automation", postId: "0" },
      
    ],
    projects: [
      {
        title: "tim-ohagan.com (this site)",
        description: "This site was created using JavaScript, React, Node.js, Express, MongoDB. Images hosted on AWS S3. Deployed to Vercel",
        projectId: "6673854c4ae6fd43d7f797ac"
      },
      {
        title: "python - sentiment analysis",
        description: "Python Vader sentiment analysis micro service. Deployed to Vercel",
        projectId: "667c4a5ab3f6a3d01abbaaad"
      },
      {
        title: "java - image resizer",
        description: "Java image resizer micro service. GitHub actions, containerized on Docker Hub, deployed to Render cloud platform",
        projectId: "667cc51ad418a4bbdefa640d"
      },
    ],
    education: [
      {
        institution: "SOUTHERN NEW HAMPSHIRE UNIVERSITY",
        degree: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
        dates: "NOVEMBER 2023"
      }
    ]
  };

  return (
    <div className="resume">
      <Header name={resumeData.name} contact={resumeData.contact} />

      <Summary summary={resumeData.summary} />

      <Experience experiences={resumeData.experience} />

      <Skills skills={resumeData.skills} />
      <Technologies technologies={resumeData.technologies} />
      <Projects projects={resumeData.projects} />
      <Education educations={resumeData.education} />
    </div>
  );
}

// Header Component
const Header = ({ name, contact }) => (
  <>
    <h1>{name}</h1>
    <div className="contact">
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
      <p>LinkedIn: {' '}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
        linkedin.com/in/timothy-ohagan/
        </a>
      </p>
      <p>Website: {' '}
        <a href={contact.website} target="_blank" rel="noopener noreferrer">
          tim-ohagan.com
        </a>
      </p>
      <p>GitHub: {' '}
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
        github.com/tmohagan
        </a>
      </p>
    </div>
  </>
);

// Summary Component
const Summary = ({ summary }) => (
  <section className="summary">
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>
);

// Experience Component
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

// ExperienceItem Component
const ExperienceItem = ({ exp }) => (
  <li>
    <h3>{exp.company}</h3>
    <h4>{exp.postition}</h4>
    <p className="dates">{exp.dates}</p>
    <ul className="tasks">
      {exp.tasks.map((task, taskIndex) => (
        <TaskItem key={taskIndex} task={task} />
      ))}
    </ul>
  </li>
);

// TaskItem Component
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

// Skills Component
const Skills = ({ skills }) => (
  <section className="skills">
    <h2>Languages</h2>
    <ul className="skills-list">
      {skills.map((skill, index) => (
        <li key={index}>
          <Link to={`/post/${skill.postId}`}>
            {skill.name}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

// Technologies Component
const Technologies = ({ technologies }) => (
  <section className="skills">
    <h2>Technologies</h2>
    <ul className="skills-list">
      {technologies.map((tech, index) => (
        <li key={index}>
          <Link to={`/post/${tech.postId}`}>
            {tech.name}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

// Projects Component
const Projects = ({ projects }) => (
  <section className="skills">
    <h2>Projects</h2>
    <ul className="skills-list">
      {projects.map((project, index) => (
        <li key={index}>
          <Link to={`/project/${project.projectId}`}>
            {project.title}
          </Link>
          <p>{project.description}</p>
        </li>
      ))}
    </ul>
  </section>
);

/* Projects Component
const Projects = ({ projects }) => (
  <section className="projects">
    <h2>Projects</h2>
    <ul>
      {projects.map((project, index) => (
        <li key={index}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </li>
      ))}
    </ul>
  </section>
);
*/

// Education Component
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
